import { Layout as AntLayout } from 'antd'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Content from './components/Content'
import Breadcrumb from './components/Breadcrumb'
import './index.scss'

const { Sider } = AntLayout

const Layout = () => {
  return (
    <AntLayout className="layout-container">
      <Sider
        theme="dark"
        width={256}
        collapsible
        trigger={null}
        breakpoint="lg"
        collapsedWidth="80"
        className="custom-sider"
      >
        <Sidebar />
      </Sider>
      <AntLayout>
        <Header />
        <Breadcrumb />
        <Content />
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
