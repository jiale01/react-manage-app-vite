import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './router/index.tsx'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import store from './store/index.ts'
import './index.css'
import 'normalize.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
