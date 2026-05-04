import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Input, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeData } from '@/store/modules/flow';
import type { RootState } from '@/store';
import classNames from 'classnames';

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
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <span className="font-semibold text-gray-800">开始节点</span>
        </div>
      }
      size="small"
      className={classNames(
        'bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out',
        'hover:shadow-xl hover:-translate-y-1',
        selected ? 'ring-4 ring-green-400 shadow-2xl scale-105' : 'border-2 border-green-500'
      )}
      styles={{
        body: { padding: '16px' },
        header: {
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: '12px'
        }
      }}
    >
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-600">输出数据：</label>
        <Input
          placeholder="请输入数据..."
          value={nodeData?.output || ''}
          onChange={handleInputChange}
          size="small"
          className="transition-all duration-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
        />
      </div>

      {/* 输出手柄 - 连接到下游节点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
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
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          <span className="font-semibold text-gray-800">处理节点</span>
        </div>
      }
      size="small"
      className={classNames(
        'bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out',
        'hover:shadow-xl hover:-translate-y-1',
        selected ? 'ring-4 ring-blue-400 shadow-2xl scale-105' : 'border-2 border-blue-500'
      )}
      styles={{
        body: { padding: '16px' },
        header: {
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: '12px'
        }
      }}
    >
      <div className="space-y-3">
        {/* 显示接收到的上游数据 */}
        <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-1 mb-2 text-xs font-semibold text-blue-700">
            <span>📥</span>
            <span>接收到的数据：</span>
          </div>
          {upstreamDataList.length > 0 ? (
            <div className="space-y-1">
              {upstreamDataList.map(item => (
                <div key={item.nodeId} className="flex items-start gap-1 text-xs text-gray-600">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>来自 [{item.nodeId}]: <span className="font-medium text-gray-800">{item.output}</span></span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs italic text-gray-400">暂无上游数据</div>
          )}
        </div>

        {/* 当前节点的输入框 */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">处理数据：</label>
          <Input
            placeholder="输入处理内容..."
            value={nodeData?.inputVal || ''}
            onChange={handleInputChange}
            size="small"
            className="transition-all duration-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>

      {/* 输入手柄 - 连接上游节点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
      />

      {/* 输出手柄 - 连接下游节点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
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
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="font-semibold text-gray-800">结束节点</span>
        </div>
      }
      size="small"
      className={classNames(
        'bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out',
        'hover:shadow-xl hover:-translate-y-1',
        selected ? 'ring-4 ring-red-400 shadow-2xl scale-105' : 'border-2 border-red-500'
      )}
      styles={{
        body: { padding: '16px' },
        header: {
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: '12px'
        }
      }}
    >
      <div className="p-3 border border-red-100 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
        <div className="flex items-center gap-1 mb-2 text-xs font-semibold text-red-700">
          <span>📊</span>
          <span>最终结果：</span>
        </div>
        {upstreamDataList.length > 0 ? (
          <div className="space-y-1">
            {upstreamDataList.map(item => (
              <div key={item.nodeId} className="flex items-start gap-1 text-xs text-gray-600">
                <span className="text-red-500 mt-0.5">•</span>
                <span>来自 [{item.nodeId}]: <span className="font-medium text-gray-800">{item.output}</span></span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs italic text-gray-400">等待数据...</div>
        )}
      </div>

      {/* 输入手柄 */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-4 !h-4 !bg-red-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
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
