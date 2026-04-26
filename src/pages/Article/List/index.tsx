import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag, Popconfirm, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import RichTextEditor from '@/components/RichTextEditor';
import { getArticleList, deleteArticle, updateArticle, type ArticleData } from '@/api/article';

const { TextArea } = Input;

interface ArticleItem extends ArticleData {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

const ArticleList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 搜索相关状态
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined);
  
  // 编辑弹窗相关状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  // 文章分类选项
  const categories = [
    { label: '技术文章', value: 'tech' },
    { label: '产品动态', value: 'product' },
    { label: '行业资讯', value: 'industry' },
    { label: '教程指南', value: 'tutorial' },
  ];

  // 获取文章列表
  const fetchArticleList = async (page = currentPage, size = pageSize, title = searchTitle, category = searchCategory) => {
    setLoading(true);
    try {
      const params: any = { page, size };
      if (title) {
        params.title = title;
      }
      if (category) {
        params.category = category;
      }
      const res = await getArticleList(params);
      // 根据实际API返回结构调整
      if (res && res.data) {
        setDataSource(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleList();
  }, []);

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchArticleList(pagination.current, pagination.pageSize);
  };

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1);
    fetchArticleList(1, pageSize, searchTitle, searchCategory);
  };

  // 处理重置搜索
  const handleReset = () => {
    setSearchTitle('');
    setSearchCategory(undefined);
    setCurrentPage(1);
    fetchArticleList(1, pageSize, '', undefined);
  };

  // 删除文章
  const handleDelete = async (id: number) => {
    try {
      await deleteArticle(id);
      message.success('删除成功');
      fetchArticleList();
    } catch (error) {
      message.error('删除文章失败');
    }
  };

  // 打开编辑弹窗
  const handleEdit = (record: ArticleItem) => {
    setEditingArticle(record);
    form.setFieldsValue({
      title: record.title,
      category: record.category,
      content: record.content,
    });
    setIsModalOpen(true);
  };

  // 关闭编辑弹窗
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    form.resetFields();
  };

  // 提交编辑
  const handleUpdate = async (values: ArticleData) => {
    if (!editingArticle) return;
    setSubmitLoading(true);
    try {
      await updateArticle(editingArticle.id, values);
      message.success('更新成功');
      handleModalCancel();
      fetchArticleList();
    } catch (error) {
      message.error('更新文章失败');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 跳转到创建页面
  const handleCreate = () => {
    navigate('/article/create');
  };

  // 格式化时间
  const formatTime = (time?: string) => {
    if (!time) return '-';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  };

  // 表格列定义
  const columns: ColumnsType<ArticleItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => {
        const categoryMap: Record<string, { color: string; text: string }> = {
          tech: { color: 'blue', text: '技术文章' },
          product: { color: 'green', text: '产品动态' },
          industry: { color: 'orange', text: '行业资讯' },
          tutorial: { color: 'purple', text: '教程指南' },
        };
        const config = categoryMap[category] || { color: 'default', text: category };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => formatTime(time),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => formatTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* 搜索区域 */}
      <div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
        <Space size="middle" wrap>
          <Input
            placeholder="请输入文章标题"
            prefix={<SearchOutlined />}
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            style={{ width: 250 }}
            allowClear
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="请选择文章分类"
            value={searchCategory}
            onChange={(value) => setSearchCategory(value)}
            style={{ width: 180 }}
            allowClear
            options={categories}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>

      <div className="flex items-center justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          创建文章
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />

      {/* 编辑弹窗 */}
      <Modal
        title="编辑文章"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
        confirmLoading={submitLoading}
      >
        <Spin spinning={submitLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item
              label="文章标题"
              name="title"
              rules={[
                { required: true, message: '请输入文章标题' },
                { max: 100, message: '标题不能超过100个字符' },
              ]}
            >
              <Input placeholder="请输入文章标题" />
            </Form.Item>

            <Form.Item
              label="文章分类"
              name="category"
              rules={[{ required: true, message: '请选择文章分类' }]}
            >
              <Select
                placeholder="请选择文章分类"
                options={categories}
              />
            </Form.Item>

            <Form.Item
              label="文章内容"
              name="content"
              rules={[
                { required: true, message: '请输入文章内容' },
                {
                  validator: (_, value) => {
                    if (!value || value === '<p></p>' || value === '') {
                      return Promise.reject(new Error('请输入文章内容'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <RichTextEditor placeholder="请输入文章内容..." />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
                  保存
                </Button>
                <Button onClick={handleModalCancel} disabled={submitLoading}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ArticleList;
