/**
 * 文章/博客相关配置
 */

// 文章分类配置（包含颜色信息）
export const ARTICLE_CATEGORIES = [
  { label: '全部', value: '', color: 'default' },
  { label: '技术文章', value: 'tech', color: 'blue' },
  { label: '科技文章', value: 'science', color: 'purple' },
  { label: 'Node.js', value: 'nodejs', color: 'green' },
  { label: 'Vue.js', value: 'vue', color: 'green' },
  { label: 'React.js', value: 'react', color: 'cyan' },
];

// 不含"全部"选项的分类配置（用于表单选择等场景）
export const ARTICLE_CATEGORY_OPTIONS = ARTICLE_CATEGORIES.filter(cat => cat.value !== '');

// 根据 value 获取分类标签
export const getCategoryLabel = (value: string): string => {
  const category = ARTICLE_CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};

// 根据 value 获取分类颜色
export const getCategoryColor = (value: string): string => {
  const category = ARTICLE_CATEGORIES.find(cat => cat.value === value);
  return category ? category.color : 'default';
};
