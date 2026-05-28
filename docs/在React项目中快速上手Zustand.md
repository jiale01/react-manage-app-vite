# 在 React 项目中快速上手 Zustand

## 📖 目录

1. [简介](#简介)
2. [为什么选择 Zustand？](#为什么选择-zustand)
3. [核心概念](#核心概念)
4. [快速开始](#快速开始)
5. [基础用法详解](#基础用法详解)
6. [高级特性](#高级特性)
7. [实战案例](#实战案例)
8. [性能优化](#性能优化)
9. [与 Redux 对比](#与-redux-对比)
10. [最佳实践](#最佳实践)

---

## 简介

**Zustand** 是一个轻量级、简单且灵活的 React 状态管理库。它的名字来源于德语，意为"状态"。Zustand 以极简的 API 设计和出色的开发体验著称，让你能够用最少的代码实现强大的状态管理功能。

### 核心理念

```
简单 > 复杂
灵活 > 僵化
轻量 > 臃肿
```

### 知名项目采用

- **Vercel** - Next.js 官方推荐
- **React Three Fiber** - 3D 渲染库
- **Tldraw** - 在线绘图工具
- **Leva** - GUI 控制面板

### 你将学到什么？

- ✅ Zustand 的核心概念和设计理念
- ✅ 创建和管理 Store
- ✅ 状态选择和更新
- ✅ 中间件使用（持久化、日志等）
- ✅ 完整的实战案例
- ✅ 性能优化技巧
- ✅ 与 Redux 的对比分析

---

## 为什么选择 Zustand？

### 优势对比

#### ✅ 极简的 API

```javascript
// Zustand - 只需几行代码
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// Redux - 需要大量样板代码
// action types, action creators, reducers, store configuration...
```

#### ✅ 零依赖

```
包体积对比：
- Zustand: ~1KB (gzip)
- Redux + Redux Toolkit: ~12KB (gzip)
- MobX: ~16KB (gzip)
```

#### ✅ 无需 Provider

```jsx
// ❌ Redux 需要包裹 Provider
<Provider store={store}>
  <App />
</Provider>

// ✅ Zustand 直接使用 Hook
function Component() {
  const count = useStore(state => state.count);
  return <div>{count}</div>;
}
```

#### ✅ TypeScript 友好

```typescript
// 完整的类型推断，无需额外配置
interface State {
  count: number;
  increment: () => void;
}

const useStore = create<State>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));
```

#### ✅ 灵活的更新策略

```javascript
// 选择性订阅，避免不必要的重渲染
const count = useStore(state => state.count); // 只订阅 count

// 而不是整个 state
const state = useStore(); // ❌ 任何变化都会重渲染
```

### 劣势

#### ❌ 生态系统较小

```
Redux 生态：
- Redux DevTools
- redux-saga / redux-thunk
- reselect
- redux-persist
- 大量中间件和工具

Zustand 生态：
- 内置持久化中间件
- 社区中间件较少
- 但足够满足大多数需求
```

#### ❌ 调试工具有限

```
Redux DevTools 功能丰富：
- 时间旅行调试
- Action 历史
- State 快照

Zustand：
- 可通过中间件集成 DevTools
- 功能相对简单
```

### 适用场景

```
✅ 适合 Zustand：
- 中小型应用
- 快速原型开发
- 简单的状态管理需求
- 追求简洁代码的团队
- React Native 项目

❌ 考虑 Redux：
- 大型企业级应用
- 复杂的异步流程
- 需要强大的调试工具
- 团队已熟悉 Redux
- 需要成熟的生态系统
```

---

## 核心概念

### 1. Store（存储）

Store 是状态的容器，包含状态数据和更新方法。

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  // 状态数据
  count: 0,
  name: 'Zustand',
  
  // 更新方法
  increment: () => set((state) => ({ count: state.count + 1 })),
  setName: (name) => set({ name })
}));
```

### 2. Set 函数

`set` 用于更新状态，支持部分更新和函数式更新。

```javascript
// 直接设置
set({ count: 10 });

// 基于前一个状态
set((state) => ({ count: state.count + 1 }));

// 替换整个状态
set({ count: 0, name: 'New' }, true); // replace 参数
```

### 3. Get 函数

`get` 用于在 action 中读取当前状态。

```javascript
const useStore = create((set, get) => ({
  count: 0,
  increment: () => {
    const currentCount = get().count; // 读取当前状态
    set({ count: currentCount + 1 });
  }
}));
```

### 4. Hook

Zustand 返回一个自定义 Hook，用于在组件中访问状态。

```javascript
// 在组件中使用
function Counter() {
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}
```

### 数据流图

```
┌─────────────┐
│   Component │ ──→ 使用 Hook 订阅状态
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Zustand   │ ──→ Store 管理状态
│   Store     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Actions   │ ──→ 调用 set 更新状态
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Component │ ──→ 自动重渲染
└─────────────┘
```

---

## 快速开始

### 步骤 1：安装 Zustand

```bash
npm install zustand
```

### 步骤 2：创建 Store

`src/store/counter.js`:

```javascript
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

export default useCounterStore;
```

### 步骤 3：在组件中使用

`src/components/Counter.jsx`:

```jsx
import useCounterStore from '../store/counter';

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;
```

### 步骤 4：运行应用

```bash
npm start
```

就这么简单！✨

---

## 基础用法详解

### 1. 基本状态管理

```javascript
import { create } from 'zustand';

// 创建 Store
const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  
  // 登录
  login: (userData) => set({ 
    user: userData, 
    isLoggedIn: true 
  }),
  
  // 登出
  logout: () => set({ 
    user: null, 
    isLoggedIn: false 
  }),
  
  // 更新用户信息
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  }))
}));

// 在组件中使用
function UserProfile() {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const logout = useUserStore((state) => state.logout);
  
  if (!isLoggedIn) {
    return <div>请先登录</div>;
  }
  
  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. 异步操作

```javascript
import { create } from 'zustand';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  
  // 获取产品列表
  fetchProducts: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // 添加产品
  addProduct: async (product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const newProduct = await response.json();
      
      // 使用 get() 获取当前状态
      const currentProducts = get().products;
      set({ products: [...currentProducts, newProduct] });
      
      return newProduct;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // 删除产品
  deleteProduct: async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

// 在组件中使用
function ProductList() {
  const { products, loading, error, fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### 3. 计算属性

```javascript
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  
  // 添加商品
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  // 移除商品
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
  
  // 计算属性：商品总数
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  // 计算属性：总价
  get totalPrice() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}));

// 在组件中使用
function CartSummary() {
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  
  return (
    <div>
      <p>商品总数: {totalItems}</p>
      <p>总价: ¥{totalPrice.toFixed(2)}</p>
    </div>
  );
}
```

### 4. 多个 Store

```javascript
// store/user.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

// store/theme.js
export const useThemeStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  }))
}));

// store/cart.js
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}));

// 在组件中使用多个 Store
function App() {
  const user = useUserStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const cartItems = useCartStore((state) => state.items);
  
  return (
    <div className={theme}>
      <header>
        <span>{user?.name || 'Guest'}</span>
        <span>Cart: {cartItems.length}</span>
      </header>
      {/* ... */}
    </div>
  );
}
```

### 5. TypeScript 支持

```typescript
import { create } from 'zustand';

// 定义状态类型
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 创建类型安全的 Store
const useUserStore = create<UserState>()((set) => ({
  user: null,
  users: [],
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

// 使用时有完整的类型提示
function UserProfile() {
  const user = useUserStore((state) => state.user); // User | null
  const loading = useUserStore((state) => state.loading); // boolean
  
  // TypeScript 会提供智能提示和类型检查
  return <div>{user?.name}</div>;
}
```

---

## 高级特性

### 1. 中间件（Middleware）

#### persist - 持久化

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      notifications: true,
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({
        notifications: !state.notifications
      }))
    }),
    {
      name: 'settings-storage', // localStorage 中的 key
      storage: createJSONStorage(() => localStorage), // 存储引擎
      partialize: (state) => ({ 
        theme: state.theme,
        language: state.language 
      }), // 只持久化部分状态
      onRehydrateStorage: () => (state) => {
        console.log('hydration starts', state);
      }
    }
  )
);
```

#### devtools - Redux DevTools 集成

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 }))
    }),
    {
      name: 'CounterStore', // DevTools 中显示的名称
      enabled: process.env.NODE_ENV === 'development' // 仅开发环境启用
    }
  )
);
```

#### combine - 合并初始状态

```javascript
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useStore = create(
  combine(
    { count: 0, name: 'test' }, // 初始状态
    (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name })
    })
  )
);
```

#### 组合多个中间件

```javascript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 }))
      }),
      {
        name: 'counter-storage'
      }
    ),
    {
      name: 'CounterStore'
    }
  )
);
```

### 2. 浅比较（Shallow Comparison）

```javascript
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  settings: { theme: 'light', lang: 'en' }
}));

function Component() {
  // ❌ 每次对象引用变化都会重渲染
  const user = useStore((state) => state.user);
  
  // ✅ 使用浅比较，只有属性值变化才重渲染
  const { name, age } = useStore(
    (state) => state.user,
    shallow
  );
  
  return <div>{name} - {age}</div>;
}
```

### 3. 订阅外部 Store

```javascript
import { create } from 'zustand';

// 创建外部 Store
const externalStore = {
  getState: () => ({ value: 0 }),
  setState: (newState) => {
    externalStore.state = newState;
    listeners.forEach(listener => listener());
  },
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

let listeners = new Set();

// 在 Zustand 中使用
const useStore = create((set) => {
  externalStore.subscribe(() => {
    set({ externalValue: externalStore.getState().value });
  });
  
  return {
    externalValue: externalStore.getState().value
  };
});
```

### 4. 动态创建 Store

```javascript
import { createStore } from 'zustand';

// 动态创建 Store 实例
function createTodoStore(initialTodos = []) {
  return createStore((set) => ({
    todos: initialTodos,
    addTodo: (text) => set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, completed: false }]
    })),
    toggleTodo: (id) => set((state) => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }));
}

// 在组件中使用
function TodoApp() {
  const [store] = useState(() => createTodoStore());
  const todos = useStore(store, (state) => state.todos);
  const addTodo = useStore(store, (state) => state.addTodo);
  
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### 5. Immer 集成

```bash
npm install immer
```

```javascript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
  users: Array<{ id: number; name: string }>;
  addUser: (name: string) => void;
  updateUser: (id: number, name: string) => void;
  removeUser: (id: number) => void;
}

const useStore = create<State>()(
  immer((set) => ({
    users: [],
    
    // 可以直接"修改"状态（Immer 会自动处理不可变性）
    addUser: (name) => set((state) => {
      state.users.push({ id: Date.now(), name });
    }),
    
    updateUser: (id, name) => set((state) => {
      const user = state.users.find(u => u.id === id);
      if (user) {
        user.name = name;
      }
    }),
    
    removeUser: (id) => set((state) => {
      state.users = state.users.filter(u => u.id !== id);
    })
  }))
);
```

---

## 实战案例

### 案例 1：待办事项应用（Todo App）

#### Store 定义

```typescript
// store/todo.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  getFilteredTodos: () => Todo[];
}

const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      
      addTodo: (text) => set((state) => ({
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date()
          }
        ]
      })),
      
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      })),
      
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })),
      
      editTodo: (id, text) => set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, text } : todo
        )
      })),
      
      clearCompleted: () => set((state) => ({
        todos: state.todos.filter(todo => !todo.completed)
      })),
      
      setFilter: (filter) => set({ filter }),
      
      getFilteredTodos: () => {
        const { todos, filter } = get();
        
        switch (filter) {
          case 'active':
            return todos.filter(todo => !todo.completed);
          case 'completed':
            return todos.filter(todo => todo.completed);
          default:
            return todos;
        }
      }
    }),
    {
      name: 'todo-storage'
    }
  )
);

export default useTodoStore;
```

#### 组件实现

```tsx
// components/TodoApp.tsx
import { useState } from 'react';
import useTodoStore from '../store/todo';

function TodoApp() {
  const [inputValue, setInputValue] = useState('');
  
  const todos = useTodoStore((state) => state.getFilteredTodos());
  const filter = useTodoStore((state) => state.filter);
  const addTodo = useTodoStore((state) => state.addTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const setFilter = useTodoStore((state) => state.setFilter);

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      
      {/* 输入框 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="添加新任务..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleAddTodo}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          添加
        </button>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {f === 'all' ? '全部' : f === 'active' ? '未完成' : '已完成'}
          </button>
        ))}
        <button
          onClick={clearCompleted}
          className="ml-auto px-4 py-2 text-red-500 hover:text-red-700"
        >
          清除已完成
        </button>
      </div>

      {/* Todo 列表 */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5"
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-8">暂无任务</p>
      )}
    </div>
  );
}

export default TodoApp;
```

### 案例 2：购物车系统

```typescript
// store/cart.ts
import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  getTotalPrice: () => number;
  getFinalPrice: () => number;
  getItemCount: () => number;
}

const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  couponCode: null,
  discount: 0,
  
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    
    return {
      items: [...state.items, { ...product, quantity: 1 }]
    };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),
  
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
  })),
  
  clearCart: () => set({ items: [], couponCode: null, discount: 0 }),
  
  applyCoupon: (code, discount) => set({ couponCode: code, discount }),
  
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  
  getFinalPrice: () => {
    const { getTotalPrice, discount } = get();
    const subtotal = getTotalPrice();
    return subtotal * (1 - discount / 100);
  },
  
  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}));

export default useCartStore;
```

```tsx
// components/Cart.tsx
import useCartStore from '../store/cart';

function Cart() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getFinalPrice = useCartStore((state) => state.getFinalPrice);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getTotalPrice();
  const finalTotal = getFinalPrice();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return <div className="text-center py-8">购物车为空</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">购物车 ({itemCount})</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">¥{item.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span className="w-12 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              删除
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between mb-2">
          <span>小计:</span>
          <span>¥{subtotal.toFixed(2)}</span>
        </div>
        
        {couponCode && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>优惠 ({couponCode}):</span>
            <span>-{((subtotal - finalTotal) / subtotal * 100).toFixed(0)}%</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
          <span>总计:</span>
          <span>¥{finalTotal.toFixed(2)}</span>
        </div>
        
        <button
          onClick={clearCart}
          className="mt-4 w-full py-2 text-red-500 hover:text-red-700"
        >
          清空购物车
        </button>
      </div>
    </div>
  );
}

export default Cart;
```

### 案例 3：主题切换与国际化

```typescript
// store/app.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type Language = 'zh' | 'en';

interface AppState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh',
      sidebarOpen: true,
      
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      setLanguage: (language) => set({ language }),
      
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen
      }))
    }),
    {
      name: 'app-settings'
    }
  )
);

export default useAppStore;
```

```tsx
// components/Header.tsx
import useAppStore from '../store/app';

function Header() {
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);
  const setTheme = useAppStore((state) => state.setTheme);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <button onClick={toggleSidebar} className="p-2">
        ☰
      </button>
      
      <div className="flex items-center gap-4">
        {/* 主题切换 */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {/* 语言切换 */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="px-4 py-2 rounded border"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>
    </header>
  );
}

export default Header;
```

---

## 性能优化

### 1. 选择性订阅

```javascript
// ❌ 错误：订阅整个 state，任何变化都会重渲染
const state = useStore();

// ✅ 正确：只订阅需要的字段
const count = useStore((state) => state.count);
const name = useStore((state) => state.name);

// ✅ 更好：解构多个字段
const { count, name } = useStore((state) => ({
  count: state.count,
  name: state.name
}), shallow);
```

### 2. 使用 shallow 比较

```javascript
import { shallow } from 'zustand/shallow';

function Component() {
  // 只有 user.name 或 user.age 变化时才重渲染
  const { name, age } = useStore(
    (state) => ({
      name: state.user.name,
      age: state.user.age
    }),
    shallow
  );
  
  return <div>{name} - {age}</div>;
}
```

### 3. 拆分 Store

```javascript
// ❌ 一个大 Store，任何变化都可能影响所有组件
const useBigStore = create((set) => ({
  user: null,
  products: [],
  cart: [],
  theme: 'light',
  // ... 很多状态
}));

// ✅ 拆分为多个小 Store
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products })
}));

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({
    cart: [...state.cart, item]
  }))
}));
```

### 4. 避免在渲染中创建对象

```javascript
// ❌ 每次渲染都创建新对象
function Component() {
  const data = useStore((state) => ({
    count: state.count,
    doubled: state.count * 2
  }));
  
  return <div>{data.count}</div>;
}

// ✅ 使用 shallow 比较
function Component() {
  const { count, doubled } = useStore(
    (state) => ({
      count: state.count,
      doubled: state.count * 2
    }),
    shallow
  );
  
  return <div>{count}</div>;
}
```

### 5. 使用 selector 工厂

```javascript
// 创建可复用的 selector
const selectUser = (state) => state.user;
const selectUserName = (state) => state.user?.name;
const selectUserEmail = (state) => state.user?.email;

function UserProfile() {
  const name = useStore(selectUserName);
  const email = useStore(selectUserEmail);
  
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}
```

---

## 与 Redux 对比

### 代码量对比

#### Redux Toolkit

```typescript
// features/counter/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    }
  }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;

// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export default store;

// component.tsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './features/counter/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

#### Zustand

```typescript
// store/counter.ts
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));

export default useCounterStore;

// component.tsx
import useCounterStore from './store/counter';

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

**代码量减少约 60%！** 🎉

### 特性对比表

| 特性 | Zustand | Redux Toolkit |
|------|---------|---------------|
| **包体积** | ~1KB | ~12KB |
| **样板代码** | 极少 | 中等 |
| **学习曲线** | 平缓 | 较陡 |
| **DevTools** | 需配置 | 内置 |
| **TypeScript** | ✅ 优秀 | ✅ 优秀 |
| **中间件** | 简单 | 丰富 |
| **生态系统** | 较小 | 成熟 |
| **Provider** | 不需要 | 需要 |
| **适用规模** | 中小项目 | 大型项目 |

### 何时选择？

```
选择 Zustand 如果：
✅ 项目规模中小型
✅ 追求简洁代码
✅ 快速开发原型
✅ 团队规模小
✅ 不需要复杂调试工具

选择 Redux Toolkit 如果：
✅ 大型企业级应用
✅ 团队已熟悉 Redux
✅ 需要强大调试工具
✅ 复杂异步流程
✅ 需要成熟生态系统
```

---

## 最佳实践

### 1. Store 组织方式

```
src/
├── store/
│   ├── index.ts          # 导出所有 stores
│   ├── user.ts           # 用户相关
│   ├── product.ts        # 产品相关
│   ├── cart.ts           # 购物车
│   └── app.ts            # 全局应用状态
```

```typescript
// store/index.ts
export { default as useUserStore } from './user';
export { default as useProductStore } from './product';
export { default as useCartStore } from './cart';
export { default as useAppStore } from './app';
```

### 2. 命名规范

```typescript
// ✅ 好的命名
const useUserStore = create(...);
const useProductStore = create(...);

// ❌ 不好的命名
const store = create(...);
const myStore = create(...);
```

### 3. 动作命名

```typescript
// ✅ 清晰的动词命名
const useStore = create((set) => ({
  setUser: (user) => set({ user }),
  fetchUsers: async () => { /* ... */ },
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  }))
}));

// ❌ 模糊的命名
const useStore = create((set) => ({
  update: (data) => set(data),
  change: () => set({ /* ... */ })
}));
```

### 4. 避免状态冗余

```typescript
// ❌ 冗余状态
const useStore = create((set, get) => ({
  items: [],
  itemCount: 0, // 可以从 items.length 计算
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    itemCount: state.items.length + 1 // 手动维护
  }))
}));

// ✅ 使用 getter 计算
const useStore = create((set, get) => ({
  items: [],
  
  get itemCount() {
    return get().items.length;
  },
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}));
```

### 5. 错误处理

```typescript
const useStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchData: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      });
    }
  }
}));
```

### 6. 持久化策略

```typescript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      settings: { /* ... */ }
    }),
    {
      name: 'app-storage',
      // 只持久化必要的状态
      partialize: (state) => ({
        theme: state.theme,
        language: state.language
      }),
      // 版本迁移
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // 从 v0 迁移到 v1
          persistedState.newField = 'default';
        }
        return persistedState;
      }
    }
  )
);
```

### 7. 测试

```typescript
// store/counter.test.ts
import { describe, it, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import useCounterStore from './counter';

describe('Counter Store', () => {
  it('should increment count', () => {
    act(() => {
      useCounterStore.getState().increment();
    });
    
    expect(useCounterStore.getState().count).toBe(1);
  });
  
  it('should decrement count', () => {
    act(() => {
      useCounterStore.setState({ count: 5 });
      useCounterStore.getState().decrement();
    });
    
    expect(useCounterStore.getState().count).toBe(4);
  });
  
  it('should reset count', () => {
    act(() => {
      useCounterStore.setState({ count: 10 });
      useCounterStore.getState().reset();
    });
    
    expect(useCounterStore.getState().count).toBe(0);
  });
});
```

### 8. 清单检查

```
Zustand 开发检查清单：
✅ 使用选择性订阅避免不必要重渲染
✅ 合理使用 shallow 比较
✅ 拆分 Store 保持职责单一
✅ 添加 TypeScript 类型定义
✅ 配置持久化中间件（如需要）
✅ 集成 DevTools（开发环境）
✅ 处理异步操作的 loading 和 error 状态
✅ 编写单元测试
✅ 避免状态冗余
✅ 清晰的命名规范
```

---

## 总结

### 🎯 核心要点回顾

#### Zustand 的优势
1. **极简 API** - 几行代码即可创建 Store
2. **零依赖** - 包体积极小（~1KB）
3. **无需 Provider** - 直接使用 Hook
4. **TypeScript 友好** - 完整的类型推断
5. **灵活更新** - 支持部分更新和函数式更新
6. **中间件系统** - 持久化、DevTools 等

#### 关键技能
- ✅ 创建和管理 Store
- ✅ 选择性订阅优化性能
- ✅ 使用中间件（persist、devtools）
- ✅ 异步操作处理
- ✅ TypeScript 类型安全
- ✅ 性能优化技巧

### 📊 性能指标

```
理想标准：
✅ 包体积：< 2KB (gzip)
✅ 组件重渲染：仅在订阅状态变化时
✅ Store 创建：同步，无性能开销
✅ 内存占用：低，无多余抽象层
```

### 🚀 下一步学习

1. **深入理解原理**
   - Zustand 内部实现
   - React Context vs Zustand
   - 状态更新机制

2. **高级用法**
   - 自定义中间件
   - 服务端渲染（SSR）
   - React Native 集成

3. **生态系统**
   - zustand-utils 工具库
   - 社区中间件
   - 最佳实践模式

4. **替代方案对比**
   - Jotai（原子化状态）
   - Recoil（Facebook 出品）
   - Valtio（Proxy-based）

### 📚 推荐资源

- [Zustand 官方文档](https://docs.pmnd.rs/zustand/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Awesome Zustand](https://github.com/pmndrs/zustand#examples)
- [React State Management Comparison](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#state-management)

---

希望这份指南能帮助你快速掌握 Zustand，构建高效的 React 应用！🎉

**记住：简单就是力量。Zustand 让你在享受状态管理的同时，保持代码的简洁和优雅。**

**开始你的 Zustand 之旅吧！** 🚀
