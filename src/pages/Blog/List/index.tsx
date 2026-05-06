import { useState, useEffect } from 'react';
import { Tabs, Skeleton, Empty, Spin, Carousel, BackTop, Tag, Button, Badge } from 'antd';
import { ClockCircleOutlined, EyeOutlined, TagsOutlined, ArrowRightOutlined, FireOutlined } from '@ant-design/icons';
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

// 跑马轮播数据 - 使用风景背景图片
const CAROUSEL_DATA = [
  {
    title: '探索、思考、分享 技术与生活',
    description: '欢迎来到我的个人博客，这里记录我在技术探索和生活感悟的点点滴滴。',
    image: 'https://picsum.photos/seed/tech1/1920/600',
  },
  {
    title: '技术驱动未来',
    description: '分享前端开发、后端架构、系统设计的最佳实践和创新技术。',
    image: 'https://picsum.photos/seed/tech2/1920/600',
  },
  {
    title: '持续学习，持续成长',
    description: '每一次的技术探索都是对未知的挑战，让我们共同进步。',
    image: 'https://picsum.photos/seed/tech3/1920/600',
  },
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
      {/* 顶部导航 */}
      <div className="top-nav">
        <div className="nav-content">
          <div className="logo">MyBlog</div>
        </div>
      </div>

      {/* 跑马轮播 */}
      <div className="hero-carousel">
        <Carousel autoplay autoplaySpeed={4000} effect="fade">
          {CAROUSEL_DATA.map((item, index) => (
            <div key={index} className="carousel-slide" style={{ 
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}>
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h1 className="carousel-title">{item.title}</h1>
                  <p className="carousel-description">{item.description}</p>
                  {/* <Button 
                    type="primary" 
                    size="large"
                    className="browse-btn"
                    onClick={() => document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    浏览文章
                  </Button> */}
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 主内容区 */}
      <div className="main-content" id="articles-section">
        {/* 左侧文章列表 */}
        <div className="articles-section">
          <h2 className="section-title">最新文章</h2>
          
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
                      <div className="article-header">
                        <Tag color="blue" className="category-tag">{getCategoryLabel(article.category)}</Tag>
                        <span className="article-date">{formatTime(article.createdAt)}</span>
                      </div>
                      <h2 className="article-title">{article.title}</h2>
                      <p className="article-summary">
                        {article.summary || '暂无摘要，点击查看详情...'}
                      </p>
                      <div className="article-meta">
                        <span className="meta-item">
                          <EyeOutlined />
                          {article.views || 0}
                        </span>
                        <span className="meta-item">
                          <ClockCircleOutlined />
                          {calculateReadTime(article.summary)} 分钟
                        </span>
                      </div>
                    </div>
                  </article>
                ))}

                {/* 加载更多 */}
                {hasMore && (
                  <div className="load-more">
                    <Button
                      type="default"
                      size="large"
                      onClick={handleLoadMore}
                      loading={loading}
                      className="load-more-btn"
                    >
                      {loading ? '加载中...' : '加载更多'}
                    </Button>
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

        {/* 右侧边栏 */}
        <div className="sidebar">
          {/* 热门文章 */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <FireOutlined /> 热门文章
            </h3>
            <div className="hot-articles">
              {articles.slice(0, 5).map((article, index) => (
                <div 
                  key={article.id} 
                  className="hot-article-item"
                  onClick={() => navigate(`/blog/${article.id}`)}
                >
                  <span className="hot-rank">{index + 1}</span>
                  <span className="hot-title">{article.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 标签云 */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <TagsOutlined /> 标签云
            </h3>
            <div className="tag-cloud">
              {CATEGORIES.map(cat => (
                <Tag 
                  key={cat.value}
                  color={cat.value === '' ? 'default' : 'blue'}
                  className="tag-item"
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.label}
                </Tag>
              ))}
              <Tag color="green">React</Tag>
              <Tag color="purple">Vue</Tag>
              <Tag color="orange">Node.js</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* 回到顶部 */}
      <BackTop>
        <div className="back-top-btn">
          <ArrowRightOutlined style={{ transform: 'rotate(-90deg)' }} />
        </div>
      </BackTop>
    </div>
  );
};

export default BlogList;
