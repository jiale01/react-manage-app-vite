import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Tag, Skeleton } from 'antd';
import { 
  ArrowLeftOutlined, 
  ClockCircleOutlined, 
  EyeOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getArticleDetail, type ArticleItem } from '@/api/article';
import './index.scss';

// 分类映射表（与列表页保持一致）
const CATEGORY_MAP: Record<string, string> = {
  'tech': '技术文章',
  'science': '科技文章',
  'life': '生活随笔',
  'tutorial': '教程指南',
  'news': '新闻资讯',
};

const getCategoryLabel = (category: string): string => {
  return CATEGORY_MAP[category] || category;
};

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<ArticleItem | null>(null);

  // 获取文章详情
  const fetchArticleDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const res = await getArticleDetail(Number(id));
      if (res && res.data) {
        setArticle(res.data);
      }
    } catch (error) {
      console.error('获取文章详情失败', error);
    } finally {
      setLoading(false);
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
        <Tag color="blue" className="category-tag">
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
            {calculateReadTime(article.summary || article.title)} 分钟阅读
          </span>
          <span className="meta-item">
            <EyeOutlined />
            {article.views || 0} 次阅读
          </span>
        </div>
      </header>

      {/* 分隔线 */}
      <div className="divider" />

      {/* 文章内容 */}
      <article className="article-content prose">
        <div 
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: article.content || '<p>暂无内容</p>' }}
        />
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
