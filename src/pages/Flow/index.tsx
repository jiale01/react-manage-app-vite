import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
  type Connection,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Space, message } from 'antd';
import { DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { Sidebar } from './Sidebar';
import { nodeTypes } from './CustomNodes';
import { useDispatch } from 'react-redux';
import { clearAllNodeData } from '@/store/modules/flow';

// 生成唯一 ID
let nodeId = 0;
const generateNodeId = (type: string) => `${type}-${++nodeId}`;

const CreateFlow = () => {
  const dispatch = useDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // 节点和连线的状态管理 - 显式指定泛型类型
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  /**
   * 处理拖拽开始
   * 设置拖拽数据，包含节点类型
   */
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  /**
   * 处理拖拽到画布
   * 计算位置并创建新节点
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (!type || !reactFlowWrapper.current) {
        return;
      }

      // 获取画布的边界信息
      const bounds = reactFlowWrapper.current.getBoundingClientRect();

      // 计算相对于画布的坐标
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      // 生成唯一节点 ID
      const newNodeId = generateNodeId(type);

      // 创建新节点
      const newNode: Node = {
        id: newNodeId,
        type,
        position,
        data: { label: `${type} node` },
      };

      // 添加节点到画布
      setNodes((nds) => [...nds, newNode]);

      message.success(`已添加${getNodeLabel(type)}（ID: ${newNodeId}）`);
    },
    [setNodes]
  );

  // 阻止默认拖拽行为
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * 处理连线
   */
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      message.success('连线成功！');
    },
    [setEdges]
  );

  /**
   * 处理节点选择变化
   */
  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    // 可以在这里添加选中节点后的逻辑，比如显示属性面板等
    console.log('选中的节点:', params.nodes);
    console.log('选中的连线:', params.edges);
  }, []);

  /**
   * 删除选中节点
   */
  const handleDeleteSelected = () => {
    const selectedNodes = nodes.filter((node): node is Node => node.selected === true);
    if (selectedNodes.length === 0) {
      message.warning('请先选择要删除的节点');
      return;
    }

    const selectedIds = selectedNodes.map(node => node.id);

    // 删除节点
    setNodes((nds) => nds.filter(node => !selectedIds.includes(node.id)));

    // 删除相关连线
    setEdges((eds) =>
      eds.filter(edge =>
        !selectedIds.includes(edge.source) && !selectedIds.includes(edge.target)
      )
    );

    message.success(`已删除 ${selectedNodes.length} 个节点`);
  };

  /**
   * 清空画布
   */
  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    dispatch(clearAllNodeData());
    nodeId = 0; // 重置 ID 计数器
    message.success('画布已清空');
  };

  // 获取节点类型的中文标签
  const getNodeLabel = (type: string) => {
    const labels: Record<string, string> = {
      start: '开始节点',
      process: '处理节点',
      end: '结束节点',
    };
    return labels[type] || type;
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      {/* 左侧边栏 */}
      <Sidebar onDragStart={onDragStart} />

      {/* 右侧画布 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 工具栏 */}
        <div style={{
          padding: '12px 16px',
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>🎨 工作流编排</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#999' }}>
              从左侧拖拽节点，连接后可实时查看数据流动
            </p>
          </div>

          <Space>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDeleteSelected}
              danger
            >
              删除选中
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearCanvas}
            >
              清空画布
            </Button>
          </Space>
        </div>

        {/* React Flow 画布 */}
        <div ref={reactFlowWrapper} style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
            selectNodesOnDrag={false}
          >
            <Background />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default CreateFlow;
