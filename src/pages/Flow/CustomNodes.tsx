import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Input, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeData } from '@/store/modules/flow';
import type { RootState } from '@/store';

// ==================== 开始节点 ====================
interface StartNodeProps {
  id: string;
  data: any;
}

export const StartNode = memo(({ id, data, selected }: StartNodeProps & { selected?: boolean }) => {
  const dispatch = useDispatch();

  // 从 Redux 中读取当前节点的数据
  const nodeData = useSelector((state: RootState) =>
    state.flow.nodeDataMap[id]
  );

  // 处理输入变化，更新 Redux Store
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateNodeData({
      nodeId: id,
      data: { output: e.target.value }
    }));
  };

  return (
    <Card
      title="🚀 开始节点"
      size="small"
      style={{
        width: 250,
        border: selected ? '3px solid #52c41a' : '2px solid #52c41a',
        boxShadow: selected
          ? '0 4px 12px rgba(82, 196, 26, 0.4)'
          : '0 2px 8px rgba(82, 196, 26, 0.2)',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: '#666' }}>输出数据：</label>
      </div>
      <Input
        placeholder="请输入数据..."
        value={nodeData?.output || ''}
        onChange={handleInputChange}
        size="small"
      />
      {/* 输出手柄 - 连接到下游节点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#52c41a' }}
      />
    </Card>
  );
});

StartNode.displayName = 'StartNode';

// ==================== 处理节点（核心难点）====================
interface ProcessNodeProps {
  id: string;
  data: any;
}

export const ProcessNode = memo(({ id, data, selected }: ProcessNodeProps & { selected?: boolean }) => {
  const dispatch = useDispatch();
  // 使用 useReactFlow 获取当前的 edges（连线）和 nodes（节点）
  const { getEdges } = useReactFlow();

  /**
   * 【核心逻辑】获取上游节点的数据
   * 
   * 步骤说明：
   * 1. 通过 getEdges() 获取所有连线
   * 2. 过滤出指向当前节点的连线（target === id）
   * 3. 提取这些连线的 source（上游节点 ID）
   * 4. 使用 useSelector 订阅整个 nodeDataMap，然后从中提取上游节点数据
   * 
   * ⚠️ 重要：不能在 .map() 循环中调用 useSelector，这会违反 Hooks 规则
   * 正确做法：一次性订阅整个 nodeDataMap，然后在渲染时提取需要的数据
   */

  // ✅ 正确做法：在顶层一次性订阅整个 nodeDataMap
  const allNodeData = useSelector((state: RootState) =>
    state.flow.nodeDataMap
  );

  // 获取所有指向当前节点的连线
  const incomingEdges = getEdges().filter(edge => edge.target === id);

  // 提取上游节点 ID 列表
  const upstreamNodeIds = incomingEdges.map(edge => edge.source);

  // 从已订阅的 allNodeData 中提取上游节点数据（这不是 Hook 调用，是普通的数据处理）
  const upstreamDataList = upstreamNodeIds.map(upstreamId => ({
    nodeId: upstreamId,
    output: allNodeData[upstreamId]?.output || '(无数据)',
  }));

  // 从已订阅的数据中提取当前节点数据
  const nodeData = allNodeData[id];

  // 处理当前节点的输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateNodeData({
      nodeId: id,
      data: { inputVal: e.target.value }
    }));
  };

  return (
    <Card
      title="⚙️ 处理节点"
      size="small"
      style={{
        width: 280,
        border: selected ? '3px solid #1890ff' : '2px solid #1890ff',
        boxShadow: selected
          ? '0 4px 12px rgba(24, 144, 255, 0.4)'
          : '0 2px 8px rgba(24, 144, 255, 0.2)',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* 显示接收到的上游数据 */}
      <div style={{ marginBottom: 12, padding: 8, background: '#f0f5ff', borderRadius: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: '#1890ff' }}>
          📥 接收到的数据：
        </div>
        {upstreamDataList.length > 0 ? (
          upstreamDataList.map(item => (
            <div key={item.nodeId} style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
              • 来自 [{item.nodeId}]: {item.output}
            </div>
          ))
        ) : (
          <div style={{ fontSize: 11, color: '#999' }}>暂无上游数据</div>
        )}
      </div>

      {/* 当前节点的输入框 */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: '#666' }}>处理数据：</label>
      </div>
      <Input
        placeholder="输入处理内容..."
        value={nodeData?.inputVal || ''}
        onChange={handleInputChange}
        size="small"
      />

      {/* 输入手柄 - 连接上游节点 */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#1890ff' }}
      />

      {/* 输出手柄 - 连接下游节点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#1890ff' }}
      />
    </Card>
  );
});

ProcessNode.displayName = 'ProcessNode';

// ==================== 结束节点 ====================
interface EndNodeProps {
  id: string;
  data: any;
}

export const EndNode = memo(({ id, data, selected }: EndNodeProps & { selected?: boolean }) => {
  // 同样获取上游节点数据并展示最终结果
  const { getEdges } = useReactFlow();

  // ✅ 正确做法：在顶层一次性订阅整个 nodeDataMap
  const allNodeData = useSelector((state: RootState) =>
    state.flow.nodeDataMap
  );

  const incomingEdges = getEdges().filter(edge => edge.target === id);
  const upstreamNodeIds = incomingEdges.map(edge => edge.source);

  // 从已订阅的数据中提取上游节点数据
  const upstreamDataList = upstreamNodeIds.map(upstreamId => ({
    nodeId: upstreamId,
    output: allNodeData[upstreamId]?.output || allNodeData[upstreamId]?.inputVal || '(无数据)',
  }));

  return (
    <Card
      title="✅ 结束节点"
      size="small"
      style={{
        width: 250,
        border: selected ? '3px solid #ff4d4f' : '2px solid #ff4d4f',
        boxShadow: selected
          ? '0 4px 12px rgba(255, 77, 79, 0.4)'
          : '0 2px 8px rgba(255, 77, 79, 0.2)',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div style={{ marginBottom: 8, padding: 8, background: '#fff1f0', borderRadius: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: '#ff4d4f' }}>
          📊 最终结果：
        </div>
        {upstreamDataList.length > 0 ? (
          upstreamDataList.map(item => (
            <div key={item.nodeId} style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
              • 来自 [{item.nodeId}]: {item.output}
            </div>
          ))
        ) : (
          <div style={{ fontSize: 11, color: '#999' }}>等待数据...</div>
        )}
      </div>

      {/* 输入手柄 */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#ff4d4f' }}
      />
    </Card>
  );
});

EndNode.displayName = 'EndNode';

// 导出节点类型映射
export const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  end: EndNode,
};
