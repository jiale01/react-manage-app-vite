import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content: AntContent } = Layout

const Content = () => {
  return (
    <AntContent
      style={{
        margin: '24px',
        padding: 24,
        background: '#fff',
        borderRadius: 4,
        minHeight: 280,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,.03)',
      }}
    >
      <Outlet />
    </AntContent>
  )
}

export default Content
