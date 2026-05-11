import { useState, useEffect } from 'react';
import { Tabs, Skeleton, Empty, Spin, Carousel, BackTop, Tag, Button, Badge, Avatar, Dropdown, type MenuProps } from 'antd';
import { ClockCircleOutlined, EyeOutlined, TagsOutlined, ArrowRightOutlined, FireOutlined, LikeOutlined, GithubOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getBlogList, type BlogItem } from '@/api/blog';
import { ARTICLE_CATEGORIES, getCategoryColor } from '@/config';
import useTitle from '@/hooks/useTitle';
import './index.scss';
import Banner1 from '@/assets/blog/banner1.jpg';
import Banner2 from '@/assets/blog/banner2.jpg';
import Banner3 from '@/assets/blog/banner3.jpg';
import avatarImg from '@/assets/avatar.png';

// 跑马轮播数据 - 使用风景背景图片
const CAROUSEL_DATA = [
  {
    title: '探索、思考、分享 技术与生活',
    description: '欢迎来到我的个人博客，这里记录我在技术探索和生活感悟的点点滴滴。',
    image: Banner1,
  },
  {
    title: '技术驱动未来',
    description: '分享前端开发、后端架构、系统设计的最佳实践和创新技术。',
    image: Banner2
  },
  {
    title: '持续学习，持续成长',
    description: '每一次的技术探索都是对未知的挑战，让我们共同进步。',
    image: Banner3,
  },
];

const BlogList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<BlogItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 设置页面标题
  useTitle('Zane的个人技术博客');

  // 获取文章列表
  const fetchArticles = async (category = activeCategory, pageNum = page, reset = false) => {
    setLoading(true);
    try {
      const params: any = { page: pageNum, size: 10 };
      if (category) {
        params.category = category;
      }
      const res = await getBlogList(params);
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
    // 去除 HTML 标签，只计算纯文本字数
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.length;
    return Math.ceil(words / 300);
  };

  // 从 content 中提取纯文本并截取前一段作为摘要
  const getArticleSummary = (content?: string) => {
    if (!content) return '暂无摘要，点击查看详情...';

    // 去除 HTML 标签
    const plainText = content.replace(/<[^>]*>/g, '');

    // 截取前 150 个字符
    const maxLength = 150;
    if (plainText.length <= maxLength) {
      return plainText;
    }

    // 找到最后一个完整的句子或单词边界
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const lastPunctuation = Math.max(
      truncated.lastIndexOf('。'),
      truncated.lastIndexOf('！'),
      truncated.lastIndexOf('？'),
      truncated.lastIndexOf('.')
    );

    // 优先在标点符号处截断，其次在空格处
    const cutIndex = lastPunctuation > 0 ? lastPunctuation + 1 : (lastSpace > 0 ? lastSpace : maxLength);

    return plainText.substring(0, cutIndex) + '...';
  };

  // 获取分类标签
  const getCategoryLabel = (value: string) => {
    const category = ARTICLE_CATEGORIES.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  // 用户下拉菜单配置
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'github',
      label: (
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <GithubOutlined style={{ marginRight: 8 }} />
          GitHub
        </a>
      ),
    },
    {
      key: 'vue',
      label: (
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
          <GlobalOutlined style={{ marginRight: 8 }} />
          Vue 官网文档
        </a>
      ),
    },
    {
      key: 'react',
      label: (
        <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
          <GlobalOutlined style={{ marginRight: 8 }} />
          React 官网文档
        </a>
      ),
    },
  ];

  return (
    <div className="blog-list-container">
      {/* 顶部导航 */}
      <div className="top-nav">
        <div className="nav-content">
          <div className="logo">ZaneBlog</div>

          {/* 用户菜单 */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="user-menu-trigger">
              <Avatar src={avatarImg} size={32} />
              <span className="user-name">Zane</span>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* 跑马轮播 */}
      <div className="hero-carousel">
        <Carousel autoplay autoplaySpeed={4000} effect="fade">
          {CAROUSEL_DATA.map((item, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h1 className="carousel-title">{item.title}</h1>
                  <p className="carousel-description">{item.description}</p>
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
              items={ARTICLE_CATEGORIES.map(cat => ({
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
                        <Tag color={getCategoryColor(article.category)} className="category-tag">{getCategoryLabel(article.category)}</Tag>
                        <span className="article-date">{formatTime(article.createdAt)}</span>
                      </div>
                      <h2 className="article-title">{article.title}</h2>
                      <p className="article-summary">
                        {getArticleSummary(article.content)}
                      </p>
                      <div className="article-meta">
                        <span className="meta-item">
                          <EyeOutlined />
                          {article.views || 0}
                        </span>
                        <span className="meta-item">
                          <LikeOutlined />
                          {article.likes || 0}
                        </span>
                        <span className="meta-item">
                          <ClockCircleOutlined />
                          {calculateReadTime(article.content)} 分钟
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
          {/* 个人介绍 */}
          <div className="sidebar-card profile-card">
            <div className="profile-header">
              <Avatar
                size={80}
                src={avatarImg}
                className="profile-avatar"
              />
              <h4 className="profile-name">Zane</h4>
              <p className="profile-bio">前端开发者 | 技术分享者</p>
            </div>
            <div className="profile-links">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link-item"
              >
                <GithubOutlined />
                <span>GitHub</span>
              </a>
              <a
                href="https://yourblog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link-item"
              >
                <GlobalOutlined />
                <span>博客</span>
              </a>
            </div>
          </div>

          {/* 热门文章 */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <FireOutlined /> 热门文章
            </h3>
            <div className="hot-articles">
              {[...articles]
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 5)
                .map((article, index) => (
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
              {ARTICLE_CATEGORIES.filter(cat => cat.value !== '').map(cat => (
                <Tag
                  key={cat.value}
                  color={cat.color}
                  className="tag-item"
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.label}
                </Tag>
              ))}
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
