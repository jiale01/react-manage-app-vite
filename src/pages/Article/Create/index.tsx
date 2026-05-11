import { Form, Input, Select, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import { createArticle } from '@/api/article';
import { ARTICLE_CATEGORY_OPTIONS } from '@/config';

const { TextArea } = Input;

interface ArticleFormValues {
  title: string;
  category: string;
  content: string;
}

const ArticleCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ArticleFormValues) => {
    setLoading(true);
    try {
      console.log('提交的文章数据:', values);

      // 调用API创建文章
      await createArticle(values);

      message.success('文章创建成功');

      // 跳转到文章列表页
      navigate('/article/list');
    } catch (error) {
      console.error('创建文章失败:', error);
      message.error('创建文章失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/article/list');
  };

  return (
    <div className="p-6">
      <Card title="创建文章" variant="borderless">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* 文章标题 */}
          <Form.Item
            label="文章标题"
            name="title"
            rules={[
              { required: true, message: '请输入文章标题' },
              { max: 100, message: '标题不能超过100个字符' },
            ]}
          >
            <Input placeholder="请输入文章标题" size="large" />
          </Form.Item>

          {/* 文章分类 */}
          <Form.Item
            label="文章分类"
            name="category"
            rules={[{ required: true, message: '请选择文章分类' }]}
          >
            <Select
              placeholder="请选择文章分类"
              size="large"
              options={ARTICLE_CATEGORY_OPTIONS}
            />
          </Form.Item>

          {/* 富文本内容 */}
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

          {/* 按钮组 */}
          <Form.Item>
            <div className="flex gap-4">
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                发布文章
              </Button>
              <Button size="large" onClick={handleCancel} disabled={loading}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleCreate;
