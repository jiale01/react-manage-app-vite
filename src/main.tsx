import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './router/index.tsx'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import store from './store/index.ts'
import './index.css'
import 'normalize.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>
)
