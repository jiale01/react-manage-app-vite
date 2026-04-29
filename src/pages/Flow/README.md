# React Flow 数据驱动工作流示例

## 📋 功能概述

这是一个基于 **React Flow**、**Ant Design** 和 **Redux Toolkit** 构建的可视化工作流编排示例，实现了**数据驱动的节点通信**。

### ✨ 核心特性

- ✅ **拖拽添加节点**：从左侧侧边栏拖拽三种节点类型到画布
- ✅ **可视化连线**：通过 Handle 连接节点，形成数据流
- ✅ **实时数据传递**：下游节点自动读取并显示上游节点的表单数据
- ✅ **Redux 状态管理**：使用 Redux Toolkit 统一管理所有节点数据
- ✅ **响应式更新**：上游数据变化时，下游节点自动刷新显示

## 🏗️ 技术架构

### 1. Redux Store 设计

```typescript
// store/modules/flow.ts
interface FlowState {
  nodeDataMap: Record<string, NodeData>;
}

// 数据结构示例
{
  "start-1": { output: "用户输入的数据" },
  "process-2": { inputVal: "处理内容" },
  "end-3": {}
}
```

**关键 Action：**
- `updateNodeData`: 更新特定节点的数据
- `removeNodeData`: 删除节点数据
- `clearAllNodeData`: 清空所有节点数据

### 2. 节点类型

#### 🚀 开始节点 (StartNode)
- 包含一个 Input 输入框
- 输入的内容会更新 Redux Store 中的 `output` 字段
- 作为数据流的起点

#### ⚙️ 处理节点 (ProcessNode) - **核心难点**
- **自动识别上游节点**：使用 `useReactFlow()` 获取 edges，过滤出指向当前节点的连线
- **订阅上游数据**：拿到上游 ID 后，使用 `useSelector` 从 Redux Store 读取数据
- **实时显示**：在界面上显示"接收到数据：xxx"

```typescript
// 核心逻辑详解
const { getEdges } = useReactFlow();

// 1. 获取所有指向当前节点的连线
const incomingEdges = getEdges().filter(edge => edge.target === id);

// 2. 提取上游节点 ID
const upstreamNodeIds = incomingEdges.map(edge => edge.source);

// 3. 为每个上游节点订阅其数据（关键：单独调用 useSelector）
const upstreamDataList = upstreamNodeIds.map(upstreamId => {
  const upstreamNodeData = useSelector((state: RootState) => 
    state.flow.nodeDataMap[upstreamId]
  );
  
  return {
    nodeId: upstreamId,
    output: upstreamNodeData?.output || '(无数据)',
  };
});
```

#### ✅ 结束节点 (EndNode)
- 展示最终结果
- 汇总所有上游节点的数据

## 📁 文件结构

```
src/pages/Flow/Create/
├── index.tsx          # 主页面：集成画布、工具栏
├── CustomNodes.tsx    # 自定义节点组件（开始、处理、结束）
├── Sidebar.tsx        # 侧边栏：可拖拽的节点库
└── index.scss         # 样式文件

src/store/modules/
└── flow.ts            # Redux Slice：管理节点数据
```

## 🎯 使用流程

### 1. 启动项目
```bash
npm run dev
```

### 2. 访问工作流页面
访问路由：`/flow/create`

### 3. 操作步骤

1. **添加节点**：从左侧拖拽节点到右侧画布
2. **连接节点**：鼠标悬停节点，拖动 Handle 连接到其他节点
3. **输入数据**：在开始节点输入内容
4. **观察数据流**：处理节点和结束节点会实时显示接收到的数据

## 🔑 关键技术点

### 1. 为什么在处理节点中要单独调用 useSelector？

```typescript
// ❌ 错误做法：一次性获取所有数据
const allNodeData = useSelector((state) => state.flow.nodeDataMap);

// ✅ 正确做法：为每个上游节点单独订阅
upstreamNodeIds.map(upstreamId => {
  const upstreamNodeData = useSelector((state) => 
    state.flow.nodeDataMap[upstreamId]
  );
});
```

**原因：**
- Redux 的 `useSelector` 采用浅比较检测变化
- 单独订阅可以精确监听特定节点数据的变化
- 避免不必要的重新渲染

### 2. 如何确保节点 ID 唯一？

```typescript
let nodeId = 0;
const generateNodeId = (type: string) => `${type}-${++nodeId}`;
```

使用自增计数器 + 节点类型前缀，保证全局唯一。

### 3. 如何处理连线的删除？

当删除节点时，同时删除与该节点相关的所有连线：

```typescript
setEdges((eds) => 
  eds.filter(edge => 
    !selectedIds.includes(edge.source) && !selectedIds.includes(edge.target)
  )
);
```

## 🎨 界面预览

- **绿色边框**：开始节点
- **蓝色边框**：处理节点
- **红色边框**：结束节点

## 📝 扩展建议

1. **添加更多节点类型**：如条件分支、循环节点
2. **支持节点配置面板**：点击节点弹出配置表单
3. **保存/加载工作流**：将 nodes 和 edges 序列化保存到后端
4. **执行引擎**：根据工作流定义自动执行任务
5. **撤销/重做**：实现操作历史栈

## 🐛 常见问题

### Q: 上游数据变化后，下游节点没有更新？
A: 检查是否正确使用了 `useSelector` 订阅上游节点数据，确保每个上游节点都有独立的 selector。

### Q: 拖拽节点时位置不准确？
A: 确保 `onDrop` 中正确计算了相对于画布的坐标（减去 `getBoundingClientRect`）。

### Q: TypeScript 报错类型不匹配？
A: 确保为 `useNodesState` 和 `useEdgesState` 显式指定泛型类型 `<Node>` 和 `<Edge>`。

## 📚 参考资源

- [React Flow 官方文档](https://reactflow.dev/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Ant Design 文档](https://ant.design/)
