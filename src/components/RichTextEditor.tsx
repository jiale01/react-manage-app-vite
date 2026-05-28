import { useRef, useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  FormatPainterOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  EyeOutlined,
  EditOutlined,
  ColumnWidthOutlined,
} from '@ant-design/icons';
import './RichTextEditor.scss';

type ViewMode = 'edit' | 'preview' | 'split';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value = '', onChange, placeholder }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const insertMarkdown = useCallback((before: string, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const selectedText = text.substring(start, end) || defaultText;

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    onChange?.(newText);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + before.length + selectedText.length;
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = cursorPos;
    }, 0);
  }, [value, onChange]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const toolbarButtons = [
    {
      title: '粗体',
      icon: <BoldOutlined />,
      action: () => insertMarkdown('**', '**', '粗体文本'),
    },
    {
      title: '斜体',
      icon: <ItalicOutlined />,
      action: () => insertMarkdown('*', '*', '斜体文本'),
    },
    {
      title: '删除线',
      icon: <StrikethroughOutlined />,
      action: () => insertMarkdown('~~', '~~', '删除线文本'),
    },
    { type: 'divider' as const },
    {
      title: '标题1',
      icon: <><FormatPainterOutlined /> H1</>,
      action: () => insertMarkdown('# ', '', '一级标题'),
    },
    {
      title: '标题2',
      icon: <><FormatPainterOutlined /> H2</>,
      action: () => insertMarkdown('## ', '', '二级标题'),
    },
    {
      title: '标题3',
      icon: <><FormatPainterOutlined /> H3</>,
      action: () => insertMarkdown('### ', '', '三级标题'),
    },
    { type: 'divider' as const },
    {
      title: '无序列表',
      icon: <UnorderedListOutlined />,
      action: () => insertMarkdown('- ', '', '列表项'),
    },
    {
      title: '有序列表',
      icon: <OrderedListOutlined />,
      action: () => insertMarkdown('1. ', '', '列表项'),
    },
    { type: 'divider' as const },
    {
      title: '链接',
      icon: <LinkOutlined />,
      action: () => insertMarkdown('[', '](url)', '链接文本'),
    },
    {
      title: '图片',
      icon: <PictureOutlined />,
      action: () => insertMarkdown('![', '](url)', '图片描述'),
    },
    { type: 'divider' as const },
    {
      title: '行内代码',
      icon: <CodeOutlined />,
      action: () => insertMarkdown('`', '`', '代码'),
    },
    {
      title: '代码块',
      icon: <><CodeOutlined /><span className="toolbar-btn-label">块</span></>,
      action: () => insertMarkdown('```\n', '\n```', '代码'),
    },
  ];

  return (
    <div className="markdown-editor">
      {/* 工具栏 */}
      <div className="markdown-editor-toolbar">
        <div className="toolbar-group">
          {toolbarButtons.map((btn, i) =>
            'type' in btn && btn.type === 'divider' ? (
              <div key={i} className="toolbar-divider" />
            ) : (
              <button
                key={i}
                type="button"
                className="toolbar-btn"
                title={'title' in btn ? btn.title : ''}
                onClick={'action' in btn ? btn.action : undefined}
              >
                {'icon' in btn ? btn.icon : null}
              </button>
            )
          )}
        </div>
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${viewMode === 'edit' ? 'active' : ''}`}
            title="编辑"
            onClick={() => setViewMode('edit')}
          >
            <EditOutlined />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${viewMode === 'split' ? 'active' : ''}`}
            title="分屏"
            onClick={() => setViewMode('split')}
          >
            <ColumnWidthOutlined />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${viewMode === 'preview' ? 'active' : ''}`}
            title="预览"
            onClick={() => setViewMode('preview')}
          >
            <EyeOutlined />
          </button>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className={`markdown-editor-body ${viewMode}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="editor-pane">
            <textarea
              ref={textareaRef}
              className="editor-textarea"
              value={value}
              onChange={handleTextareaChange}
              placeholder={placeholder || '请输入 Markdown 内容...'}
              spellCheck={false}
            />
          </div>
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="preview-pane">
            {value ? (
              <div className="markdown-preview">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="preview-empty">暂无内容</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
