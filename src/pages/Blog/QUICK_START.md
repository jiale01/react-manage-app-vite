# 博客模块快速启动指南

## 🚀 5 分钟快速体验

### 1. 确认依赖已安装

项目已包含以下必要依赖：
- ✅ React 18+
- ✅ Ant Design v5
- ✅ Tailwind CSS
- ✅ SASS
- ✅ Day.js
- ✅ React Router v6

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问博客页面

在浏览器中打开：
- **博客列表**: http://localhost:5173/blog
- **文章详情**: http://localhost:5173/blog/1（需要有 ID 为 1 的文章）

---

## 🔧 后端接口要求

确保你的后端实现了以下接口：

### 1. 获取文章列表
```
GET /api_v1/article/list?page=1&size=10&category=前端
```

**响应格式：**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "React Hooks 最佳实践",
        "category": "前端",
        "summary": "本文介绍 React Hooks 的使用技巧...",
        "content": "<p>文章内容...</p>",
        "views": 128,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

**注意**: 分类数据会从文章列表中自动提取，无需单独的分类接口。首次加载时会获取所有文章以构建完整的分类列表。

### 2. 获取文章详情
```
GET /api_v1/article/detail/1
```

**响应格式：**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "React Hooks 最佳实践",
    "category": "前端",
    "summary": "本文介绍 React Hooks 的使用技巧...",
    "content": "<h2>简介</h2><p>文章内容...</p>",
    "views": 128,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. 获取分类列表（已移除）

**说明**: 分类数据现在从文章列表中自动提取，无需单独的分类接口。首次加载博客列表时，系统会：
1. 获取第一页文章（10条）用于展示
2. 同时获取所有文章（最多1000条）以提取完整的分类列表
3. 使用 `Set` 去重后生成分类 Tab

这种方式的优势：
- ✅ 减少后端接口依赖
- ✅ 分类数据始终与文章内容同步
- ✅ 自动处理新增分类

---

## 📝 测试数据示例

如果后端暂无数据，可以使用以下测试数据：

### 创建测试文章

```typescript
// 在浏览器控制台运行
const testArticles = [
  {
    title: "React Hooks 最佳实践",
    category: "前端",
    content: `
      <h2>什么是 Hooks？</h2>
      <p>Hooks 是 React 16.8 引入的新特性，让你在不编写 class 的情况下使用 state 和其他 React 特性。</p>
      
      <h2>常用 Hooks</h2>
      <ul>
        <li><code>useState</code> - 状态管理</li>
        <li><code>useEffect</code> - 副作用处理</li>
        <li><code>useContext</code> - 上下文访问</li>
      </ul>
      
      <blockquote>
        Hooks 让函数组件变得强大而优雅。
      </blockquote>
      
      <h3>代码示例</h3>
      <pre><code>const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);</code></pre>
    `
  },
  {
    title: "TypeScript 高级类型技巧",
    category: "前端",
    content: "<p>TypeScript 内容...</p>"
  },
  {
    title: "Node.js 性能优化指南",
    category: "后端",
    content: "<p>Node.js 内容...</p>"
  }
];

// 通过 API 创建
testArticles.forEach(article => {
  fetch('/api_v1/article/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article)
  });
});
```

---

## 🎨 样式定制

### 修改主题色

编辑 `src/pages/Blog/List/index.scss` 和 `src/pages/Blog/Detail/index.scss`：

```scss
// 将所有 #1677ff 替换为你的品牌色
$primary-color: #your-color;

.article-title:hover {
  color: $primary-color;
}
```

### 调整字体

在 `index.scss` 中添加：

```scss
.blog-list-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 修改间距

```scss
.article-card {
  padding: 24px; // 原来是 32px
}
```

---

## 🐛 常见问题

### Q1: Tab 样式没有生效？

**A:** 检查是否正确导入了 SASS 文件：
```tsx
import './index.scss'; // 确保这行存在
```

### Q2: 文章卡片没有悬停动画？

**A:** 确认浏览器支持 CSS transitions，检查控制台是否有 CSS 错误。

### Q3: 代码块没有 Mac 风格装饰？

**A:** 检查 `::before` 伪元素的样式是否被覆盖，可能需要提高选择器优先级。

### Q4: 移动端布局错乱？

**A:** 确认 viewport meta 标签存在：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Q5: 骨架屏不显示？

**A:** 检查 `loading` 状态是否正确切换，以及 `articles.length === 0` 条件。

---

## 🔍 调试技巧

### 查看动画效果

在 Chrome DevTools 中：
1. 打开 Elements 面板
2. 选中 `.article-card`
3. 在 Styles 面板中找到 `transition`
4. 点击旁边的贝塞尔曲线图标，实时预览动画

### 性能监控

```javascript
// 在控制台运行，监控 FPS
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`FPS: ${Math.round(1000 / entry.duration)}`);
  }
});
observer.observe({ entryTypes: ['measure'] });
```

### 检查响应式

Chrome DevTools → Toggle device toolbar → 选择不同设备尺寸

---

## 📦 生产部署

### 1. 构建项目

```bash
npm run build
```

### 2. 检查资源大小

```bash
npm run preview
```

### 3. 优化建议

- 启用 Gzip/Brotli 压缩
- 配置 CDN 缓存策略
- 图片使用 WebP 格式
- 懒加载非首屏内容

---

## 🎯 下一步

1. **添加搜索功能** - 在 Hero 区域添加搜索框
2. **实现评论系统** - 集成 Disqus 或自建评论
3. **暗色模式** - 使用 CSS variables 实现主题切换
4. **阅读进度条** - 在顶部显示滚动进度
5. **相关文章** - 在详情页底部推荐相似文章

---

## 📞 需要帮助？

如果遇到任何问题：
1. 检查浏览器控制台错误
2. 查看 `DESIGN_PREVIEW.md` 了解设计细节
3. 参考 `README.md` 了解完整文档
4. 检查后端接口返回数据格式是否正确

---

**Happy Coding! 🎉**
