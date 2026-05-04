import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag, Popconfirm, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getUserList, deleteUser, updateUser, createUser,  type UserItem, type CreateUserDto, type UpdateUserDto } from '@/api/user';

const { Password } = Input;

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 搜索相关状态
  const [searchUsername, setSearchUsername] = useState('');
  
  // 编辑弹窗相关状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  // 获取用户列表
  const fetchUserList = async (page = currentPage, size = pageSize, username = searchUsername) => {
    setLoading(true);
    try {
      const params: any = { page, size };
      if (username) {
        params.username = username;
      }
      const res = await getUserList(params);
      // 根据实际API返回结构调整：res.data.list 和 res.data.total
      if (res && res.data) {
        setDataSource(res.data.list || []);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchUserList(pagination.current, pagination.pageSize, searchUsername);
  };

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUserList(1, pageSize, searchUsername);
  };

  // 处理重置搜索
  const handleReset = () => {
    setSearchUsername('');
    setCurrentPage(1);
    fetchUserList(1, pageSize, '');
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      fetchUserList(currentPage, pageSize, searchUsername);
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  // 打开新增弹窗
  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: UserItem) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      email: record.email,
      phone: record.phone,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  // 关闭弹窗
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 提交表单（新增或更新）
  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      if (editingUser) {
        // 更新用户
        const updateData: UpdateUserDto = {
          nickname: values.nickname,
          email: values.email,
          phone: values.phone,
          status: values.status,
        };
        await updateUser(editingUser.id, updateData);
        message.success('更新成功');
      } else {
        // 创建用户
        const createData: CreateUserDto = {
          username: values.username,
          nickname: values.nickname,
          password: values.password,
          email: values.email,
          phone: values.phone,
        };
        await createUser(createData);
        message.success('创建成功');
      }
      handleModalCancel();
      fetchUserList(currentPage, pageSize, searchUsername);
    } catch (error) {
      message.error(editingUser ? '更新用户失败' : '创建用户失败');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 格式化时间
  const formatTime = (time?: string) => {
    if (!time) return '-';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  };

  // 表格列定义
  const columns: ColumnsType<UserItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (email: string) => email || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        if (status === undefined || status === null) return '-';
        return status === 1 ? (
          <Tag color="green">启用</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        );
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
      width: 200,
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
            title="确定要删除这个用户吗？"
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
            placeholder="请输入用户名"
            prefix={<SearchOutlined />}
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            style={{ width: 250 }}
            allowClear
            onPressEnter={handleSearch}
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
          新增用户
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
        scroll={{ x: 1200 }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <Spin spinning={submitLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
                { max: 20, message: '用户名不能超过20个字符' },
              ]}
            >
              <Input 
                placeholder="请输入用户名" 
                disabled={!!editingUser} // 编辑时不允许修改用户名
              />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Password placeholder="请输入密码" />
              </Form.Item>
            )}

            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            {editingUser && (
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select
                  placeholder="请选择状态"
                  options={[
                    { label: '启用', value: 1 },
                    { label: '禁用', value: 0 },
                  ]}
                />
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
                  {editingUser ? '保存' : '创建'}
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

export default UserList;
