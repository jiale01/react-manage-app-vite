import { useState, useEffect } from 'react';
import { Tabs, Skeleton, Empty, Spin } from 'antd';
import { ClockCircleOutlined, EyeOutlined, TagsOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getArticleList, type ArticleItem } from '@/api/article';
import './index.scss';

// 固定分类配置
const CATEGORIES = [
  { label: '全部', value: '' },
  { label: '技术文章', value: 'tech' },
  { label: '科技文章', value: 'science' },
];

const BlogList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取文章列表
  const fetchArticles = async (category = activeCategory, pageNum = page, reset = false) => {
    setLoading(true);
    try {
      const params: any = { page: pageNum, size: 10 };
      if (category) {
        params.category = category;
      }
      const res = await getArticleList(params);
      if (res && res.data) {
        const newList = res.data.data || [];
        if (reset) {
          setArticles(newList);
        } else {
          setArticles(prev => [...prev, ...newList]);
        }
        setHasMore(newList.length > 0 && (res.data.total || 0) > pageNum * 10);
      }
    } catch (error) {
      console.error('获取文章列表失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles('', 1, true);
  }, []);

  // 切换分类
  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setPage(1);
    fetchArticles(key, 1, true);
  };

  // 加载更多
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(activeCategory, nextPage, false);
  };

  // 格式化时间
  const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD');
  };

  // 计算阅读时间（假设每分钟阅读 300 字）
  const calculateReadTime = (content?: string) => {
    if (!content) return 5;
    const words = content.length;
    return Math.ceil(words / 300);
  };

  // 获取分类标签
  const getCategoryLabel = (value: string) => {
    const category = CATEGORIES.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  return (
    <div className="blog-list-container">
      {/* Hero 区域 */}
      <div className="hero-section">
        <h1 className="hero-title">记录技术与思考</h1>
        <p className="hero-subtitle">分享前端开发、系统设计与生活感悟</p>
      </div>

      {/* 分类 Tab */}
      <div className="category-tabs">
        <Tabs
          activeKey={activeCategory}
          onChange={handleCategoryChange}
          items={CATEGORIES.map(cat => ({
            key: cat.value,
            label: cat.label,
          }))}
          className="custom-tabs"
        />
      </div>

      {/* 文章列表 */}
      <div className="article-list">
        {articles.length === 0 && !loading ? (
          <Empty description="暂无文章" />
        ) : (
          <>
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="article-card"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <div className="article-content">
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-summary">
                    {article.summary || '暂无摘要，点击查看详情...'}
                  </p>
                  <div className="article-meta">
                    <span className="meta-item">
                      <ClockCircleOutlined />
                      {calculateReadTime(article.summary)} 分钟阅读
                    </span>
                    <span className="meta-item">
                      <EyeOutlined />
                      {article.views || 0} 次阅读
                    </span>
                    <span className="meta-item">
                      <TagsOutlined />
                      {getCategoryLabel(article.category)}
                    </span>
                    <span className="meta-item date">
                      {formatTime(article.createdAt)}
                    </span>
                  </div>
                </div>
                <ArrowRightOutlined className="article-arrow" />
              </article>
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <div className="load-more">
                <button
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : '加载更多'}
                </button>
              </div>
            )}
          </>
        )}

        {/* 骨架屏 */}
        {loading && articles.length === 0 && (
          <div className="skeleton-list">
            {[1, 2, 3].map(i => (
              <Skeleton
                key={i}
                active
                avatar={false}
                title={{ width: '60%' }}
                paragraph={{ rows: 2, width: ['100%', '80%'] }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
