import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 定义节点数据类型
export interface NodeData {
  label?: string;
  output?: string;
  inputVal?: string;
  [key: string]: any;
}

// 定义 Flow State 接口
interface FlowState {
  nodeDataMap: Record<string, NodeData>;
}

// 初始状态
const initialState: FlowState = {
  nodeDataMap: {},
};

// 创建 Slice
export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    // 更新特定节点的数据
    updateNodeData: (
      state,
      action: PayloadAction<{ nodeId: string; data: Partial<NodeData> }>
    ) => {
      const { nodeId, data } = action.payload;
      // 如果节点不存在，先初始化
      if (!state.nodeDataMap[nodeId]) {
        state.nodeDataMap[nodeId] = {};
      }
      // 合并新数据到现有数据
      state.nodeDataMap[nodeId] = {
        ...state.nodeDataMap[nodeId],
        ...data,
      };
    },

    // 删除节点数据
    removeNodeData: (state, action: PayloadAction<string>) => {
      delete state.nodeDataMap[action.payload];
    },

    // 清空所有节点数据
    clearAllNodeData: (state) => {
      state.nodeDataMap = {};
    },
  },
});

// 导出 actions
export const { updateNodeData, removeNodeData, clearAllNodeData } = flowSlice.actions;

// 导出 reducer
export default flowSlice.reducer;
