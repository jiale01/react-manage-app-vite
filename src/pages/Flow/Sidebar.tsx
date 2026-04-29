import React from 'react';
import classNames from 'classnames';

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
    <div className="flex flex-col w-56 h-full bg-white border-r border-gray-200 shadow-sm">
      {/* 标题区域 */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="m-0 text-base font-semibold text-gray-800">
          📦 节点库
        </h3>
      </div>

      {/* 节点列表 */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {nodeTypes.map(node => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className={classNames(
              'group relative p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing',
              'transition-all duration-300 ease-in-out',
              'hover:shadow-lg hover:-translate-y-1',
              'bg-white'
            )}
            style={{ borderColor: node.color }}
          >
            {/* 渐变背景遮罩 */}
            <div
              className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 group-hover:opacity-10"
              style={{ background: `linear-gradient(135deg, ${node.color}20, ${node.color}10)` }}
            />

            {/* 内容区域 */}
            <div className="relative flex items-center gap-3">
              <span
                className="text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                {node.icon}
              </span>
              <span className="font-medium text-gray-700 transition-colors group-hover:text-gray-900">
                {node.label}
              </span>
            </div>

            {/* 底部装饰线 */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: node.color }}
            />
          </div>
        ))}
      </div>

      {/* 提示区域 */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="p-3 text-xs text-gray-600 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <p className="m-0 font-medium text-gray-700">操作提示</p>
              <p className="m-0 mt-1 text-gray-500">拖拽节点到右侧画布</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
