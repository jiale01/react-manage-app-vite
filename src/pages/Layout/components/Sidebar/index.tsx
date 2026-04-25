import { Menu } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
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
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: '/user/list',
          label: '用户列表',
        },
        {
          key: '/user/role',
          label: '角色管理',
        },
      ],
    },
    {
      key: '/content',
      icon: <FileTextOutlined />,
      label: '内容管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
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
