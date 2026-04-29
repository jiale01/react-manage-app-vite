import React from 'react';
import { Card } from 'antd';

// 节点类型定义
interface NodeType {
  type: string;
  label: string;
  icon: string;
  color: string;
}

const nodeTypes: NodeType[] = [
  { type: 'start', label: '开始节点', icon: '🚀', color: '#52c41a' },
  { type: 'process', label: '处理节点', icon: '⚙️', color: '#1890ff' },
  { type: 'end', label: '结束节点', icon: '✅', color: '#ff4d4f' },
];

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  return (
    <div style={{
      width: 200,
      padding: 16,
      background: '#fff',
      borderRight: '1px solid #e8e8e8',
      height: '100%'
    }}>
      <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold' }}>
        📦 节点库
      </h3>

      {nodeTypes.map(node => (
        <Card
          key={node.type}
          size="small"
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
          style={{
            marginBottom: 12,
            cursor: 'grab',
            border: `2px solid ${node.color}`,
            transition: 'all 0.3s',
          }}
          styles={{ body: { padding: '12px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{node.icon}</span>
            <span style={{ fontWeight: 500 }}>{node.label}</span>
          </div>
        </Card>
      ))}

      <div style={{
        marginTop: 24,
        padding: 12,
        background: '#f5f5f5',
        borderRadius: 4,
        fontSize: 12,
        color: '#666'
      }}>
        💡 提示：拖拽节点到右侧画布
      </div>
    </div>
  );
};
