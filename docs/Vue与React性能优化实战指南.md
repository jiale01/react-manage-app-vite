# Vue 与 React 性能优化实战指南

## 📖 目录

1. [简介](#简介)
2. [性能优化的重要性](#性能优化的重要性)
3. [React 性能优化](#react-性能优化)
4. [Vue 性能优化](#vue-性能优化)
5. [框架对比分析](#框架对比分析)
6. [通用优化策略](#通用优化策略)
7. [实战案例](#实战案例)
8. [性能监控工具](#性能监控工具)
9. [最佳实践清单](#最佳实践清单)

---

## 简介

在现代 Web 开发中，**性能优化**是提升用户体验的关键因素。无论是 Vue 还是 React，都需要关注渲染性能、加载速度、内存使用等方面。本文将深入探讨两个主流框架的性能优化策略，帮助你构建流畅、高效的前端应用。

### 为什么需要性能优化？

- ⚡ **用户体验**：流畅的交互和快速的响应
- 📱 **移动端友好**：移动设备性能有限，更需要优化
- 🔍 **SEO 优势**：更快的加载速度有利于搜索引擎排名
- 💰 **业务价值**：性能直接影响转化率和用户留存

### 关键性能指标

```
核心 Web Vitals：
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

React/Vue 特定指标：
- 组件渲染时间: < 16ms (60fps)
- 首次加载时间: < 3s
- 包体积: < 200KB (gzip)
```

---

## 性能优化的重要性

### 性能对业务的影响

```
Amazon 的研究数据：
- 页面加载每慢 100ms，销售额下降 1%

Google 的研究数据：
- 页面加载时间从 1s 增加到 3s，跳出率增加 32%
- 页面加载时间从 1s 增加到 5s，跳出率增加 90%

Walmart 的数据：
- 页面加载时间每减少 1s，转化率提高 2%
```

### 常见性能问题

1. **不必要的重渲染** - 组件频繁更新
2. **大包体积** - 加载时间长
3. **内存泄漏** - 长时间运行后变慢
4. **阻塞主线程** - JavaScript 执行时间过长
5. **未优化的图片** - 资源加载缓慢

---

## React 性能优化

### 1. 使用 React.memo 避免不必要重渲染

#### ❌ 低效实现

```tsx
// 父组件状态变化时，所有子组件都会重渲染
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ChildComponent name={name} /> {/* count 变化时也会重渲染 */}
    </div>
  );
}

function ChildComponent({ name }: { name: string }) {
  console.log('Child rendered'); // 每次都会打印
  return <div>{name}</div>;
}
```

#### ✅ 优化实现

```tsx
import React from 'react';

// 使用 React.memo 包裹子组件
const ChildComponent = React.memo(({ name }: { name: string }) => {
  console.log('Child rendered'); // 只在 name 变化时打印
  return <div>{name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ChildComponent name={name} /> {/* count 变化时不会重渲染 */}
    </div>
  );
}
```

**自定义比较函数：**

```tsx
const ExpensiveComponent = React.memo(({ data, config }: Props) => {
  // 复杂渲染逻辑
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.data.id === nextProps.data.id &&
         prevProps.config.theme === nextProps.config.theme;
});
```

### 2. 使用 useMemo 缓存计算结果

#### ❌ 每次渲染都重新计算

```tsx
function UserList({ users, filter }: Props) {
  // 每次渲染都会执行过滤和排序
  const filteredUsers = users
    .filter(user => user.name.includes(filter))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### ✅ 使用 useMemo 缓存

```tsx
function UserList({ users, filter }: Props) {
  // 只在 users 或 filter 变化时重新计算
  const filteredUsers = useMemo(() => {
    console.log('Filtering and sorting...');
    return users
      .filter(user => user.name.includes(filter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, filter]);

  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 3. 使用 useCallback 缓存函数

#### ❌ 每次渲染创建新函数引用

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // 每次渲染都会创建新的 handleClick 函数
  const handleClick = () => {
    console.log('Clicked', count);
  };

  return (
    <div>
      <Child onClick={handleClick} /> {/* 即使逻辑相同，引用也不同 */}
    </div>
  );
}

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
```

#### ✅ 使用 useCallback 缓存

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // 只有 count 变化时才创建新函数
  const handleClick = useCallback(() => {
    console.log('Clicked', count);
  }, [count]);

  return (
    <div>
      <Child onClick={handleClick} /> {/* 引用稳定，避免子组件重渲染 */}
    </div>
  );
}

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
```

### 4. 代码分割与懒加载

#### 动态导入组件

```tsx
import { lazy, Suspense } from 'react';

// 懒加载组件
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

#### 路由级别代码分割

```tsx
import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 5. 虚拟列表优化长列表

```tsx
import { FixedSizeList } from 'react-window';

interface Item {
  id: number;
  name: string;
}

function VirtualList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**安装依赖：**
```bash
npm install react-window
```

### 6. 避免内联对象和函数

#### ❌ 每次渲染创建新对象

```tsx
function Component() {
  return (
    <div>
      {/* 每次渲染都创建新的 style 对象 */}
      <div style={{ color: 'red', fontSize: '16px' }}>Text</div>
      
      {/* 每次渲染都创建新的数组 */}
      <Child items={[1, 2, 3]} />
    </div>
  );
}
```

#### ✅ 提取到外部或使用 useMemo

```tsx
// 方案 1：提取到组件外部
const defaultStyle = { color: 'red', fontSize: '16px' };
const defaultItems = [1, 2, 3];

function Component() {
  return (
    <div>
      <div style={defaultStyle}>Text</div>
      <Child items={defaultItems} />
    </div>
  );
}

// 方案 2：使用 useMemo
function Component({ theme }: { theme: string }) {
  const style = useMemo(() => ({
    color: theme === 'dark' ? 'white' : 'black',
    fontSize: '16px'
  }), [theme]);

  return <div style={style}>Text</div>;
}
```

### 7. 使用 Profiler 检测性能

```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Component />
    </Profiler>
  );
}
```

### 8. 优化 Context 使用

#### ❌ Context 值变化导致所有消费者重渲染

```tsx
const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function App() {
  const [theme, setTheme] = useState('light');
  
  // 每次渲染都创建新的 context value 对象
  const value = { theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') };

  return (
    <ThemeContext.Provider value={value}>
      <Child />
    </ThemeContext.Provider>
  );
}
```

#### ✅ 拆分 Context 或使用 useMemo

```tsx
// 方案 1：拆分 Context
const ThemeContext = createContext('light');
const ThemeToggleContext = createContext(() => {});

function App() {
  const [theme, setTheme] = useState('light');
  
  const toggle = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeToggleContext.Provider value={toggle}>
        <Child />
      </ThemeToggleContext.Provider>
    </ThemeContext.Provider>
  );
}

// 方案 2：使用 useMemo
function App() {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({
    theme,
    toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <Child />
    </ThemeContext.Provider>
  );
}
```

---

## Vue 性能优化

### 1. 使用 v-once 避免不必要的更新

```vue
<!-- ❌ 每次数据变化都会重新渲染 -->
<div>{{ staticText }}</div>

<!-- ✅ 只渲染一次，后续不再更新 -->
<div v-once>{{ staticText }}</div>
```

### 2. 合理使用 v-show vs v-if

```vue
<!-- ✅ 频繁切换：使用 v-show（CSS display） -->
<div v-show="isVisible">Content</div>

<!-- ✅ 条件很少改变：使用 v-if（真正的条件渲染） -->
<div v-if="hasPermission">Admin Panel</div>

<!-- ❌ 避免在 v-for 中使用 v-if -->
<div v-for="item in items" v-if="item.active">
  {{ item.name }}
</div>

<!-- ✅ 使用计算属性过滤 -->
<div v-for="item in activeItems" :key="item.id">
  {{ item.name }}
</div>

<script setup>
const activeItems = computed(() => items.filter(item => item.active));
</script>
```

### 3. 使用 computed 缓存计算结果

```vue
<script setup>
import { ref, computed } from 'vue';

const users = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 28 }
]);

const searchKeyword = ref('');

// ❌ 每次渲染都重新计算
// const filteredUsers = users.value.filter(...)

// ✅ 使用 computed 缓存，只在依赖变化时重新计算
const filteredUsers = computed(() => {
  console.log('Filtering users...');
  return users.value.filter(user => 
    user.name.includes(searchKeyword.value)
  );
});
</script>

<template>
  <input v-model="searchKeyword" placeholder="搜索..." />
  <ul>
    <li v-for="user in filteredUsers" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

### 4. 使用 watchEffect 替代多个 watch

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue';

const firstName = ref('张');
const lastName = ref('三');
const fullName = ref('');

// ❌ 需要监听多个依赖
watch(firstName, () => {
  fullName.value = `${firstName.value}${lastName.value}`;
});
watch(lastName, () => {
  fullName.value = `${firstName.value}${lastName.value}`;
});

// ✅ 自动追踪依赖
watchEffect(() => {
  fullName.value = `${firstName.value}${lastName.value}`;
});
</script>
```

### 5. 异步组件懒加载

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

// 基本用法
const AsyncComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
);

// 带加载状态和错误处理
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200, // 延迟显示 loading
  timeout: 3000 // 超时时间
});
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

### 6. 虚拟滚动优化长列表

```vue
<script setup>
import { ref } from 'vue';
import DynamicScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})));
</script>

<template>
  <DynamicScroller
    :items="items"
    :min-item-size="50"
    class="scroller"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.name]"
        :data-index="index"
      >
        <div class="item">
          {{ item.name }}
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<style scoped>
.scroller {
  height: 400px;
}
.item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
```

**安装依赖：**
```bash
npm install vue-virtual-scroller
```

### 7. 使用 keep-alive 缓存组件

```vue
<template>
  <!-- ✅ 缓存组件实例，避免重复创建销毁 -->
  <keep-alive :include="['Home', 'About']" :max="10">
    <component :is="currentComponent" />
  </keep-alive>
</template>

<script setup>
import { ref } from 'vue';
import Home from './views/Home.vue';
import About from './views/About.vue';

const currentComponent = ref('Home');
</script>
```

**适用场景：**
- Tab 切换
- 路由切换
- 表单页面（保留用户输入）

### 8. 优化 v-for 的 key

```vue
<!-- ❌ 使用 index 作为 key -->
<div v-for="(item, index) in items" :key="index">
  {{ item.name }}
</div>

<!-- ✅ 使用唯一 ID -->
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

<!-- ❌ 不使用 key -->
<div v-for="item in items">
  {{ item.name }}
</div>
```

### 9. 防抖和节流

```vue
<script setup>
import { ref } from 'vue';
import { debounce } from 'lodash-es';

const searchKeyword = ref('');

// ✅ 防抖搜索
const handleSearch = debounce((keyword: string) => {
  console.log('Searching:', keyword);
  // 执行搜索逻辑
}, 300);

const onInput = (event: Event) => {
  searchKeyword.value = (event.target as HTMLInputElement).value;
  handleSearch(searchKeyword.value);
};
</script>

<template>
  <input 
    :value="searchKeyword"
    @input="onInput"
    placeholder="搜索..."
  />
</template>
```

### 10. 使用 shallowRef 优化大型对象

```vue
<script setup>
import { ref, shallowRef, triggerRef } from 'vue';

// ❌ 深层响应式，性能开销大
const largeObject = ref({
  data: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i }))
});

// ✅ 浅层响应式，只在替换整个对象时触发更新
const largeObjectShallow = shallowRef({
  data: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i }))
});

// 修改时需要手动触发更新
function updateData() {
  largeObjectShallow.value.data.push({ id: 10000, value: 10000 });
  triggerRef(largeObjectShallow); // 手动触发更新
}
</script>
```

---

## 框架对比分析

### React vs Vue 性能特性对比

| 特性 | React | Vue | 说明 |
|------|-------|-----|------|
| **更新机制** | 虚拟 DOM diff | 响应式系统 + 虚拟 DOM | Vue 更精确知道哪些组件需要更新 |
| **优化方式** | 手动优化（memo、useMemo） | 自动优化（响应式追踪） | React 需要更多手动优化 |
| **包体积** | ~42KB (gzip) | ~33KB (gzip) | Vue 略小 |
| **首次渲染** | 较快 | 较快 | 差异不大 |
| **大量数据更新** | 需要手动优化 | 自动批处理 | Vue 更有优势 |
| **学习曲线** | 较陡 | 平缓 | Vue 更易上手 |
| **生态系统** | 更丰富 | 足够用 | React 生态更大 |

### 更新机制对比

#### React：自顶向下 diff

```
State 变化
  ↓
触发重新渲染
  ↓
生成新的 Virtual DOM
  ↓
Diff 算法对比
  ↓
找出变化的部分
  ↓
更新真实 DOM
```

#### Vue：响应式追踪

```
State 变化
  ↓
响应式系统检测到变化
  ↓
精确知道哪些组件依赖这个状态
  ↓
只更新这些组件
  ↓
生成 Virtual DOM
  ↓
Diff 并更新真实 DOM
```

### 代码量对比

**实现相同功能：**

```tsx
// React - 需要手动优化
const UserList = React.memo(({ users, filter }) => {
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.includes(filter));
  }, [users, filter]);

  const handleClick = useCallback((id) => {
    console.log(id);
  }, []);

  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id} onClick={() => handleClick(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
});
```

```vue
<!-- Vue - 自动优化 -->
<script setup>
import { computed } from 'vue';

const props = defineProps(['users', 'filter']);
const emit = defineEmits(['click']);

const filteredUsers = computed(() => 
  props.users.filter(u => u.name.includes(props.filter))
);

const handleClick = (id) => {
  emit('click', id);
};
</script>

<template>
  <ul>
    <li 
      v-for="user in filteredUsers" 
      :key="user.id"
      @click="handleClick(user.id)"
    >
      {{ user.name }}
    </li>
  </ul>
</template>
```

**结论：** Vue 代码更简洁，React 需要更多手动优化。

---

## 通用优化策略

### 1. 图片优化

#### 使用现代格式

```html
<!-- ✅ 使用 WebP/AVIF -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="描述" />
</picture>
```

#### 懒加载

```html
<!-- ✅ 原生懒加载 -->
<img src="image.jpg" loading="lazy" alt="描述" />

<!-- ✅ React 懒加载组件 -->
const LazyImage = lazy(() => import('./LazyImage'));

<!-- ✅ Vue 懒加载 -->
const LazyImage = defineAsyncComponent(() => import('./LazyImage.vue'));
```

#### 响应式图片

```html
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1200px"
  src="medium.jpg"
  alt="描述"
/>
```

### 2. 代码分割

#### React Router 代码分割

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

#### Vue Router 代码分割

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/about',
      component: () => import('./views/About.vue')
    }
  ]
});
```

### 3. Tree Shaking

#### 按需导入

```javascript
// ❌ 导入整个库
import _ from 'lodash';
import * as Antd from 'antd';

// ✅ 按需导入
import debounce from 'lodash/debounce';
import { Button, Input } from 'antd';
```

#### Vite 配置优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          lodash: ['lodash-es']
        }
      }
    }
  }
});
```

### 4. 服务端渲染（SSR）

#### Next.js（React）

```tsx
// pages/index.tsx
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  return { props: { data } };
}

export default function Home({ data }) {
  return <div>{/* 使用 data */}</div>;
}
```

#### Nuxt.js（Vue）

```vue
<script setup>
const { data } = await useFetch('https://api.example.com/data');
</script>

<template>
  <div>{{ data }}</div>
</template>
```

### 5. 缓存策略

#### HTTP 缓存

```nginx
# nginx 配置
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

#### Service Worker

```javascript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 6. Web Workers

#### 将耗时任务移到 Worker

```javascript
// worker.js
self.onmessage = (e) => {
  const { data } = e;
  const result = heavyComputation(data);
  self.postMessage(result);
};

function heavyComputation(data) {
  // 耗时计算
  return data.map(item => expensiveOperation(item));
}
```

```tsx
// React 中使用
function Component() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const worker = new Worker('./worker.js');
    
    worker.onmessage = (e) => {
      setResult(e.data);
    };

    worker.postMessage(largeData);

    return () => worker.terminate();
  }, []);

  return <div>{result}</div>;
}
```

---

## 实战案例

### 案例 1：优化大数据表格

#### React 实现

```tsx
import { useMemo, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

interface DataRow {
  id: number;
  name: string;
  email: string;
  age: number;
}

function DataTable({ data }: { data: DataRow[] }) {
  const [sortKey, setSortKey] = useState<keyof DataRow>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  // 缓存排序和过滤结果
  const processedData = useMemo(() => {
    let filtered = data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder, filter]);

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const row = processedData[rowIndex];
    const keys: (keyof DataRow)[] = ['id', 'name', 'email', 'age'];
    const value = row[keys[columnIndex]];

    return (
      <div style={style} className="cell">
        {value}
      </div>
    );
  };

  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="搜索..."
      />
      <Grid
        columnCount={4}
        columnWidth={150}
        height={400}
        rowCount={processedData.length}
        rowHeight={35}
        width={600}
      >
        {Cell}
      </Grid>
    </div>
  );
}
```

#### Vue 实现

```vue
<script setup>
import { ref, computed } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

const props = defineProps<{
  data: Array<{
    id: number;
    name: string;
    email: string;
    age: number;
  }>;
}>();

const sortKey = ref<keyof typeof props.data[0]>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const filter = ref('');

const processedData = computed(() => {
  let filtered = props.data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(filter.value.toLowerCase())
    )
  );

  return filtered.sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const handleSort = (key: keyof typeof props.data[0]) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};
</script>

<template>
  <div>
    <input 
      v-model="filter"
      placeholder="搜索..."
    />
    <DynamicScroller
      :items="processedData"
      :min-item-size="35"
      class="scroller"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :data-index="index"
        >
          <div class="row">
            <div class="cell">{{ item.id }}</div>
            <div class="cell">{{ item.name }}</div>
            <div class="cell">{{ item.email }}</div>
            <div class="cell">{{ item.age }}</div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>
```

### 案例 2：优化无限滚动

#### React 实现

```tsx
import { useState, useEffect, useCallback, useRef } from 'react';

function InfiniteScroll() {
  const [items, setItems] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItems = Array.from(
      { length: 20 }, 
      (_, i) => items.length + i + 1
    );
    
    setItems(prev => [...prev, ...newItems]);
    setPage(p => p + 1);
    setLoading(false);
  }, [items.length, loading]);

  useEffect(() => {
    loadMore();
  }, []);

  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, loadMore]);

  return (
    <div>
      {items.map((item, index) => (
        <div 
          key={item}
          ref={index === items.length - 1 ? lastItemRef : null}
          className="item"
        >
          Item {item}
        </div>
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}
```

#### Vue 实现

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const items = ref<number[]>([]);
const page = ref(1);
const loading = ref(false);
const observer = ref<IntersectionObserver | null>(null);
const lastItemElement = ref<HTMLDivElement | null>(null);

const loadMore = async () => {
  if (loading.value) return;
  
  loading.value = true;
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newItems = Array.from(
    { length: 20 }, 
    (_, i) => items.value.length + i + 1
  );
  
  items.value.push(...newItems);
  page.value++;
  loading.value = false;
};

onMounted(() => {
  loadMore();
  
  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value) {
      loadMore();
    }
  });
  
  if (lastItemElement.value) {
    observer.value.observe(lastItemElement.value);
  }
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
});

const setLastItemRef = (el: HTMLDivElement | null) => {
  lastItemElement.value = el;
  if (observer.value && el) {
    observer.value.observe(el);
  }
};
</script>

<template>
  <div>
    <div 
      v-for="(item, index) in items" 
      :key="item"
      :ref="index === items.length - 1 ? setLastItemRef : undefined"
      class="item"
    >
      Item {{ item }}
    </div>
    <div v-if="loading">Loading...</div>
  </div>
</template>
```

### 案例 3：优化表单性能

#### React 实现 - 使用 React Hook Form

```tsx
import { useForm } from 'react-hook-form';

interface FormData {
  username: string;
  email: string;
  password: string;
}

function OptimizedForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('username', { 
            required: '用户名不能为空',
            minLength: { value: 3, message: '至少3个字符' }
          })}
          placeholder="用户名"
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>

      <div>
        <input
          {...register('email', { 
            required: '邮箱不能为空',
            pattern: { 
              value: /\S+@\S+\.\S+/, 
              message: '邮箱格式不正确' 
            }
          })}
          placeholder="邮箱"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input
          type="password"
          {...register('password', { 
            required: '密码不能为空',
            minLength: { value: 6, message: '至少6个字符' }
          })}
          placeholder="密码"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit">提交</button>
    </form>
  );
}
```

**安装依赖：**
```bash
npm install react-hook-form
```

#### Vue 实现 - 使用 VeeValidate

```vue
<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string().required('用户名不能为空').min(3, '至少3个字符'),
  email: yup.string().required('邮箱不能为空').email('邮箱格式不正确'),
  password: yup.string().required('密码不能为空').min(6, '至少6个字符')
});

const { values, errors, handleSubmit, defineField } = useForm({
  validationSchema: schema
});

const [username, usernameAttrs] = defineField('username');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <input v-model="username" v-bind="usernameAttrs" placeholder="用户名" />
      <span v-if="errors.username">{{ errors.username }}</span>
    </div>

    <div>
      <input v-model="email" v-bind="emailAttrs" placeholder="邮箱" />
      <span v-if="errors.email">{{ errors.email }}</span>
    </div>

    <div>
      <input 
        type="password" 
        v-model="password" 
        v-bind="passwordAttrs" 
        placeholder="密码" 
      />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>

    <button type="submit">提交</button>
  </form>
</template>
```

**安装依赖：**
```bash
npm install vee-validate yup
```

---

## 性能监控工具

### 1. Chrome DevTools Performance 面板

```
使用步骤：
1. 打开 DevTools (F12)
2. 切换到 Performance 面板
3. 点击录制按钮
4. 执行操作
5. 停止录制
6. 分析结果
```

**关键指标：**
- FPS（帧率）
- CPU 使用率
- 网络请求
- 布局强制同步
- 长任务

### 2. Lighthouse

```bash
# CLI 使用
npm install -g lighthouse
lighthouse https://example.com --view

# 或在 Chrome DevTools 中使用
```

**评分维度：**
- Performance（性能）
- Accessibility（无障碍）
- Best Practices（最佳实践）
- SEO（搜索引擎优化）
- PWA（渐进式 Web 应用）

### 3. React DevTools Profiler

```tsx
// 在 React DevTools 中启用 Profiler
// 可以查看：
// - 组件渲染次数
// - 渲染耗时
// - 为什么渲染（props/state 变化）
```

### 4. Vue DevTools

```
功能：
- 组件树检查
- Vuex/Pinia 状态调试
- 性能追踪
- 事件追踪
```

### 5. Web Vitals

```javascript
// 安装
npm install web-vitals

// 使用
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## 最佳实践清单

### React 优化清单

- [ ] 使用 `React.memo` 包裹纯组件
- [ ] 使用 `useMemo` 缓存计算结果
- [ ] 使用 `useCallback` 缓存函数
- [ ] 代码分割和懒加载
- [ ] 虚拟列表处理大数据
- [ ] 避免内联对象和函数
- [ ] 拆分 Context 或使用 useMemo
- [ ] 使用 Profiler 检测性能瓶颈
- [ ] 图片懒加载和优化
- [ ] 使用 React Hook Form 优化表单

### Vue 优化清单

- [ ] 使用 `v-once` 标记静态内容
- [ ] 合理使用 `v-show` vs `v-if`
- [ ] 使用 `computed` 缓存计算
- [ ] 异步组件懒加载
- [ ] 虚拟滚动优化长列表
- [ ] 使用 `keep-alive` 缓存组件
- [ ] 正确使用 `key`
- [ ] 防抖和节流高频事件
- [ ] 使用 `shallowRef` 优化大型对象
- [ ] 避免在 `v-for` 中使用 `v-if`

### 通用优化清单

- [ ] 图片使用 WebP/AVIF 格式
- [ ] 实现图片懒加载
- [ ] 代码分割和 Tree Shaking
- [ ] 启用 HTTP 缓存
- [ ] 使用 CDN 加速
- [ ] 压缩资源（Gzip/Brotli）
- [ ] 最小化主线程工作
- [ ] 使用 Web Workers 处理耗时任务
- [ ] 监控 Core Web Vitals
- [ ] 定期性能审计

### 性能目标

```
理想指标：
✅ LCP < 2.5s
✅ FID < 100ms
✅ CLS < 0.1
✅ TTI (Time to Interactive) < 3.8s
✅ TBT (Total Blocking Time) < 200ms
✅ 包体积 < 200KB (gzip)
✅ 首屏渲染 < 2s
```

---

## 总结

### 🎯 核心要点回顾

#### React 优化重点
1. **手动优化**：需要主动使用 memo、useMemo、useCallback
2. **不可变性**：保持数据不可变，便于 diff 算法
3. **组件设计**：小组件、单一职责
4. **状态管理**：合理拆分状态，避免全局状态滥用

#### Vue 优化重点
1. **自动优化**：响应式系统自动追踪依赖
2. **模板优化**：利用编译时优化
3. **指令使用**：正确使用 v-if、v-show、v-for
4. **组合式 API**：更好的逻辑复用和组织

#### 通用原则
1. **测量优先**：先测量再优化
2. **渐进优化**：从小处着手，逐步改进
3. **用户体验**：以用户感知为准
4. **持续监控**：建立性能监控体系

### 📊 框架选择建议

```
选择 React 如果：
- 需要更大的生态系统
- 团队熟悉函数式编程
- 需要跨平台（React Native）
- 喜欢手动控制优化

选择 Vue 如果：
- 追求开发效率
- 团队规模较小
- 喜欢简洁的语法
- 希望自动优化
```

### 🚀 下一步学习

1. **深入学习框架原理**
   - React Fiber 架构
   - Vue 响应式原理
   - 虚拟 DOM diff 算法

2. **掌握高级优化技术**
   - Server Components（React）
   - Suspense for Data Fetching
   - Micro-frontends（微前端）

3. **学习性能监控**
   - RUM（Real User Monitoring）
   - APM（Application Performance Monitoring）
   - 自定义性能指标

4. **研究新兴技术**
   - Qwik（可恢复性应用）
   - Astro（岛屿架构）
   - SolidJS（细粒度响应式）

### 📚 推荐资源

- [React 官方文档 - Optimization](https://react.dev/reference/react)
- [Vue 官方文档 - Performance](https://vuejs.org/guide/best-practices/performance.html)
- [Web.dev - Performance](https://web.dev/performance/)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)

---

希望这份指南能帮助你构建高性能的 Vue 和 React 应用！🎉

**记住：性能优化是一个持续的过程，而不是一次性的任务。**

**最佳的性能优化策略是：**
1. 测量当前性能
2. 识别瓶颈
3. 针对性优化
4. 再次测量验证
5. 重复这个过程
