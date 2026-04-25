import { Breadcrumb as AntBreadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

const Breadcrumb = () => {
  const location = useLocation()

  // 根据路径生成面包屑
  const pathSnippets = location.pathname.split('/').filter((i) => i)

  const breadcrumbItems = [
    {
      title: (
        <span>
          <HomeOutlined />
          <span style={{ marginLeft: 4 }}>首页</span>
        </span>
      ),
      href: '/',
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      return {
        title: pathSnippets[index],
        href: url,
      }
    }),
  ]

  return (
    <div
      style={{
        padding: '12px 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <AntBreadcrumb items={breadcrumbItems} />
    </div>
  )
}

export default Breadcrumb
