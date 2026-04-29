import { Breadcrumb as AntBreadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

// 路径到中文名称的映射
const pathNameMap: Record<string, string> = {
  dashboard: '工作台',
  article: '文章管理',
  list: '文章列表',
  create: '创建文章',
}

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
      const pathKey = pathSnippets[index]
      // 使用映射表获取中文名称，如果没有映射则使用原始路径
      const displayName = pathNameMap[pathKey] || pathKey
      
      return {
        title: displayName,
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