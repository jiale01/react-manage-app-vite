# 快速入门 React Flow

## 📖 目录

1. [简介](#简介)
2. [什么是 React Flow？](#什么是-react-flow)
3. [为什么选择 React Flow？](#为什么选择-react-flow)
4. [核心概念](#核心概念)
5. [快速开始](#快速开始)
6. [节点与连线详解](#节点与连线详解)
7. [自定义节点](#自定义节点)
8. [交互功能](#交互功能)
9. [实战案例](#实战案例)
10. [性能优化](#性能优化)
11. [最佳实践](#最佳实践)

---

## 简介

**React Flow**（现更名为 **@xyflow/react**）是一个用于构建基于节点的交互式 UI 的 React 库。它让你能够轻松创建流程图、工作流编辑器、思维导图、依赖图等可视化应用。

### 知名应用场景

- 🔀 **工作流编排** - 自动化流程设计器
- 🧠 **思维导图** - 知识图谱可视化
- 📊 **数据流图** - ETL 管道可视化
- 🎮 **游戏开发** - 行为树编辑器
- 🔌 **低代码平台** - 可视化编程工具
- 🗺️ **网络拓扑** - 系统架构图

### 你将学到什么？

- ✅ React Flow 的核心概念和架构
- ✅ 创建和管理节点、连线
- ✅ 自定义节点样式和布局
- ✅ 实现拖拽、缩放、选择等交互
- ✅ 完整的实战案例（工作流编辑器）
- ✅ 性能优化技巧
- ✅ 与 Redux 集成方案

---

## 什么是 React Flow？

### 技术架构

```
┌─────────────────────────────────────┐
│       React Flow Application        │
├─────────────────────────────────────┤
│  Nodes (节点) + Edges (连线)        │
├─────────────────────────────────────┤
│  Viewport (视口：缩放/平移)         │
├─────────────────────────────────────┤
│  Controls (控制面板)                │
└─────────────────────────────────────┘
       ↓
   SVG/HTML 渲染
```

### 核心组成

1. **Nodes（节点）** - 画布上的元素块，可包含任意内容
2. **Edges（连线）** - 连接节点的线条，支持多种类型
3. **Viewport（视口）** - 控制画布的缩放和平移
4. **Handles（连接点）** - 节点上的输入/输出端口
5. **Controls（控件）** - 缩放、适应视图等工具按钮

### 工作原理

```
用户操作（拖拽/点击）
  ↓
React Flow 内部状态更新
  ↓
节点位置/连线关系变化
  ↓
重新渲染画布
  ↓
显示最新状态
```

---

## 为什么选择 React Flow？

### 优势

#### ✅ 强大的功能

```
内置功能：
- 拖拽节点
- 缩放和平移
- 多选框选
- 键盘快捷键
- 撤销/重做
- 迷你地图
- 背景网格
- 自动布局
```

#### ✅ 高度可定制

```javascript
// 完全控制渲染
- 自定义节点组件
- 自定义连线样式
- 自定义连接线算法
- 自定义控件
- 自定义背景
```

#### ✅ TypeScript 支持

```typescript
// 完整的类型定义
interface Node {
  id: string;
  position: { x: number; y: number };
  data: any;
  type?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
}
```

#### ✅ 活跃的社区

```
生态系统：
- 官方文档完善
- 丰富的示例
- 活跃的 GitHub 社区
- 定期更新维护
```

### 劣势

#### ❌ 学习曲线

```
需要理解的概念：
- 节点和连线的关系
- 坐标系转换
- 自定义节点开发
- 状态管理集成
```

#### ❌ 包体积

```
基础包大小：
- @xyflow/react: ~50KB (gzip)
- 包含所有功能
- 可通过 tree-shaking 优化
```

### 适用场景

```
✅ 适合：
- 工作流/流程图编辑器
- 可视化工具
- 低代码平台
- 数据关系图
- 思维导图

❌ 不适合：
- 简单图表展示（用 ECharts）
- 静态图片展示
- 复杂 3D 图形（用 Three.js）
```

---

## 核心概念

### 1. Node（节点）

节点是画布上的基本单元，包含位置、数据和类型信息。

```typescript
interface Node {
  id: string;              // 唯一标识
  position: {              // 位置坐标
    x: number;
    y: number;
  };
  data: any;               // 自定义数据
  type?: string;           // 节点类型
  draggable?: boolean;     // 是否可拖拽
  selectable?: boolean;    // 是否可选择
  connectable?: boolean;   // 是否可连接
}
```

### 2. Edge（连线）

连线连接两个节点，定义它们之间的关系。

```typescript
interface Edge {
  id: string;              // 唯一标识
  source: string;          // 源节点 ID
  target: string;          // 目标节点 ID
  sourceHandle?: string;   // 源连接点
  targetHandle?: string;   // 目标连接点
  type?: string;           // 连线类型
  animated?: boolean;      // 是否动画
  label?: string;          // 标签文本
}
```

### 3. Handle（连接点）

连接点是节点上可以建立连接的端口。

```tsx
<Handle 
  type="target"           // target | source
  position={Position.Top} // Top | Right | Bottom | Left
  id="input-1"            // 可选，多个连接点时需要
/>
```

### 4. Viewport（视口）

控制画布的缩放和平移状态。

```typescript
interface Viewport {
  x: number;      // 水平偏移
  y: number;      // 垂直偏移
  zoom: number;   // 缩放级别（0.1 - 2）
}
```

### 数据流图

```
┌─────────────┐
│   React     │
│  Component  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ React Flow  │ ──→ 接收 nodes 和 edges
│   Canvas    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Nodes &   │ ──→ 渲染节点和连线
│   Edges     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   User      │ ──→ 交互操作（拖拽/连接）
│  Interaction│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   State     │ ──→ 更新 nodes/edges
│   Update    │
└─────────────┘
```

---

## 快速开始

### 步骤 1：安装依赖

```bash
npm install @xyflow/react
```

### 步骤 2：创建基础流程图

`src/components/BasicFlow.tsx`:

```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 定义节点
const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '开始' },
  },
  {
    id: '2',
    position: { x: 200, y: 0 },
    data: { label: '处理' },
  },
  {
    id: '3',
    position: { x: 400, y: 0 },
    data: { label: '结束' },
  },
];

// 定义连线
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

function BasicFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default BasicFlow;
```

### 步骤 3：运行应用

```tsx
// App.tsx
import BasicFlow from './components/BasicFlow';

function App() {
  return (
    <div className="App">
      <BasicFlow />
    </div>
  );
}
```

就这么简单！✨

---

## 节点与连线详解

### 1. 节点类型

#### 默认节点

```tsx
const nodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Default Node' },
    // 默认类型，无需指定
  },
];
```

#### 输入节点

```tsx
const nodes = [
  {
    id: '1',
    type: 'input',  // 输入节点（只有输出）
    position: { x: 0, y: 0 },
    data: { label: 'Input' },
  },
];
```

#### 输出节点

```tsx
const nodes = [
  {
    id: '1',
    type: 'output',  // 输出节点（只有输入）
    position: { x: 200, y: 0 },
    data: { label: 'Output' },
  },
];
```

### 2. 连线类型

#### 默认连线（贝塞尔曲线）

```tsx
const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'default',  // 平滑曲线
  },
];
```

#### 直线连线

```tsx
const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'straight',  // 直线
  },
];
```

#### 阶梯连线

```tsx
const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'step',  // 直角折线
  },
];
```

#### 平滑阶梯连线

```tsx
const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',  // 圆角折线
  },
];
```

### 3. 添加连接点（Handles）

```tsx
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {
  return (
    <div className="custom-node">
      {/* 输入连接点（顶部） */}
      <Handle 
        type="target" 
        position={Position.Top} 
      />
      
      <div className="node-content">
        {data.label}
      </div>
      
      {/* 输出连接点（底部） */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
      />
    </div>
  );
}
```

### 4. 多连接点

```tsx
function MultiPortNode({ data }) {
  return (
    <div className="multi-port-node">
      {/* 多个输入点 */}
      <Handle type="target" position={Position.Left} id="in1" />
      <Handle type="target" position={Position.Left} id="in2" />
      
      <div>{data.label}</div>
      
      {/* 多个输出点 */}
      <Handle type="source" position={Position.Right} id="out1" />
      <Handle type="source" position={Position.Right} id="out2" />
    </div>
  );
}

// 连接时指定 handle id
const edges = [
  {
    id: 'e1-2',
    source: '1',
    sourceHandle: 'out1',  // 指定输出点
    target: '2',
    targetHandle: 'in1',   // 指定输入点
  },
];
```

### 5. 动态添加节点和连线

```tsx
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

function FlowWithAdd() {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  // 添加节点
  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${Date.now()}` },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 添加连线
  const addEdge = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length >= 2) {
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: nodes[0].id,
        target: nodes[1].id,
      };
      
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [getNodes, setEdges]);

  return (
    <div>
      <button onClick={addNode}>添加节点</button>
      <button onClick={addEdge}>添加连线</button>
      <ReactFlow /* ... */ />
    </div>
  );
}
```

---

## 自定义节点

### 1. 基础自定义节点

```tsx
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data, isConnectable }) {
  return (
    <div className="custom-node p-4 bg-white rounded-lg shadow border">
      <Handle 
        type="target" 
        position={Position.Top} 
        isConnectable={isConnectable}
      />
      
      <div className="flex items-center gap-2">
        <span className="text-2xl">{data.icon}</span>
        <div>
          <h3 className="font-semibold">{data.title}</h3>
          <p className="text-sm text-gray-600">{data.description}</p>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CustomNode;
```

### 2. 注册自定义节点

```tsx
import { ReactFlow } from '@xyflow/react';
import CustomNode from './CustomNode';

// 定义节点类型映射
const nodeTypes = {
  custom: CustomNode,
};

function Flow() {
  const nodes = [
    {
      id: '1',
      type: 'custom',  // 使用自定义类型
      position: { x: 0, y: 0 },
      data: {
        icon: '🚀',
        title: '启动',
        description: '开始执行流程',
      },
    },
  ];

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}  // 注册节点类型
      /* ... */
    />
  );
}
```

### 3. 带状态的自定义节点

```tsx
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function StatusNode({ data }) {
  const [status, setStatus] = useState(data.status || 'pending');

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'running': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow ${getStatusColor()} text-white`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="text-center">
        <h3 className="font-bold">{data.label}</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-2 px-2 py-1 rounded text-black"
        >
          <option value="pending">待执行</option>
          <option value="running">执行中</option>
          <option value="success">成功</option>
          <option value="error">失败</option>
        </select>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

### 4. 复杂业务节点（表单）

```tsx
import { Handle, Position } from '@xyflow/react';

function FormNode({ data }) {
  const [formData, setFormData] = useState(data.formData || {});

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    // 通知父组件更新
    data.onChange?.(newData);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow border min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      
      <h3 className="font-semibold mb-3">{data.title}</h3>
      
      {data.fields.map((field) => (
        <div key={field.name} className="mb-2">
          <label className="block text-sm text-gray-600 mb-1">
            {field.label}
          </label>
          
          {field.type === 'select' ? (
            <select
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-2 py-1 border rounded"
            />
          )}
        </div>
      ))}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

---

## 交互功能

### 1. 拖拽创建节点

```tsx
import { useCallback } from 'react';
import { ReactFlow, useReactFlow, useNodesState } from '@xyflow/react';

function DragAndDropFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const { screenToFlowPosition } = useReactFlow();

  // 侧边栏可拖拽项
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // 画布接收拖拽
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (!type) return;

      // 转换屏幕坐标为画布坐标
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 p-4 border-r bg-gray-50">
        <h3 className="font-semibold mb-4">节点库</h3>
        
        <div
          className="p-3 mb-2 bg-white border rounded cursor-move hover:shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'input')}
        >
          输入节点
        </div>
        
        <div
          className="p-3 mb-2 bg-white border rounded cursor-move hover:shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'default')}
        >
          处理节点
        </div>
        
        <div
          className="p-3 bg-white border rounded cursor-move hover:shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'output')}
        >
          输出节点
        </div>
      </aside>

      {/* 画布 */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
```

### 2. 节点选择与删除

```tsx
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

function SelectableFlow() {
  const { getSelectedNodes, setNodes, setEdges } = useReactFlow();

  // 删除选中节点
  const deleteSelected = useCallback(() => {
    const selectedNodes = getSelectedNodes();
    
    if (selectedNodes.length === 0) return;

    const selectedIds = selectedNodes.map(node => node.id);

    // 删除节点
    setNodes((nds) => nds.filter(node => !selectedIds.includes(node.id)));
    
    // 删除相关连线
    setEdges((eds) => 
      eds.filter(edge => 
        !selectedIds.includes(edge.source) && 
        !selectedIds.includes(edge.target)
      )
    );
  }, [getSelectedNodes, setNodes, setEdges]);

  return (
    <div>
      <button 
        onClick={deleteSelected}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        删除选中
      </button>
      
      <ReactFlow /* ... */ />
    </div>
  );
}
```

### 3. 键盘快捷键

```tsx
import { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

function KeyboardShortcuts() {
  const { getSelectedNodes, setNodes, setEdges, zoomIn, zoomOut, fitView } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Delete / Backspace - 删除选中
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = getSelectedNodes();
        if (selectedNodes.length > 0) {
          const selectedIds = selectedNodes.map(node => node.id);
          setNodes((nds) => nds.filter(node => !selectedIds.includes(node.id)));
          setEdges((eds) => 
            eds.filter(edge => 
              !selectedIds.includes(edge.source) && 
              !selectedIds.includes(edge.target)
            )
          );
        }
      }

      // Ctrl/Cmd + Z - 撤销（需自行实现历史记录）
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        // 实现撤销逻辑
      }

      // + - 缩放
      if (event.key === '+' || event.key === '=') {
        zoomIn();
      }
      if (event.key === '-') {
        zoomOut();
      }

      // 0 - 适应视图
      if (event.key === '0') {
        fitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getSelectedNodes, setNodes, setEdges, zoomIn, zoomOut, fitView]);

  return <ReactFlow /* ... */ />;
}
```

### 4. 连线验证

```tsx
import { useCallback } from 'react';

function ValidatedFlow() {
  // 验证是否可以连接
  const isValidConnection = useCallback((connection) => {
    // 不允许自连接
    if (connection.source === connection.target) {
      return false;
    }

    // 检查是否已存在相同连线
    const existingEdge = edges.find(
      edge => 
        edge.source === connection.source && 
        edge.target === connection.target
    );
    
    if (existingEdge) {
      return false;
    }

    // 自定义验证逻辑
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);

    // 例如：只允许从 input 连接到 output
    if (sourceNode?.type !== 'input' || targetNode?.type !== 'output') {
      return false;
    }

    return true;
  }, [nodes, edges]);

  return (
    <ReactFlow
      isValidConnection={isValidConnection}
      /* ... */
    />
  );
}
```

### 5. 保存和加载流程

```tsx
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

function SaveLoadFlow() {
  const { toObject } = useReactFlow();

  // 保存流程
  const saveFlow = useCallback(() => {
    const flowData = toObject();
    
    // 保存到 localStorage
    localStorage.setItem('flow-data', JSON.stringify(flowData));
    
    // 或发送到服务器
    fetch('/api/flows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flowData),
    });
  }, [toObject]);

  // 加载流程
  const loadFlow = useCallback(async () => {
    // 从 localStorage 加载
    const saved = localStorage.getItem('flow-data');
    if (saved) {
      const flowData = JSON.parse(saved);
      setNodes(flowData.nodes || []);
      setEdges(flowData.edges || []);
      setViewport(flowData.viewport || { x: 0, y: 0, zoom: 1 });
      return;
    }

    // 或从服务器加载
    const response = await fetch('/api/flows/1');
    const flowData = await response.json();
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
    setViewport(flowData.viewport);
  }, [setNodes, setEdges, setViewport]);

  return (
    <div>
      <button onClick={saveFlow}>保存</button>
      <button onClick={loadFlow}>加载</button>
      <ReactFlow /* ... */ />
    </div>
  );
}
```

---

## 实战案例

### 案例 1：工作流编辑器（完整示例）

#### 项目结构

```
workflow-editor/
├── components/
│   ├── WorkflowEditor.tsx    # 主编辑器
│   ├── Sidebar.tsx           # 节点库侧边栏
│   ├── Toolbar.tsx           # 工具栏
│   └── nodes/
│       ├── StartNode.tsx     # 开始节点
│       ├── TaskNode.tsx      # 任务节点
│       ├── ConditionNode.tsx # 条件节点
│       └── EndNode.tsx       # 结束节点
├── store/
│   └── workflow.ts           # Redux Store
└── utils/
    └── validators.ts         # 验证工具
```

#### Redux Store

```typescript
// store/workflow.ts
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (id: string | null) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: any) => void;
  saveWorkflow: () => void;
  loadWorkflow: (data: { nodes: Node[]; edges: Edge[] }) => void;
}

const useWorkflowStore = create<WorkflowState>()((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),

  removeNode: (id) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== id),
    edges: state.edges.filter(
      e => e.source !== id && e.target !== id
    )
  })),

  updateNodeData: (id, data) => set((state) => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    )
  })),

  saveWorkflow: () => {
    const { nodes, edges } = get();
    localStorage.setItem('workflow', JSON.stringify({ nodes, edges }));
  },

  loadWorkflow: (data) => set({
    nodes: data.nodes,
    edges: data.edges
  })
}));

export default useWorkflowStore;
```

#### 自定义节点

```tsx
// components/nodes/StartNode.tsx
import { Handle, Position } from '@xyflow/react';

function StartNode({ data }) {
  return (
    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow">
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center gap-2">
        <span className="text-xl">▶️</span>
        <span className="font-semibold">{data.label || '开始'}</span>
      </div>
    </div>
  );
}

export default StartNode;
```

```tsx
// components/nodes/TaskNode.tsx
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function TaskNode({ data, id }) {
  const [taskName, setTaskName] = useState(data.taskName || '');
  const [taskType, setTaskType] = useState(data.taskType || 'script');

  const handleChange = (field, value) => {
    if (field === 'taskName') setTaskName(value);
    if (field === 'taskType') setTaskType(value);
    
    // 更新 Redux Store
    updateNodeData(id, { [field]: value });
  };

  return (
    <div className="px-4 py-3 bg-white border-2 border-blue-500 rounded-lg shadow min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1">任务名称</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => handleChange('taskName', e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
          placeholder="输入任务名称"
        />
      </div>
      
      <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1">任务类型</label>
        <select
          value={taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        >
          <option value="script">脚本</option>
          <option value="api">API 调用</option>
          <option value="email">发送邮件</option>
          <option value="notification">发送通知</option>
        </select>
      </div>
      
      <div className="text-xs text-gray-500">
        ID: {id.slice(0, 8)}...
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TaskNode;
```

```tsx
// components/nodes/ConditionNode.tsx
import { Handle, Position } from '@xyflow/react';

function ConditionNode({ data }) {
  return (
    <div className="px-4 py-3 bg-yellow-100 border-2 border-yellow-500 rounded-lg shadow min-w-[180px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="text-center">
        <span className="text-2xl">❓</span>
        <div className="font-semibold mt-1">{data.label || '条件判断'}</div>
        <div className="text-xs text-gray-600 mt-1">
          {data.condition || '设置条件'}
        </div>
      </div>
      
      {/* True 分支 */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true"
        style={{ top: '30%' }}
      />
      <div className="absolute right-[-30px] top-[30%] text-xs text-green-600">
        True
      </div>
      
      {/* False 分支 */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        style={{ top: '70%' }}
      />
      <div className="absolute right-[-30px] top-[70%] text-xs text-red-600">
        False
      </div>
    </div>
  );
}

export default ConditionNode;
```

#### 主编辑器

```tsx
// components/WorkflowEditor.tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useWorkflowStore from '../store/workflow';
import StartNode from './nodes/StartNode';
import TaskNode from './nodes/TaskNode';
import ConditionNode from './nodes/ConditionNode';
import EndNode from './nodes/EndNode';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

// 注册节点类型
const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  condition: ConditionNode,
  end: EndNode,
};

function WorkflowEditor() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    saveWorkflow,
    loadWorkflow,
  } = useWorkflowStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);

  // 同步 Redux Store
  useEffect(() => {
    setRfNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    setRfEdges(edges);
  }, [edges]);

  // 连线处理
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
      };
      
      setRfEdges((eds) => addEdge(newEdge, eds));
      setEdges([...rfEdges, newEdge]);
    },
    [rfEdges, setEdges]
  );

  // 保存工作流
  const handleSave = () => {
    saveWorkflow();
    alert('工作流已保存！');
  };

  // 加载工作流
  const handleLoad = async () => {
    const saved = localStorage.getItem('workflow');
    if (saved) {
      const data = JSON.parse(saved);
      loadWorkflow(data);
      alert('工作流已加载！');
    }
  };

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主区域 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <Toolbar onSave={handleSave} onLoad={handleLoad} />

        {/* 画布 */}
        <div className="flex-1">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background variant="dots" gap={15} size={1} />
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
}

export default WorkflowEditor;
```

#### 侧边栏

```tsx
// components/Sidebar.tsx
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import useWorkflowStore from '../store/workflow';

function Sidebar() {
  const { screenToFlowPosition } = useReactFlow();
  const { addNode } = useWorkflowStore();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type} node`,
          taskName: '',
          taskType: 'script'
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <aside 
      className="w-64 p-4 border-r bg-gray-50"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <h3 className="font-semibold mb-4 text-lg">节点库</h3>
      
      <div className="space-y-2">
        <div
          className="p-3 bg-green-500 text-white rounded cursor-move hover:shadow-lg transition-shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'start')}
        >
          <div className="flex items-center gap-2">
            <span>▶️</span>
            <span>开始节点</span>
          </div>
        </div>

        <div
          className="p-3 bg-blue-500 text-white rounded cursor-move hover:shadow-lg transition-shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'task')}
        >
          <div className="flex items-center gap-2">
            <span>⚙️</span>
            <span>任务节点</span>
          </div>
        </div>

        <div
          className="p-3 bg-yellow-500 text-white rounded cursor-move hover:shadow-lg transition-shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'condition')}
        >
          <div className="flex items-center gap-2">
            <span>❓</span>
            <span>条件节点</span>
          </div>
        </div>

        <div
          className="p-3 bg-red-500 text-white rounded cursor-move hover:shadow-lg transition-shadow"
          draggable
          onDragStart={(e) => onDragStart(e, 'end')}
        >
          <div className="flex items-center gap-2">
            <span>⏹️</span>
            <span>结束节点</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>💡 提示：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>拖拽节点到画布</li>
          <li>点击连接点创建连线</li>
          <li>选中节点按 Delete 删除</li>
          <li>滚轮缩放，拖拽平移</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
```

#### 工具栏

```tsx
// components/Toolbar.tsx
interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
}

function Toolbar({ onSave, onLoad }: ToolbarProps) {
  return (
    <div className="h-14 border-b bg-white px-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">工作流编辑器</h1>
      
      <div className="flex gap-2">
        <button
          onClick={onLoad}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          加载
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
```

### 案例 2：思维导图

```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'root',
      position: { x: 400, y: 300 },
      data: { label: '中心主题' },
      style: { 
        background: '#1677ff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px'
      }
    },
  ]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'bezier',
      animated: true,
      style: { stroke: '#1677ff', strokeWidth: 2 }
    }, eds)),
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background variant="lines" />
      <Controls />
    </ReactFlow>
  );
}
```

---

## 性能优化

### 1. 避免不必要的重渲染

```tsx
// ❌ 错误：每次渲染都创建新对象
function Flow() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ custom: CustomNode }} // 每次都创建新对象
    />
  );
}

// ✅ 正确：在外部定义
const nodeTypes = { custom: CustomNode };

function Flow() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes} // 引用稳定
    />
  );
}
```

### 2. 使用 memo 优化自定义节点

```tsx
import { memo } from 'react';

const CustomNode = memo(({ data }) => {
  // 只有 data 变化时才重渲染
  return <div>{data.label}</div>;
});

export default CustomNode;
```

### 3. 虚拟滚动（大量节点）

```tsx
import { Panel } from '@xyflow/react';

function LargeFlow() {
  // 只显示可视区域内的节点
  const visibleNodes = useMemo(() => {
    return nodes.filter(node => isInViewport(node.position));
  }, [nodes, viewport]);

  return (
    <ReactFlow nodes={visibleNodes} /* ... */ />
  );
}
```

### 4. 防抖更新

```tsx
import { debounce } from 'lodash-es';

const debouncedUpdate = debounce((newNodes) => {
  setNodes(newNodes);
}, 300);

function onNodesChange(changes) {
  // 防抖处理节点变化
  debouncedUpdate(applyNodeChanges(changes, nodes));
}
```

### 5. 禁用不必要的功能

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  // 禁用不需要的功能以提升性能
  nodesDraggable={false}      // 禁止拖拽
  nodesConnectable={false}    // 禁止连接
  elementsSelectable={false}  // 禁止选择
  zoomOnScroll={false}        // 禁止滚轮缩放
  panOnDrag={false}           // 禁止平移
/>
```

---

## 最佳实践

### 1. 节点 ID 规范

```typescript
// ✅ 好的 ID 命名
const node = {
  id: 'task-user-auth-001',  // 语义化
  // ...
};

// ❌ 不好的 ID
const node = {
  id: '1',  // 无意义
  // ...
};
```

### 2. 数据结构设计

```typescript
// ✅ 将业务数据放在 data 字段
const node = {
  id: 'task-1',
  position: { x: 0, y: 0 },
  data: {
    taskId: '123',
    taskName: '用户认证',
    taskType: 'script',
    config: { /* ... */ }
  }
};

// ❌ 不要混用
const node = {
  id: 'task-1',
  taskName: '用户认证',  // 不应该在这里
  position: { x: 0, y: 0 },
  data: {}
};
```

### 3. 错误处理

```tsx
function SafeFlow() {
  const onError = useCallback((error) => {
    console.error('React Flow Error:', error);
    // 上报错误日志
  }, []);

  return (
    <ReactFlow
      onError={onError}
      /* ... */
    />
  );
}
```

### 4. 响应式设计

```tsx
function ResponsiveFlow() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={dimensions}>
      <ReactFlow /* ... */ />
    </div>
  );
}
```

### 5. 清单检查

```
React Flow 开发检查清单：
✅ 使用 TypeScript 获得类型安全
✅ 节点 ID 唯一且语义化
✅ 业务数据放在 data 字段
✅ 自定义节点使用 memo 优化
✅ 稳定的 nodeTypes/edgeTypes 引用
✅ 实现保存/加载功能
✅ 添加错误边界处理
✅ 响应式布局适配
✅ 性能优化（虚拟滚动、防抖）
✅ 用户友好的交互提示
```

---

## 总结

### 🎯 核心要点回顾

#### React Flow 的优势
1. **功能强大** - 拖拽、缩放、连线、自定义节点
2. **高度可定制** - 完全控制渲染和交互
3. **TypeScript 友好** - 完整的类型定义
4. **活跃社区** - 丰富的示例和文档
5. **生态完善** - 配合 Redux/Zustand 状态管理

#### 关键技能
- ✅ 创建和管理节点、连线
- ✅ 自定义节点组件
- ✅ 实现拖拽创建
- ✅ 连线验证和控制
- ✅ 保存和加载流程
- ✅ 性能优化技巧

### 📊 性能指标

```
理想标准：
✅ 节点数量：< 1000（超出需虚拟滚动）
✅ 帧率：≥ 60fps
✅ 初始化时间：< 500ms
✅ 内存占用：合理（及时清理无用节点）
```

### 🚀 下一步学习

1. **深入理解原理**
   - 坐标系转换机制
   - 渲染优化策略
   - 事件处理流程

2. **高级功能**
   - 自定义连线算法
   - 自动布局（dagre、elkjs）
   - 撤销/重做历史
   - 协同编辑

3. **生态集成**
   - 与 Redux/Zustand 深度集成
   - 服务端渲染（SSR）
   - 单元测试

4. **替代方案对比**
   - React Diagrams
   - JointJS
   - GoJS

### 📚 推荐资源

- [React Flow 官方文档](https://reactflow.dev/)
- [React Flow Examples](https://reactflow.dev/examples)
- [GitHub Repository](https://github.com/xyflow/xyflow)
- [Awesome React Flow](https://github.com/xyflow/awesome-react-flow)

---

希望这份指南能帮助你快速掌握 React Flow，构建出色的可视化应用！🎉

**记住：React Flow 的强大在于它的灵活性和可扩展性。**

**开始你的 React Flow 之旅吧！** 🚀
