import { Tabs as AntTabs } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'

const Tabs = () => {
  // 示例标签页数据
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '工作台',
      closable: false,
    },
    {
      key: '2',
      label: '用户列表',
      closable: true,
    },
    {
      key: '3',
      label: '角色管理',
      closable: true,
    },
  ]

  return (
    <div
      style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <AntTabs
        hideAdd
        type="editable-card"
        items={items}
        tabBarStyle={{
          margin: 0,
        }}
        size="small"
      />
    </div>
  )
}

export default Tabs
