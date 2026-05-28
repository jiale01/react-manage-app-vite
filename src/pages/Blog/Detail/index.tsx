import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, Skeleton, Button, message } from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
  LikeOutlined,
  LikeFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getBlogDetail, likeBlog, type BlogItem } from '@/api/blog';
import { copyToClipboard } from '@/utils/codeHighlight';
import { getCategoryLabel, getCategoryColor } from '@/config';
import useTitle from '@/hooks/useTitle';
import './index.scss';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<BlogItem | null>(null);
  const [liked, setLiked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useTitle(article ? `${article.title} - Zane的个人技术博客` : 'Zane的个人技术博客');

  // 获取文章详情
  const fetchArticleDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await getBlogDetail(Number(id));
      if (res && res.data) {
        setArticle(res.data);
      }
    } catch (error) {
      console.error('获取文章详情失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 点赞功能
  const handleLike = async () => {
    if (!id || !article) return;

    try {
      await likeBlog(Number(id));
      setLiked(true);
      setArticle(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
      message.success('点赞成功');
    } catch (error) {
      console.error('点赞失败', error);
      message.error('点赞失败，请重试');
    }
  };

  useEffect(() => {
    fetchArticleDetail();
  }, [id]);

  // 格式化时间
  const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
  };

  // 计算阅读时间
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const words = content.length;
    return Math.ceil(words / 300);
  };

  // 点击复制代码
  const handleCopyCode = (code: string) => {
    copyToClipboard(code).then((success) => {
      if (success) message.success('代码已复制到剪贴板');
      else message.error('复制失败');
    });
  };

  // Markdown 自定义渲染组件
  const MarkdownComponents = {
    code: ({ className, children, ...props }: any) => {
      const isInline = !className;
      const codeRef = useRef<HTMLElement>(null);
      const codeText = String(children).replace(/\n$/, '');

      if (isInline) {
        return <code className={className} {...props}>{children}</code>;
      }

      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return (
        <div className="code-block-wrapper">
          {language && <span className="code-lang-tag">{language.toUpperCase()}</span>}
          <button
            className="copy-code-btn"
            onClick={() => handleCopyCode(codeText)}
            title="复制代码"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <pre className={className}>
            <code ref={codeRef} className={className} {...props}>{children}</code>
          </pre>
        </div>
      );
    },
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="detail-skeleton">
          <Skeleton.Button size="large" style={{ marginBottom: 24 }} />
          <Skeleton title={{ width: '80%' }} paragraph={{ rows: 1 }} active />
          <div style={{ marginTop: 32 }}>
            <Skeleton.Avatar size="large" active />
            <Skeleton.Input style={{ marginLeft: 16, width: 200 }} active />
          </div>
          <div style={{ marginTop: 48 }}>
            <Skeleton paragraph={{ rows: 8 }} active />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="blog-detail-container">
        <div className="empty-state">
          <p>文章不存在</p>
          <button onClick={() => navigate('/blog')} className="back-btn">
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* 返回按钮 */}
      <button className="back-button" onClick={() => navigate('/blog')}>
        <ArrowLeftOutlined />
        <span>返回博客列表</span>
      </button>

      {/* 文章头部 */}
      <header className="article-header">
        <Tag color={getCategoryColor(article.category)} className="category-tag">
          {getCategoryLabel(article.category)}
        </Tag>
        <h1 className="article-title">{article.title}</h1>

        <div className="article-meta">
          <span className="meta-item">
            <CalendarOutlined />
            {formatTime(article.createdAt)}
          </span>
          <span className="meta-item">
            <ClockCircleOutlined />
            {calculateReadTime(article.content)} 分钟阅读
          </span>
          <span className="meta-item">
            <EyeOutlined />
            {article.views || 0} 次阅读
          </span>
          <span className="meta-item">
            <LikeOutlined />
            {article.likes || 0} 次点赞
          </span>
        </div>

        {/* 点赞按钮 */}
        <Button
          type={liked ? "primary" : "default"}
          icon={liked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLike}
          disabled={liked}
          className="like-button"
        >
          {liked ? '已点赞' : '点赞'}
        </Button>
      </header>

      {/* 分隔线 */}
      <div className="divider" />

      {/* 文章内容 - Markdown 渲染 */}
      <article className="prose article-content" ref={contentRef}>
        <div className="prose-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={MarkdownComponents}
          >
            {article.content || ''}
          </ReactMarkdown>
        </div>
      </article>

      {/* 底部分隔线 */}
      <div className="divider" style={{ marginTop: 64 }} />

      {/* 底部导航 */}
      <div className="article-footer">
        <button className="back-btn-large" onClick={() => navigate('/blog')}>
          <ArrowLeftOutlined />
          <span>返回博客列表</span>
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
