import { useEffect } from 'react'
import { Layout, Space, Avatar, Dropdown, Badge } from 'antd'
import {
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserInfo, clearUserInfo } from '@/store/modules/user'
import type { AppDispatch, RootState } from '@/store'

const { Header: AntHeader } = Layout

const Header = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { userInfo } = useSelector((state: RootState) => state.user)

  // 组件挂载时获取用户信息
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => {
        dispatch(clearUserInfo())
        // 这里可以添加跳转到登录页的逻辑
        window.location.href = '/login'
      },
    },
  ]

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ flex: 1 }}>
      </div>

      {/* 右侧：通知、帮助、用户信息 */}
      <Space size={24}>
        {/* 通知 */}
        <Badge count={5} size="small">
          <BellOutlined
            style={{
              fontSize: 18,
              color: '#666',
              cursor: 'pointer',
            }}
          />
        </Badge>

        {/* 用户信息 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              src={userInfo?.avatar}
              style={{ backgroundColor: '#1890ff' }}
            />
            <span style={{ color: '#333', fontSize: 14 }}>
              {userInfo?.nickname || userInfo?.username || 'Admin'}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header