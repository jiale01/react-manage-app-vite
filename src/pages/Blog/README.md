# 博客展示模块 - Blog Module

## 🎨 设计理念

基于**现代文档美学**（Modern Documentation Aesthetic），打造精致、极简且富有个性的博客展示体验。

### 核心设计原则

- **少即是多**：大面积留白，聚焦内容本身
- **完美排版**：强调字重对比，宽松行高，营造呼吸感
- **细腻质感**：极细边框（1px solid #f0f0f0），微妙圆角（8-12px），柔和阴影
- **微交互**：流畅的悬停动画、淡入效果、滑块过渡

## 📁 目录结构

```
src/pages/Blog/
├── List/
│   ├── index.tsx          # 博客列表页组件
│   └── index.scss         # 列表页样式（含 Tab 定制和悬停动画）
├── Detail/
│   ├── index.tsx          # 博客详情页组件
│   └── index.scss         # 详情页样式（含 prose 排版和代码块装饰）
└── README.md              # 本文档
```

## 🚀 功能特性

### 博客列表页 (`/blog`)

#### Hero 区域
- 超大标题："记录技术与思考"
- 副标题说明，字体层级清晰

#### 分类 Tab
- 使用 Ant Design Tabs 组件
- **深度定制样式**：
  - 去除默认背景色
  - 下划线指示器风格（2px 黑色）
  - 选中态深黑（#000），未选中浅灰（#999）
  - 字间距微宽，无衬线字体
  - 流畅的滑块动画
- **智能分类映射**：
  - 自动从文章数据中提取分类
  - 将英文分类值映射为中文标签显示
  - 支持的分类映射：
    - `tech` → "技术文章"
    - `science` → "科技文章"
    - `life` → "生活随笔"
    - `tutorial` → "教程指南"
    - `news` → "新闻资讯"
  - 未知分类直接显示原始值

#### 文章卡片
- **无边框设计**：依靠留白分隔
- **悬停效果**：
  - 上浮 4px（`translateY(-4px)`）
  - 阴影加深（`0 12px 24px rgba(0, 0, 0, 0.08)`）
  - 标题变蓝（#1677ff）
  - 右侧箭头滑入动画
- **内容层级**：
  1. 标题（Hover 变蓝，24px，font-weight: 600）
  2. 摘要（限制 2 行，灰色，15px，行高 1.8）
  3. 底部元数据（日期、阅读时长、分类标签，13px，Icon 点缀）

#### 加载状态
- 使用 Skeleton 组件
- 圆角矩形骨架屏（12px border-radius）
- 模拟真实内容的呼吸节奏

#### 分页加载
- "加载更多"按钮
- 悬停时上浮 + 阴影效果
- 加载时显示 Spin 图标

### 博客详情页 (`/blog/:id`)

#### 窄栏阅读体验
- 最大宽度 720px，居中显示
- 舒适的阅读行高（1.8）

#### 头部信息
- 返回按钮（精致小箭头，悬停左移）
- 分类标签（胶囊设计，蓝色）
- 大标题（40px，font-weight: 700）
- 元数据：发布时间、阅读时长、阅读量

#### 正文排版（Prose）
使用自定义 SASS 实现优美的排版系统：

**标题层级**
- H1: 32px，带底部分隔线
- H2: 28px
- H3: 24px
- H4: 20px

**文本样式**
- 段落：17px，行高 1.8，字间距舒适
- 链接：蓝色（#1677ff），悬停下划线
- 粗体：font-weight: 600，深黑色
- 斜体：灰色（#666），italic

**特殊元素**
- **引用块**：左侧蓝色边框（4px），浅灰背景，斜体
- **代码块**：
  - Mac 风格窗口装饰（红黄绿三个圆点）
  - 深色背景（#1e1e1e）
  - Fira Code / Consolas 等宽字体
  - 14px 字号，1.6 行高
- **行内代码**：粉色（#e83e8c），浅灰背景，圆角 4px
- **图片**：圆角 8px，阴影，悬停放大 2%
- **表格**：圆角 8px，悬停行高亮，阴影
- **列表**：合理的缩进和间距

#### 骨架屏
- 精致的加载状态
- 模拟标题、作者、正文的骨架结构

## 🎭 微交互动画

### 列表项悬停
```scss
.article-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    
    .article-title {
      color: #1677ff;
    }
    
    .article-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
```

### Tab 切换
- 下划线滑块动画（0.3s cubic-bezier）
- 文字颜色渐变

### 页面淡入
```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 按钮反馈
- 悬停上浮 2px
- 边框加深
- 阴影出现

## 🛠️ 技术实现

### API 接口
```typescript
// src/api/article/index.ts

// 获取文章列表（支持分页和分类筛选）
getArticleList(params?: { page?: number; size?: number; category?: string })

// 获取文章详情
getArticleDetail(id: number)
```

**分类数据说明**：
分类 Tab 的数据会从文章列表中自动提取。首次加载时，系统会获取所有文章以构建完整的分类列表，使用 `Set` 去重后生成分类选项。这种方式无需单独的分类接口，确保分类数据与文章内容实时同步。

### 类型定义
``typescript
interface ArticleItem {
  id: number;
  title: string;
  category: string;
  summary?: string;
  content?: string;
  cover?: string;
  author?: string;
  readTime?: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
}
```

### 路由配置
```typescript
// src/router/index.tsx
{
  path: "/blog",
  element: <BlogList />
},
{
  path: "/blog/:id",
  element: <BlogDetail />
}
```

## 🎨 色彩系统

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主标题 | `#000` | 纯黑，厚重 |
| 正文 | `#333` | 深灰，舒适 |
| 次要文字 | `#666` | 中灰 |
| 辅助文字 | `#999` | 浅灰 |
| 强调色 | `#1677ff` | Ant Design 蓝 |
| 边框 | `#f0f0f0` | 极浅灰 |
| 背景 | `#fafafa` | 超浅灰 |
| 代码背景 | `#1e1e1e` | 深色 |

## 📱 响应式设计

### 断点
- **Desktop**: > 768px（完整布局）
- **Mobile**: ≤ 768px（简化布局）

### 移动端适配
- 标题字号缩小
- 元数据垂直排列
- 隐藏右侧箭头
- 减小内边距
- 代码块字号调整

## 🔧 自定义扩展

### 修改主题色
在 `index.scss` 中搜索 `#1677ff` 并替换为你的品牌色。

### 调整排版
修改 `.prose-content` 中的字体大小和行高。

### 添加更多微交互
在 SASS 文件中添加新的 `@keyframes` 动画。

## 📝 使用示例

### 访问博客列表
```
http://localhost:5173/blog
```

### 访问文章详情
```
http://localhost:5173/blog/1
```

## 🌟 设计亮点

1. **Tab 下划线指示器**：完全重写 Ant Design Tabs，采用极简下划线风格
2. **Mac 风格代码块**：红黄绿窗口装饰，专业感十足
3. **卡片悬停动画**：上浮 + 阴影 + 箭头滑入，三重反馈
4. **Prose 排版系统**：完整的 Markdown 渲染样式
5. **骨架屏呼吸效果**：优雅的加载状态
6. **胶囊分类标签**：圆角 20px，轻盈现代
7. **渐变分隔线**：`linear-gradient` 实现淡入淡出效果

## 💡 注意事项

1. **后端接口**：需要实现 `/api_v1/article/categories` 接口返回分类列表
2. **文章内容**：详情页使用 `dangerouslySetInnerHTML`，确保后端返回安全的 HTML
3. **阅读时长计算**：默认按每分钟 300 字计算，可根据实际情况调整
4. **图片优化**：建议后端返回压缩后的图片，或集成 CDN

## 🎯 后续优化方向

- [ ] 添加文章搜索功能
- [ ] 实现相关文章推荐
- [ ] 添加评论系统
- [ ] 支持暗色模式
- [ ] 添加阅读进度条
- [ ] 实现目录导航（TOC）
- [ ] 添加分享功能

---

**Designed with ❤️ by Awwwards-winning Frontend Engineer**
