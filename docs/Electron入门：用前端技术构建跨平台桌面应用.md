# Electron 入门：用前端技术构建跨平台桌面应用

## 📖 目录

1. [简介](#简介)
2. [什么是 Electron？](#什么是-electron)
3. [为什么选择 Electron？](#为什么选择-electron)
4. [核心概念](#核心概念)
5. [快速开始](#快速开始)
6. [主进程与渲染进程](#主进程与渲染进程)
7. [进程间通信（IPC）](#进程间通信ipc)
8. [原生功能集成](#原生功能集成)
9. [实战案例](#实战案例)
10. [性能优化](#性能优化)
11. [打包与发布](#打包与发布)
12. [最佳实践](#最佳实践)

---

## 简介

**Electron** 是一个使用 Web 技术（HTML、CSS、JavaScript）构建跨平台桌面应用的框架。它让前端开发者能够用熟悉的技术栈创建 Windows、macOS 和 Linux 平台的桌面应用程序。

### 知名 Electron 应用

- 💻 **VS Code** - 全球最流行的代码编辑器
- 💬 **Discord** - 游戏通讯平台
- 📝 **Slack** - 团队协作工具
- 🎵 **Spotify** - 音乐流媒体服务
- ✍️ **Notion** - 笔记和项目管理工具
- 🌐 **Postman** - API 测试工具

### 你将学到什么？

- ✅ Electron 架构和工作原理
- ✅ 主进程与渲染进程的概念
- ✅ 进程间通信（IPC）机制
- ✅ 集成原生功能（文件系统、通知等）
- ✅ 完整的实战项目（待办事项应用）
- ✅ 性能优化和打包发布
- ✅ 安全性和最佳实践

---

## 什么是 Electron？

### 技术架构

```
┌─────────────────────────────────────┐
│         Electron Application        │
├─────────────────────────────────────┤
│  Chromium (渲染引擎) + Node.js      │
├─────────────────────────────────────┤
│  Native OS APIs (系统原生接口)      │
└─────────────────────────────────────┘
       ↓           ↓           ↓
    Windows     macOS      Linux
```

### 核心组成

1. **Chromium** - Google 开源浏览器内核，负责渲染 UI
2. **Node.js** - JavaScript 运行时，提供系统级 API
3. **Native APIs** - 操作系统原生功能接口

### 工作原理

```
用户操作
  ↓
渲染进程（Web 页面）
  ↓
IPC 通信
  ↓
主进程（Node.js）
  ↓
调用系统 API
  ↓
返回结果
```

---

## 为什么选择 Electron？

### 优势

#### ✅ 跨平台开发

```
一套代码，三个平台：
- Windows (.exe)
- macOS (.dmg, .app)
- Linux (.deb, .rpm, .AppImage)
```

#### ✅ 前端技术栈

```javascript
// 使用熟悉的 Web 技术
- HTML/CSS/JavaScript
- React/Vue/Angular
- TypeScript
- 任意前端生态库
```

#### ✅ 强大的生态系统

```
丰富的 npm 包：
- UI 组件库（Ant Design、Material-UI）
- 状态管理（Redux、Vuex）
- 路由（React Router、Vue Router）
- 工具库（Lodash、Moment.js）
```

#### ✅ 快速开发

```
原型 → 产品：
- 热重载（HMR）
- DevTools 调试
- 丰富的开发工具
- 活跃的社区支持
```

### 劣势

#### ❌ 包体积较大

```
基础包大小：
- 最小应用：~50MB
- 包含 Chromium + Node.js
- 相比原生应用大很多
```

#### ❌ 内存占用高

```
每个窗口一个 Chromium 实例：
- 单个窗口：~100-200MB
- 多窗口应用：内存消耗更大
- 需要优化资源使用
```

#### ❌ 性能限制

```
不适合的场景：
- 高性能游戏
- 视频编辑软件
- 实时图形处理
- 对启动速度要求极高的应用
```

### 适用场景

```
✅ 适合：
- 企业级管理后台
- 协作工具（聊天、文档）
- 开发工具（编辑器、IDE）
- 数据可视化工具
- 原型快速验证

❌ 不适合：
- 系统级工具
- 高性能游戏
- 移动应用
- 对包体积极其敏感的应用
```

---

## 核心概念

### 1. 主进程（Main Process）

- 应用的入口点
- 只有一个主进程
- 可以访问 Node.js API
- 负责创建和管理窗口
- 处理系统级操作

```javascript
// main.js - 主进程
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

### 2. 渲染进程（Renderer Process）

- 每个窗口一个渲染进程
- 运行 Web 页面
- 默认不能直接访问 Node.js
- 通过 IPC 与主进程通信

```html
<!-- index.html - 渲染进程 -->
<!DOCTYPE html>
<html>
<head>
  <title>Electron App</title>
</head>
<body>
  <h1>Hello Electron!</h1>
  <script src="renderer.js"></script>
</body>
</html>
```

### 3. Preload 脚本

- 在渲染进程加载前执行
- 可以安全地暴露 API 给渲染进程
- 桥接主进程和渲染进程

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  onMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
```

### 4. 进程间通信（IPC）

```
渲染进程 ←→ IPC ←→ 主进程

方式：
- ipcRenderer.send() / ipcMain.on()
- ipcRenderer.invoke() / ipcMain.handle()
- contextBridge（推荐）
```

---

## 快速开始

### 步骤 1：初始化项目

```bash
# 创建项目目录
mkdir electron-app
cd electron-app

# 初始化 package.json
npm init -y

# 安装 Electron
npm install electron --save-dev
```

### 步骤 2：创建项目结构

```
electron-app/
├── package.json
├── main.js          # 主进程
├── preload.js       # 预加载脚本
├── index.html       # 渲染进程页面
└── renderer.js      # 渲染进程脚本
```

### 步骤 3：配置 package.json

```json
{
  "name": "electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^28.0.0"
  }
}
```

### 步骤 4：创建主进程

`main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // 启用上下文隔离
      nodeIntegration: false  // 禁用 Node 集成（更安全）
    }
  });

  // 加载 index.html
  mainWindow.loadFile('index.html');

  // 打开 DevTools（开发环境）
  // mainWindow.webContents.openDevTools();

  // 窗口关闭时
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron 初始化完成后创建窗口
app.whenReady().then(() => {
  createWindow();

  // macOS：点击 Dock 图标时重新打开窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

### 步骤 5：创建 Preload 脚本

`preload.js`:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  send: (channel, data) => {
    const validChannels = ['to-main'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // 接收来自主进程的消息
  receive: (channel, func) => {
    const validChannels = ['from-main'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  // 调用主进程并等待响应
  invoke: (channel, data) => {
    const validChannels = ['get-data', 'save-data'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  }
});
```

### 步骤 6：创建渲染进程页面

`index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electron App</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    
    h1 {
      color: #333;
    }
    
    .container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
    
    button:hover {
      background: #0056b3;
    }
    
    #result {
      margin-top: 20px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Hello Electron!</h1>
    <p>这是一个 Electron 桌面应用示例</p>
    
    <button id="sendBtn">发送消息到主进程</button>
    <button id="getDataBtn">获取数据</button>
    
    <div id="result">等待操作...</div>
  </div>

  <script src="renderer.js"></script>
</body>
</html>
```

### 步骤 7：创建渲染进程脚本

`renderer.js`:

```javascript
// 使用暴露的 API
const resultDiv = document.getElementById('result');
const sendBtn = document.getElementById('sendBtn');
const getDataBtn = document.getElementById('getDataBtn');

// 发送消息到主进程
sendBtn.addEventListener('click', () => {
  window.electronAPI.send('to-main', { message: 'Hello from Renderer!' });
  resultDiv.textContent = '消息已发送到主进程';
});

// 接收来自主进程的消息
window.electronAPI.receive('from-main', (data) => {
  resultDiv.textContent = `收到主进程回复: ${data}`;
});

// 调用主进程获取数据
getDataBtn.addEventListener('click', async () => {
  try {
    const data = await window.electronAPI.invoke('get-data');
    resultDiv.textContent = `获取到的数据: ${JSON.stringify(data)}`;
  } catch (error) {
    resultDiv.textContent = `错误: ${error.message}`;
  }
});
```

### 步骤 8：运行应用

```bash
npm start
```

---

## 主进程与渲染进程

### 对比表格

| 特性 | 主进程 | 渲染进程 |
|------|--------|----------|
| 数量 | 只有一个 | 每个窗口一个 |
| 作用 | 应用生命周期管理 | 显示 Web 页面 |
| Node.js | ✅ 完全访问 | ❌ 默认禁用 |
| DOM | ❌ 无法访问 | ✅ 完全访问 |
| 创建窗口 | ✅ 可以 | ❌ 不可以 |
| 文件操作 | ✅ 可以 | ❌ 需要通过 IPC |

### 主进程常用 API

```javascript
const { app, BrowserWindow, Menu, Tray, dialog, shell } = require('electron');

// 应用控制
app.quit();              // 退出应用
app.getPath('userData'); // 获取用户数据路径
app.getVersion();        // 获取应用版本

// 窗口管理
const win = new BrowserWindow({
  width: 800,
  height: 600,
  frame: false,          // 无边框窗口
  transparent: true,     // 透明背景
  alwaysOnTop: true,     // 始终置顶
  resizable: false,      // 不可调整大小
});

win.loadURL('https://example.com');
win.maximize();
win.minimize();
win.close();

// 系统对话框
dialog.showMessageBox(win, {
  type: 'info',
  title: '提示',
  message: '这是一条消息',
  buttons: ['确定', '取消']
});

// 打开外部链接
shell.openExternal('https://example.com');
```

### 渲染进程可用 API

```javascript
// 通过 contextBridge 暴露的 API
window.electronAPI.send('channel', data);
window.electronAPI.receive('channel', callback);
window.electronAPI.invoke('channel', data);

// 标准 Web API
fetch('https://api.example.com');
localStorage.setItem('key', 'value');
document.getElementById('element');
```

---

## 进程间通信（IPC）

### 方式 1：单向通信（send/on）

```javascript
// 渲染进程 - 发送消息
window.electronAPI.send('to-main', { data: 'Hello' });

// 主进程 - 接收消息
const { ipcMain } = require('electron');

ipcMain.on('to-main', (event, data) => {
  console.log('收到渲染进程消息:', data);
  
  // 回复渲染进程
  event.sender.send('from-main', { reply: 'Received!' });
});
```

### 方式 2：请求-响应（invoke/handle）

```javascript
// 渲染进程 - 调用并等待响应
async function getData() {
  const result = await window.electronAPI.invoke('get-data', { id: 123 });
  console.log(result);
}

// 主进程 - 处理请求
const { ipcMain } = require('electron');

ipcMain.handle('get-data', async (event, data) => {
  // 模拟异步操作
  const result = await fetchDataFromDatabase(data.id);
  return result;
});
```

### 方式 3：双向通信

```javascript
// 主进程
ipcMain.on('request-data', (event, requestId) => {
  // 处理请求
  const data = { message: 'Data from main' };
  
  // 回复特定窗口
  event.reply(`response-${requestId}`, data);
});

// 渲染进程
const requestId = Date.now();
window.electronAPI.send('request-data', requestId);

window.electronAPI.receive(`response-${requestId}`, (data) => {
  console.log('收到回复:', data);
});
```

### 完整示例：文件选择器

```javascript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file')
});

// main.js
const { dialog } = require('electron');

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

// renderer.js
document.getElementById('selectFileBtn').addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectFile();
  if (filePath) {
    console.log('选择的文件:', filePath);
  }
});
```

---

## 原生功能集成

### 1. 文件系统操作

```javascript
// main.js
const { ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path');

// 读取文件
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 写入文件
ipcMain.handle('write-file', async (event, { filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 列出目录
ipcMain.handle('list-directory', async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 2. 系统通知

```javascript
// main.js
const { Notification } = require('electron');

function showNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, 'icon.png')
  }).show();
}

ipcMain.on('show-notification', (event, { title, body }) => {
  showNotification(title, body);
});
```

```javascript
// renderer.js
document.getElementById('notifyBtn').addEventListener('click', () => {
  window.electronAPI.send('show-notification', {
    title: '通知标题',
    body: '这是通知内容'
  });
});
```

### 3. 剪贴板操作

```javascript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  readFromClipboard: () => ipcRenderer.invoke('read-from-clipboard')
});

// main.js
const { clipboard } = require('electron');

ipcMain.handle('copy-to-clipboard', (event, text) => {
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('read-from-clipboard', () => {
  return clipboard.readText();
});
```

### 4. 全局快捷键

```javascript
// main.js
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
  // 注册全局快捷键
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    console.log('快捷键被触发！');
  });

  if (!ret) {
    console.log('快捷键注册失败');
  }

  // 检查快捷键是否注册成功
  console.log('快捷键已注册:', globalShortcut.isRegistered('CommandOrControl+X'));
});

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});
```

### 5. 系统托盘

```javascript
// main.js
const { Tray, Menu } = require('electron');
const path = require('path');

let tray;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow.show() },
    { label: '隐藏窗口', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() }
  ]);
  
  tray.setToolTip('我的 Electron 应用');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
});
```

### 6. 自动更新

```javascript
// main.js
const { autoUpdater } = require('electron-updater');

// 配置更新服务器
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'username',
  repo: 'repo-name'
});

// 监听更新事件
autoUpdater.on('checking-for-update', () => {
  console.log('检查更新...');
});

autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('更新已下载');
  // 询问用户是否安装
  dialog.showMessageBox({
    type: 'question',
    buttons: ['立即重启', '稍后'],
    message: '新版本已下载，是否立即重启？'
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// 定期检查更新
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 3600000); // 每小时检查一次
```

---

## 实战案例

### 案例 1：待办事项应用（Todo App）

#### 项目结构

```
todo-app/
├── package.json
├── main.js
├── preload.js
├── index.html
├── styles.css
└── renderer.js
```

#### package.json

```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^28.0.0"
  }
}
```

#### main.js

```javascript
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;
const DATA_FILE = path.join(app.getPath('userData'), 'todos.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 加载待办事项
ipcMain.handle('load-todos', async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
});

// 保存待办事项
ipcMain.handle('save-todos', async (event, todos) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

#### preload.js

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('todoAPI', {
  loadTodos: () => ipcRenderer.invoke('load-todos'),
  saveTodos: (todos) => ipcRenderer.invoke('save-todos', todos)
});
```

#### index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>待办事项</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>📝 待办事项</h1>
    
    <div class="input-group">
      <input type="text" id="todoInput" placeholder="输入新的待办事项...">
      <button id="addBtn">添加</button>
    </div>
    
    <ul id="todoList"></ul>
    
    <div class="stats">
      <span id="totalCount">总计: 0</span>
      <span id="completedCount">已完成: 0</span>
    </div>
  </div>

  <script src="renderer.js"></script>
</body>
</html>
```

#### styles.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#todoInput {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

#todoInput:focus {
  outline: none;
  border-color: #667eea;
}

#addBtn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

#addBtn:hover {
  background: #5568d3;
}

#todoList {
  list-style: none;
  margin-bottom: 20px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: transform 0.2s;
}

.todo-item:hover {
  transform: translateX(5px);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-checkbox {
  margin-right: 12px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 16px;
}

.delete-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #ee3742;
}

.stats {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}
```

#### renderer.js

```javascript
let todos = [];

// 加载待办事项
async function loadTodos() {
  todos = await window.todoAPI.loadTodos();
  renderTodos();
}

// 保存待办事项
async function saveTodos() {
  await window.todoAPI.saveTodos(todos);
}

// 渲染待办列表
function renderTodos() {
  const todoList = document.getElementById('todoList');
  const totalCount = document.getElementById('totalCount');
  const completedCount = document.getElementById('completedCount');
  
  todoList.innerHTML = '';
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(${index})"
      >
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" onclick="deleteTodo(${index})">删除</button>
    `;
    
    todoList.appendChild(li);
  });
  
  // 更新统计
  totalCount.textContent = `总计: ${todos.length}`;
  completedCount.textContent = `已完成: ${todos.filter(t => t.completed).length}`;
}

// 添加待办
document.getElementById('addBtn').addEventListener('click', addTodo);
document.getElementById('todoInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  
  if (text) {
    todos.push({
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    });
    
    input.value = '';
    await saveTodos();
    renderTodos();
  }
}

// 切换完成状态
window.toggleTodo = async (index) => {
  todos[index].completed = !todos[index].completed;
  await saveTodos();
  renderTodos();
};

// 删除待办
window.deleteTodo = async (index) => {
  todos.splice(index, 1);
  await saveTodos();
  renderTodos();
};

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 初始化
loadTodos();
```

### 案例 2：Markdown 编辑器

```javascript
// 简化的 Markdown 编辑器主进程
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

// 打开文件
ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
  });
  
  if (!result.canceled) {
    const content = await fs.readFile(result.filePaths[0], 'utf-8');
    return { path: result.filePaths[0], content };
  }
  return null;
});

// 保存文件
ipcMain.handle('save-file', async (event, { path, content }) => {
  await fs.writeFile(path, content, 'utf-8');
  return { success: true };
});
```

---

## 性能优化

### 1. 避免阻塞主线程

```javascript
// ❌ 错误：在主进程中执行耗时操作
ipcMain.handle('heavy-task', () => {
  const result = heavyComputation(); // 阻塞主线程
  return result;
});

// ✅ 正确：使用 Worker Threads
const { Worker } = require('worker_threads');

ipcMain.handle('heavy-task', async () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');
    worker.on('message', resolve);
    worker.on('error', reject);
  });
});
```

### 2. 优化窗口加载

```javascript
// ✅ 使用本地资源
win.loadFile('index.html');

// ✅ 预加载关键资源
win.webContents.on('did-finish-load', () => {
  // 窗口加载完成后执行
});

// ❌ 避免加载远程资源（慢且不安全）
win.loadURL('https://example.com');
```

### 3. 内存管理

```javascript
// 及时释放资源
mainWindow.on('closed', () => {
  mainWindow = null; // 释放引用
});

// 清理定时器
app.on('will-quit', () => {
  clearInterval(myInterval);
  clearTimeout(myTimeout);
});
```

### 4. 使用 BrowserView 替代多窗口

```javascript
// ❌ 多个窗口占用更多内存
const win1 = new BrowserWindow();
const win2 = new BrowserWindow();

// ✅ 使用 BrowserView（共享同一窗口）
const view = new BrowserView();
mainWindow.setBrowserView(view);
view.setBounds({ x: 0, y: 100, width: 800, height: 500 });
view.webContents.loadURL('https://example.com');
```

### 5. 懒加载模块

```javascript
// ✅ 按需加载模块
let someModule;

function useSomeModule() {
  if (!someModule) {
    someModule = require('some-heavy-module');
  }
  return someModule;
}
```

---

## 打包与发布

### 1. 使用 electron-builder

```bash
npm install electron-builder --save-dev
```

#### package.json 配置

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.example.myapp",
    "productName": "My App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"]
    },
    "mac": {
      "target": ["dmg", "zip"],
      "category": "public.app-category.utilities"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Utility"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0"
  }
}
```

#### 打包命令

```bash
# 打包当前平台
npm run build

# 打包 Windows
npm run build:win

# 打包 macOS
npm run build:mac

# 打包 Linux
npm run build:linux

# 打包所有平台
npm run build -- -mwl
```

### 2. 使用 electron-packager

```bash
npm install electron-packager --save-dev

# 打包
npx electron-packager . MyApp --platform=win32 --arch=x64
```

### 3. 代码签名（macOS）

```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (XXXXX)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    }
  }
}
```

### 4. 自动更新配置

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "username",
      "repo": "repo-name"
    }
  }
}
```

---

## 最佳实践

### 1. 安全性

#### ✅ 启用上下文隔离

```javascript
// main.js
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,  // ✅ 启用
    nodeIntegration: false,  // ✅ 禁用
    preload: path.join(__dirname, 'preload.js')
  }
});
```

#### ✅ 验证 IPC 通道

```javascript
// preload.js
const validChannels = ['channel1', 'channel2'];

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  }
});
```

#### ✅ 验证外部链接

```javascript
// 阻止导航到非预期 URL
win.webContents.on('will-navigate', (event, url) => {
  if (!url.startsWith('file://')) {
    event.preventDefault();
    shell.openExternal(url);
  }
});
```

### 2. 用户体验

#### ✅ 自定义标题栏

```javascript
const win = new BrowserWindow({
  frame: false,  // 无边框窗口
  titleBarStyle: 'hiddenInset'  // macOS
});
```

```html
<!-- 自定义标题栏 -->
<div class="titlebar">
  <div class="drag-region"></div>
  <div class="controls">
    <button onclick="minimize()">−</button>
    <button onclick="maximize()">□</button>
    <button onclick="close()">×</button>
  </div>
</div>
```

#### ✅ 加载状态

```javascript
// 显示加载指示器
win.webContents.on('did-start-loading', () => {
  showLoadingIndicator();
});

win.webContents.on('did-stop-loading', () => {
  hideLoadingIndicator();
});
```

### 3. 错误处理

```javascript
// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // 记录日志、上报错误
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// 渲染进程错误
win.webContents.on('crashed', () => {
  console.error('Window crashed!');
});
```

### 4. 开发体验

#### ✅ 条件加载 DevTools

```javascript
if (process.env.NODE_ENV === 'development') {
  win.webContents.openDevTools();
}
```

#### ✅ 热重载

```bash
npm install electron-reload --save-dev
```

```javascript
// main.js
require('electron-reload')(__dirname, {
  electron: require('electron')
});
```

### 5. 清单检查

```
发布前检查清单：
✅ 移除 console.log（生产环境）
✅ 禁用 DevTools
✅ 测试所有平台
✅ 代码签名（macOS/Windows）
✅ 配置自动更新
✅ 优化包体积
✅ 编写 README
✅ 准备应用图标（多种尺寸）
✅ 测试安装和卸载
✅ 验证自动更新流程
```

---

## 总结

### 🎯 核心要点回顾

#### Electron 架构
- **主进程**：应用入口，管理系统级操作
- **渲染进程**：显示 Web 界面，每个窗口一个
- **Preload 脚本**：安全桥接两个进程
- **IPC 通信**：进程间数据交换

#### 开发流程
1. 初始化项目，安装 Electron
2. 创建主进程、渲染进程、preload 脚本
3. 实现业务逻辑和 UI
4. 集成原生功能（文件、通知等）
5. 测试和优化
6. 打包发布

#### 关键技能
- ✅ 进程间通信（IPC）
- ✅ 上下文隔离和安全
- ✅ 原生功能集成
- ✅ 性能优化
- ✅ 打包和发布

### 📊 技术选型建议

```
选择 Electron 如果：
- 需要跨平台桌面应用
- 团队熟悉 Web 技术
- 应用复杂度中等
- 对包体积不敏感

考虑其他方案如果：
- 需要极致性能 → 原生开发
- 需要小包体积 → Tauri、Wails
- 只需移动端 → React Native、Flutter
```

### 🚀 下一步学习

1. **深入理解架构**
   - Electron 内部原理
   - Chromium 和 Node.js 集成
   - 多进程模型

2. **高级功能**
   - 原生模块集成（C++ Addons）
   - WebGL 和 GPU 加速
   - 系统托盘和通知中心

3. **性能优化**
   - 内存管理策略
   - 启动速度优化
   - 包体积压缩

4. **生态工具**
   - Electron Forge
   - Electron Fiddle
   - DevTools 扩展

### 📚 推荐资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron API Demos](https://github.com/electron/electron-api-demos)
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)
- [Electron Builder 文档](https://www.electron.build/)

---

希望这份指南能帮助你快速入门 Electron，构建出色的跨平台桌面应用！🎉

**记住：Electron 的强大之处在于让你用熟悉的 Web 技术创造桌面体验。**

**开始你的 Electron 之旅吧！** 🚀
