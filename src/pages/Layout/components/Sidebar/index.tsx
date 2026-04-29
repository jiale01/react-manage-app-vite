import { Menu } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    // 博客文章管理
    {
      key: '/article',
      icon: <FileTextOutlined />,
      label: '文章管理',
      children: [
        {
          key: '/article/create',
          icon: <FileTextOutlined />,
          label: '创建文章',
        },
        {
          key: '/article/list',
          icon: <FileTextOutlined />,
          label: '文章列表',
        },

      ]
    },
    // 工作流管理
    {
      key: '/flow',
      icon: <FileTextOutlined />,
      label: '工作流管理',
      children: [
        {
          key: '/flow/create',
          icon: <FileTextOutlined />,
          label: '创建工作流',
        },
        {
          key: '/flow/list',
          icon: <FileTextOutlined />,
          label: '工作流列表',
        }
      ]
    }
  ]

  const handleClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#001529'
    }}>
      {/* Logo 区域 */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: '#002140',
        }}
      >
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          alt="logo"
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <span
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Zane的后台管理系统
        </span>
      </div>

      {/* 菜单区域 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleClick}
        style={{
          flex: 1,
          borderRight: 0,
          background: '#001529',
        }}
      />
    </div>
  )
}

export default Sidebar
