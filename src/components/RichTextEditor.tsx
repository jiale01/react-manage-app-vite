import { useRef, useCallback, useState, type ReactNode, type KeyboardEvent } from 'react';
import { Dropdown, Tooltip, message, type MenuProps } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  EyeOutlined,
  EditOutlined,
  ColumnWidthOutlined,
  FontSizeOutlined,
  MenuOutlined,
  CheckSquareOutlined,
  TableOutlined,
  DashOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  CopyOutlined,
  ClearOutlined,
  EnterOutlined,
} from '@ant-design/icons';
import './RichTextEditor.scss';

type ViewMode = 'edit' | 'preview' | 'split';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

interface ToolbarAction {
  title: string;
  icon: ReactNode;
  action: () => void;
}

const countWords = (content: string) => {
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const latinWords = content.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9_]+/g)?.length || 0;

  return chineseChars + latinWords;
};

const createTable = (rows: number, cols: number) => {
  const safeRows = Math.max(1, Math.min(rows, 12));
  const safeCols = Math.max(1, Math.min(cols, 8));
  const header = `| ${Array.from({ length: safeCols }, (_, index) => `标题 ${index + 1}`).join(' | ')} |`;
  const divider = `| ${Array.from({ length: safeCols }, () => '---').join(' | ')} |`;
  const body = Array.from({ length: safeRows }, () => `| ${Array.from({ length: safeCols }, () => '内容').join(' | ')} |`);

  return [header, divider, ...body].join('\n');
};

const RichTextEditor = ({ value = '', onChange, placeholder }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [fullscreen, setFullscreen] = useState(false);

  const updateValue = useCallback((nextValue: string, nextSelectionStart?: number, nextSelectionEnd?: number) => {
    onChange?.(nextValue);

    window.setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.focus();
      if (typeof nextSelectionStart === 'number') {
        textarea.selectionStart = nextSelectionStart;
        textarea.selectionEnd = typeof nextSelectionEnd === 'number' ? nextSelectionEnd : nextSelectionStart;
      }
    }, 0);
  }, [onChange]);

  const replaceSelection = useCallback((replacement: string, cursorOffset = replacement.length) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.substring(0, start)}${replacement}${value.substring(end)}`;

    updateValue(nextValue, start + cursorOffset);
  }, [updateValue, value]);

  const surroundSelection = useCallback((before: string, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${before}${selectedText}${after}`;
    const nextValue = `${value.substring(0, start)}${replacement}${value.substring(end)}`;

    updateValue(nextValue, start + before.length, start + before.length + selectedText.length);
  }, [updateValue, value]);

  const insertBlock = useCallback((content: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const prefix = start > 0 && !value.substring(0, start).endsWith('\n') ? '\n\n' : '';
    const suffix = value.substring(start).startsWith('\n') ? '\n' : '\n\n';
    const replacement = `${prefix}${content}${suffix}`;
    const nextValue = `${value.substring(0, start)}${replacement}${value.substring(textarea.selectionEnd)}`;

    updateValue(nextValue, start + replacement.length);
  }, [updateValue, value]);

  const applyLinePrefix = useCallback((prefixForLine: (index: number) => string, defaultText = '内容') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const nextLineBreak = value.indexOf('\n', selectionEnd);
    const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    const selectedBlock = value.substring(lineStart, lineEnd) || defaultText;
    const lines = selectedBlock.split('\n');
    const replacement = lines
      .map((line, index) => {
        const cleanedLine = line
          .replace(/^#{1,6}\s+/, '')
          .replace(/^>\s?/, '')
          .replace(/^([-*+]\s+|\d+\.\s+|- \[[ xX]\]\s+)/, '');

        return `${prefixForLine(index)}${cleanedLine || defaultText}`;
      })
      .join('\n');
    const nextValue = `${value.substring(0, lineStart)}${replacement}${value.substring(lineEnd)}`;

    updateValue(nextValue, lineStart, lineStart + replacement.length);
  }, [updateValue, value]);

  const applyHeading = useCallback((level: number) => {
    applyLinePrefix(() => `${'#'.repeat(level)} `, `标题 ${level}`);
  }, [applyLinePrefix]);

  const insertLink = useCallback(() => {
    const url = window.prompt('请输入链接地址', 'https://');
    if (!url) return;

    surroundSelection('[', `](${url})`, '链接文本');
  }, [surroundSelection]);

  const insertImage = useCallback(() => {
    const url = window.prompt('请输入图片地址', 'https://');
    if (!url) return;

    surroundSelection('![', `](${url})`, '图片描述');
  }, [surroundSelection]);

  const insertCodeBlock = useCallback(() => {
    const language = window.prompt('请输入代码语言，例如 javascript / ts / bash', 'javascript') || '';
    insertBlock(`\`\`\`${language.trim()}\n代码\n\`\`\``);
  }, [insertBlock]);

  const insertTable = useCallback(() => {
    const rows = Number(window.prompt('请输入表格行数', '3'));
    const cols = Number(window.prompt('请输入表格列数', '3'));

    if (!Number.isFinite(rows) || !Number.isFinite(cols)) return;

    insertBlock(createTable(rows, cols));
  }, [insertBlock]);

  const copyMarkdown = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    message.success('Markdown 已复制');
  }, [value]);

  const clearContent = useCallback(() => {
    if (!value || !window.confirm('确定清空当前 Markdown 内容吗？')) return;

    updateValue('', 0);
  }, [updateValue, value]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    const isModifier = event.ctrlKey || event.metaKey;
    if (!isModifier) return;

    const key = event.key.toLowerCase();
    if (key === 'b') {
      event.preventDefault();
      surroundSelection('**', '**', '粗体文本');
      return;
    }
    if (key === 'i') {
      event.preventDefault();
      surroundSelection('*', '*', '斜体文本');
      return;
    }
    if (key === 'k') {
      event.preventDefault();
      insertLink();
      return;
    }
    if (event.altKey && /^[1-6]$/.test(key)) {
      event.preventDefault();
      applyHeading(Number(key));
    }
  }, [applyHeading, insertLink, surroundSelection]);

  const headingMenuItems: MenuProps['items'] = Array.from({ length: 6 }, (_, index) => {
    const level = index + 1;

    return {
      key: `h${level}`,
      label: `标题 ${level}`,
      onClick: () => applyHeading(level),
    };
  });

  const listMenuItems: MenuProps['items'] = [
    { key: 'bullet', label: '无序列表', icon: <UnorderedListOutlined />, onClick: () => applyLinePrefix(() => '- ', '列表项') },
    { key: 'ordered', label: '有序列表', icon: <OrderedListOutlined />, onClick: () => applyLinePrefix((index) => `${index + 1}. `, '列表项') },
    { key: 'task', label: '任务列表', icon: <CheckSquareOutlined />, onClick: () => applyLinePrefix(() => '- [ ] ', '待办事项') },
    { key: 'quote', label: '引用', icon: <MenuOutlined />, onClick: () => applyLinePrefix(() => '> ', '引用内容') },
  ];

  const insertMenuItems: MenuProps['items'] = [
    { key: 'link', label: '链接', icon: <LinkOutlined />, onClick: insertLink },
    { key: 'image', label: '图片', icon: <PictureOutlined />, onClick: insertImage },
    { key: 'table', label: '表格', icon: <TableOutlined />, onClick: insertTable },
    { key: 'hr', label: '分割线', icon: <DashOutlined />, onClick: () => insertBlock('---') },
    { key: 'footnote', label: '脚注', icon: <EnterOutlined />, onClick: () => insertBlock('这里有一个脚注引用[^1]\n\n[^1]: 脚注内容') },
  ];

  const codeMenuItems: MenuProps['items'] = [
    { key: 'inline', label: '行内代码', icon: <CodeOutlined />, onClick: () => surroundSelection('`', '`', '代码') },
    { key: 'block', label: '代码块', icon: <CodeOutlined />, onClick: insertCodeBlock },
  ];

  const inlineActions: ToolbarAction[] = [
    { title: '粗体 Ctrl+B', icon: <BoldOutlined />, action: () => surroundSelection('**', '**', '粗体文本') },
    { title: '斜体 Ctrl+I', icon: <ItalicOutlined />, action: () => surroundSelection('*', '*', '斜体文本') },
    { title: '删除线', icon: <StrikethroughOutlined />, action: () => surroundSelection('~~', '~~', '删除线文本') },
  ];

  const utilityActions: ToolbarAction[] = [
    { title: '复制 Markdown', icon: <CopyOutlined />, action: copyMarkdown },
    { title: '清空内容', icon: <ClearOutlined />, action: clearContent },
    {
      title: fullscreen ? '退出全屏' : '全屏编辑',
      icon: fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
      action: () => setFullscreen((current) => !current),
    },
  ];

  const renderToolbarButton = (action: ToolbarAction) => (
    <Tooltip key={action.title} title={action.title}>
      <button type="button" className="toolbar-btn" onClick={action.action}>
        {action.icon}
      </button>
    </Tooltip>
  );

  const renderDropdownButton = (title: string, icon: ReactNode, items: MenuProps['items']) => (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
      <button type="button" className="toolbar-btn toolbar-dropdown-btn" title={title}>
        {icon}
        <span className="toolbar-btn-label">{title}</span>
      </button>
    </Dropdown>
  );

  return (
    <div className={`markdown-editor ${fullscreen ? 'fullscreen' : ''}`}>
      <div className="markdown-editor-toolbar">
        <div className="toolbar-group">
          {inlineActions.map(renderToolbarButton)}
          <div className="toolbar-divider" />
          {renderDropdownButton('标题', <FontSizeOutlined />, headingMenuItems)}
          {renderDropdownButton('列表', <UnorderedListOutlined />, listMenuItems)}
          {renderDropdownButton('插入', <LinkOutlined />, insertMenuItems)}
          {renderDropdownButton('代码', <CodeOutlined />, codeMenuItems)}
        </div>
        <div className="toolbar-group">
          {utilityActions.map(renderToolbarButton)}
          <div className="toolbar-divider" />
          <Tooltip title="编辑">
            <button
              type="button"
              className={`toolbar-btn ${viewMode === 'edit' ? 'active' : ''}`}
              onClick={() => setViewMode('edit')}
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="分屏">
            <button
              type="button"
              className={`toolbar-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              <ColumnWidthOutlined />
            </button>
          </Tooltip>
          <Tooltip title="预览">
            <button
              type="button"
              className={`toolbar-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <EyeOutlined />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={`markdown-editor-body ${viewMode}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="editor-pane">
            <textarea
              ref={textareaRef}
              className="editor-textarea"
              value={value}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
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

      <div className="markdown-editor-status">
        <span>{value.length} 字符</span>
        <span>{countWords(value)} 字词</span>
        <span>{viewMode === 'split' ? '分屏模式' : viewMode === 'edit' ? '编辑模式' : '预览模式'}</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
