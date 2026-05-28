# Redux Toolkit (RTK) 快速上手指南

## 📖 目录

1. [简介](#简介)
2. [为什么选择 Redux Toolkit？](#为什么选择-redux-toolkit)
3. [核心概念](#核心概念)
4. [快速开始](#快速开始)
5. [核心 API 详解](#核心-api-详解)
6. [实战案例](#实战案例)
7. [最佳实践](#最佳实践)
8. [常见陷阱](#常见陷阱)
9. [性能优化](#性能优化)
10. [迁移指南](#迁移指南)

---

## 简介

**Redux Toolkit (RTK)** 是 Redux 官方推荐的现代 Redux 开发工具集，它封装了 Redux 的最佳实践，简化了样板代码，让状态管理变得更加简单和高效。

### Redux 演进历程

```
Redux (2015) 
  ↓ 大量样板代码，配置复杂
Redux + Redux Thunk 
  ↓ 异步处理仍需手动配置
Redux Toolkit (2019) 
  ↓ ✅ 开箱即用，简化开发
```

### 核心优势

- ✅ **减少样板代码**：`createSlice` 自动生成 action creators 和 reducers
- ✅ **内置不可变性**：使用 Immer 库，允许"可变"写法
- ✅ **简化配置**：`configureStore` 自动设置中间件和 DevTools
- ✅ **类型安全**：完善的 TypeScript 支持
- ✅ **官方推荐**：Redux 团队维护，最佳实践集成

---

## 为什么选择 Redux Toolkit？

### 传统 Redux vs Redux Toolkit 对比

#### ❌ 传统 Redux（繁琐）

```typescript
// 1. 定义 Action Types
const INCREMENT = 'counter/increment';
const DECREMENT = 'counter/decrement';

// 2. 创建 Action Creators
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

// 3. 编写 Reducer
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
};

// 4. 配置 Store
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(
  counterReducer,
  applyMiddleware(thunk)
);
```

#### ✅ Redux Toolkit（简洁）

```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit';

// 1. 创建 Slice（自动包含 actions 和 reducer）
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1,
  },
});

export const { increment, decrement } = counterSlice.actions;

// 2. 配置 Store（自动包含 thunk 和 DevTools）
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
```

**代码量减少 70%+！** 🎉

---

## 核心概念

### 1. Store（存储）

应用的全局状态树，单一数据源。

```typescript
const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});
```

### 2. Slice（切片）

包含 reducer 逻辑和 action creators 的集合，是 RTK 的核心创新。

```typescript
const usersSlice = createSlice({
  name: 'users',           // slice 名称
  initialState: [],        // 初始状态
  reducers: {              // reducer 函数
    addUser: (state, action) => {
      state.push(action.payload);
    },
  },
});
```

### 3. Action（动作）

描述"发生了什么"的对象。

```typescript
{
  type: 'users/addUser',
  payload: { id: 1, name: '张三' }
}
```

### 4. Reducer（归约器）

纯函数，根据当前状态和 action 计算新状态。

```typescript
(state, action) => newState
```

### 5. Selector（选择器）

从 store 中提取特定数据的函数。

```typescript
const selectUsers = (state) => state.users;
```

### 数据流图

```
┌─────────────┐
│   Component │
└──────┬──────┘
       │ dispatch(action)
       ▼
┌─────────────┐
│   Action    │ ──→ { type: 'users/addUser', payload: {...} }
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Reducer    │ ──→ 纯函数，返回新状态
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Store     │ ──→ 更新状态树
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Component │ ──→ 重新渲染（通过 useSelector）
└─────────────┘
```

---

## 快速开始

### 步骤 1：安装依赖

```bash
npm install @reduxjs/toolkit react-redux
```

### 步骤 2：创建 Store

`src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './modules/counter';
import userReducer from './modules/user';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});

// 导出类型（用于 TypeScript）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

### 步骤 3：提供 Store 给 React

`src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 步骤 4：创建 Slice

`src/store/modules/counter.ts`:

```typescript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### 步骤 5：在组件中使用

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../store/modules/counter';

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>计数：{count}</h1>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

---

## 核心 API 详解

### 1. configureStore

简化 store 配置，自动添加常用中间件。

```typescript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 禁用序列化检查（谨慎使用）
    }),
  devTools: process.env.NODE_ENV !== 'production', // 生产环境禁用 DevTools
});
```

**自动包含的中间件：**
- `redux-thunk`：处理异步 action
- `immutable-state-invariant`：检测状态突变（开发环境）
- `serializable-state-invariant`：检测不可序列化值（开发环境）

### 2. createSlice

创建 slice 的核心 API，自动生成 action creators。

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // 无 payload
    resetUsers: (state) => {
      state.list = [];
      state.error = null;
    },
    
    // 带 payload
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    
    // 修改特定用户
    updateUser: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const user = state.list.find(u => u.id === action.payload.id);
      if (user) {
        user.name = action.payload.name;
      }
    },
    
    // 删除用户
    removeUser: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    },
  },
});

export const { resetUsers, addUser, updateUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;
```

### 3. createAsyncThunk

处理异步逻辑（API 请求等）。

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// 定义异步 thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',  // action type
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || '获取用户失败');
    }
  }
);

// 创建 slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // 同步 reducers
  },
  extraReducers: (builder) => {
    builder
      // pending 状态
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fulfilled 状态
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      // rejected 状态
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
```

**生命周期状态：**
- `pending`：请求进行中
- `fulfilled`：请求成功
- `rejected`：请求失败

### 4. createSelector

记忆化选择器，优化性能。

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// 基础选择器
const selectUsers = (state: RootState) => state.users.list;

// 记忆化选择器：只在输入变化时重新计算
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(user => user.isActive)
);

export const selectUsersCount = createSelector(
  [selectUsers],
  (users) => users.length
);

// 组合选择器
export const selectActiveUsersCount = createSelector(
  [selectActiveUsers],
  (activeUsers) => activeUsers.length
);
```

**优势：**
- ✅ 缓存结果，避免重复计算
- ✅ 仅在依赖变化时重新计算
- ✅ 提升大型应用的渲染性能

### 5. createEntityAdapter

管理规范化数据（CRUD 操作）。

```typescript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

// 定义实体
interface User {
  id: string;
  name: string;
  email: string;
}

// 创建 adapter
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// 初始状态
const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

// 创建 slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: usersAdapter.addOne,
    addManyUsers: usersAdapter.addMany,
    updateUser: usersAdapter.updateOne,
    updateManyUsers: usersAdapter.updateMany,
    removeUser: usersAdapter.removeOne,
    removeManyUsers: usersAdapter.removeMany,
    removeAllUsers: usersAdapter.removeAll,
  },
});

export const {
  addUser,
  addManyUsers,
  updateUser,
  updateManyUsers,
  removeUser,
  removeManyUsers,
  removeAllUsers,
} = usersSlice.actions;

// 内置选择器
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectTotal: selectTotalUsers,
} = usersAdapter.getSelectors((state: RootState) => state.users);

export default usersSlice.reducer;
```

**使用示例：**

```tsx
function UserList() {
  const users = useSelector(selectAllUsers);
  const total = useSelector(selectTotalUsers);
  
  return (
    <div>
      <h2>用户总数：{total}</h2>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 实战案例

### 案例 1：Todo 应用（完整示例）

#### 1. 创建 Todo Slice

`src/store/modules/todo.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
  items: [],
  filter: 'all',
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: new Date(),
      };
      state.items.push(newTodo);
    },
    
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.items.find(item => item.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
      }
    },
    
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
    },
    
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompleted,
  setFilter,
} = todoSlice.actions;

// 选择器
export const selectTodos = (state: RootState) => state.todo.items;
export const selectFilter = (state: RootState) => state.todo.filter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export default todoSlice.reducer;
```

#### 2. Todo 组件

```tsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  setFilter,
  selectFilteredTodos,
  selectFilter,
} from '../store/modules/todo';

function TodoApp() {
  const [inputValue, setInputValue] = useState('');
  const todos = useSelector(selectFilteredTodos);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue));
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
            onClick={() => dispatch(setFilter(f))}
            className={`px-4 py-2 rounded ${
              filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {f === 'all' ? '全部' : f === 'active' ? '未完成' : '已完成'}
          </button>
        ))}
        <button
          onClick={() => dispatch(clearCompleted())}
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
              onChange={() => dispatch(toggleTodo(todo.id))}
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
              onClick={() => dispatch(deleteTodo(todo.id))}
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
```

### 案例 2：用户管理（含异步请求）

`src/store/modules/user.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  list: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  currentUser: null,
  loading: false,
  error: null,
};

// 异步 thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get('/api/users');
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>) => {
    const response = await axios.post('/api/users', userData);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }: Partial<User> & { id: number }) => {
    const response = await axios.put(`/api/users/${id}`, userData);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    await axios.delete(`/api/users/${id}`);
    return id;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户列表
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户失败';
      })
      
      // 创建用户
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      
      // 更新用户
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      
      // 删除用户
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user.id !== action.payload);
      });
  },
});

export const { setCurrentUser, clearError } = userSlice.actions;

// 选择器
export const selectUsers = (state: RootState) => state.users.list;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;

export default userSlice.reducer;
```

**使用示例：**

```tsx
function UserManagement() {
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误：{error}</div>;

  return (
    <div>
      <h2>用户列表</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => dispatch(deleteUser(user.id))}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 案例 3：购物车系统（复杂状态）

`src/store/modules/cart.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  discount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.discount = 0;
    },
    
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
} = cartSlice.actions;

// 派生状态选择器
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal;
  }
);

export const selectCartFinalTotal = createSelector(
  [selectCartTotal, (state: RootState) => state.cart.discount],
  (subtotal, discount) => {
    return subtotal * (1 - discount / 100);
  }
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export default cartSlice.reducer;
```

---

## 最佳实践

### 1. 状态结构设计

```typescript
// ✅ 好的设计：扁平化、规范化
{
  users: {
    entities: {
      '1': { id: 1, name: '张三' },
      '2': { id: 2, name: '李四' },
    },
    allIds: ['1', '2']
  },
  posts: {
    entities: {
      '101': { id: 101, title: '文章1', authorId: 1 },
      '102': { id: 102, title: '文章2', authorId: 2 },
    },
    allIds: ['101', '102']
  }
}

// ❌ 不好的设计：嵌套过深
{
  users: [
    {
      id: 1,
      name: '张三',
      posts: [
        { id: 101, title: '文章1' },
        { id: 102, title: '文章2' }
      ]
    }
  ]
}
```

### 2. Slice 组织方式

```typescript
// ✅ 推荐：按功能模块划分
src/store/
├── index.ts              # store 配置
├── modules/
│   ├── user.ts           # 用户模块
│   ├── product.ts        # 商品模块
│   ├── order.ts          # 订单模块
│   └── cart.ts           # 购物车模块

// ❌ 不推荐：所有状态放在一个文件中
src/store/
└── store.ts              # 包含所有 reducers
```

### 3. 不可变性处理

```typescript
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'example',
  initialState: { items: [] },
  reducers: {
    // ✅ RTK 使用 Immer，可以直接"修改"状态
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    
    // ✅ 也可以返回新状态
    replaceItems: (state, action) => {
      return { ...state, items: action.payload };
    },
    
    // ❌ 不要直接赋值（虽然 Immer 会保护，但语义不清）
    badExample: (state, action) => {
      state = action.payload; // 这样不会生效
    },
  },
});
```

### 4. TypeScript 类型定义

```typescript
// ✅ 完整的类型定义
interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
  },
});

// ✅ 在组件中使用类型
const users = useSelector((state: RootState) => state.users.list);
const dispatch = useDispatch<AppDispatch>();
```

### 5. 异步请求错误处理

```typescript
export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/data');
      return response.data;
    } catch (error: any) {
      // 提供有意义的错误信息
      return rejectWithValue(
        error.response?.data?.message || '请求失败，请稍后重试'
      );
    }
  }
);

// 在组件中处理错误
const error = useSelector(selectDataError);
if (error) {
  return <ErrorMessage message={error} onRetry={() => dispatch(fetchData())} />;
}
```

### 6. 选择器优化

```typescript
// ✅ 使用 createSelector 避免重复计算
const selectExpensiveData = createSelector(
  [selectRawData],
  (rawData) => {
    console.log('计算密集型操作');
    return rawData.map(item => heavyComputation(item));
  }
);

// ❌ 每次渲染都重新计算
const BadComponent = () => {
  const data = useSelector(selectRawData);
  const processed = data.map(item => heavyComputation(item)); // 每次都执行
  return <div>{processed}</div>;
};
```

### 7. 持久化存储

```bash
npm install redux-persist
```

```typescript
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'user'], // 只持久化这些模块
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
```

---

## 常见陷阱

### 1. 直接修改状态（不使用 Immer）

```typescript
// ❌ 错误：在传统 Redux 中直接修改
const reducer = (state = initialState, action) => {
  state.items.push(action.payload); // 突变！
  return state;
};

// ✅ 正确：使用 RTK 的 Immer
const slice = createSlice({
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload); // Immer 会自动处理
    },
  },
});
```

### 2. 在 Selector 中创建新对象

```typescript
// ❌ 错误：每次都会返回新引用，导致组件重复渲染
const selectUserData = (state) => ({
  name: state.user.name,
  age: state.user.age,
});

// ✅ 正确：使用 createSelector
const selectUserData = createSelector(
  [(state) => state.user.name, (state) => state.user.age],
  (name, age) => ({ name, age })
);
```

### 3. 忘记处理异步状态

```typescript
// ❌ 不完整：缺少 loading 和 error 状态
const slice = createSlice({
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

// ✅ 完整：包含所有状态
const slice = createSlice({
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: { /* ... */ },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### 4. 过度使用全局状态

```typescript
// ❌ 不需要放入 Redux
- 表单输入状态（使用 local state）
- UI 开关状态（使用 local state）
- 临时数据（使用 local state）

// ✅ 应该放入 Redux
- 用户认证信息
- 购物车数据
- 跨组件共享的数据
- 需要持久化的数据
```

### 5. Dispatch 在依赖数组中缺失

```tsx
// ❌ 可能导致 stale closure
useEffect(() => {
  dispatch(fetchData());
}, []); // 缺少 dispatch

// ✅ 正确
useEffect(() => {
  dispatch(fetchData());
}, [dispatch]);

// ✅ 或使用 useCallback
const fetchDataCallback = useCallback(() => {
  dispatch(fetchData());
}, [dispatch]);
```

---

## 性能优化

### 1. 使用 React.memo 避免不必要的重渲染

```tsx
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </li>
  );
});
```

### 2. 细粒度选择器

```tsx
// ❌ 订阅整个 state，任何变化都会重渲染
const Component = () => {
  const state = useSelector((state) => state);
  return <div>{state.users.list[0].name}</div>;
};

// ✅ 只订阅需要的数据
const Component = () => {
  const userName = useSelector((state) => state.users.list[0]?.name);
  return <div>{userName}</div>;
};
```

### 3. 批量更新

```typescript
// ✅ RTK 自动批处理多个 dispatch
dispatch(() => {
  dispatch(addItem(item1));
  dispatch(addItem(item2));
  dispatch(addItem(item3));
});

// 或使用 batch
import { batch } from 'react-redux';
batch(() => {
  dispatch(action1());
  dispatch(action2());
});
```

### 4. 懒加载 Slice

```typescript
// 动态注入 reducer（代码分割）
store.injectReducer('lazyModule', lazyReducer);

// 使用 redux-injectors 或自定义实现
```

### 5. 监控性能

```typescript
// 启用 Redux DevTools 性能监控
const store = configureStore({
  reducer,
  devTools: {
    actionSanitizer: undefined,
    stateSanitizer: undefined,
  },
});
```

---

## 迁移指南

### 从传统 Redux 迁移到 RTK

#### 1. 替换 createStore

```typescript
// 旧代码
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
);

// 新代码
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
});
```

#### 2. 替换 combineReducers + 手写 reducers

```typescript
// 旧代码
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
};

// 新代码
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
  },
});
```

#### 3. 替换手写 Action Creators

```typescript
// 旧代码
export const increment = () => ({ type: 'INCREMENT' });
export const addTodo = (text) => ({ type: 'ADD_TODO', payload: text });

// 新代码
export const { increment, addTodo } = slice.actions;
```

#### 4. 替换 Redux Thunk

```typescript
// 旧代码
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: 'FETCH_USERS_REQUEST' });
  try {
    const response = await api.getUsers();
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_USERS_FAILURE', error: error.message });
  }
};

// 新代码
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await api.getUsers();
    return response.data;
  }
);
```

---

## 总结

### ✅ Redux Toolkit 核心优势回顾

1. **简化配置**：`configureStore` 一键 setup
2. **减少样板**：`createSlice` 自动生成 actions 和 reducers
3. **简化异步**：`createAsyncThunk` 优雅处理副作用
4. **不可变性**：Immer 让"可变"写法成为可能
5. **类型安全**：完善的 TypeScript 支持
6. **性能优化**：`createSelector` 记忆化选择器
7. **官方推荐**：Redux 团队维护的最佳实践

### 🎯 适用场景

- ✅ 中大型应用，状态复杂
- ✅ 多组件共享状态
- ✅ 需要时间旅行调试
- ✅ 需要状态持久化
- ✅ 团队协作，需要统一的状态管理模式

### ⚠️ 不适用场景

- ❌ 小型应用，状态简单
- ❌ 仅局部组件间通信（考虑 Context API）
- ❌ 表单状态管理（考虑 React Hook Form）
- ❌ 服务端状态（考虑 React Query、SWR）

### 📚 学习资源

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [Redux Essentials Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
- [Immer 文档](https://immerjs.github.io/immer/)

### 🚀 下一步

1. 学习 Redux Saga 或 Redux Observable（复杂异步流程）
2. 探索 RTK Query（数据 fetching 和缓存）
3. 研究状态持久化方案（redux-persist）
4. 实践大规模应用的状态架构设计

希望这份指南能帮助你快速掌握 Redux Toolkit！🎉

---

**完整代码示例：**

```bash
# 克隆示例项目
git clone https://github.com/reduxjs/redux-toolkit.git
cd redux-toolkit/examples/publish-ci/cra5
npm install
npm start
```

**快速测试：**

```typescript
// 5 分钟创建一个完整的 Redux store
import { createSlice, configureStore } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'test',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value++ },
  },
});

const store = configureStore({
  reducer: { test: slice.reducer },
});

store.dispatch(slice.actions.increment());
console.log(store.getState()); // { test: { value: 1 } }
```

就这么简单！✨
