import './index.scss'
import { Button, Card, Form, Input, message } from 'antd'
import { useDispatch } from 'react-redux'
import { fetchRegister } from '@/store/modules/user'
import { useNavigate } from 'react-router-dom'
import { encrypt } from '@/utils/crypto' // 引入加密工具
import type { AxiosError } from 'axios'
import type { AppDispatch } from '@/store'

// 定义表单值的类型接口
interface RegisterFormValues {
  username: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const onFinish = async (values: RegisterFormValues) => {
    try {
      // 对密码进行 AES 加密
      const encryptedPassword = encrypt(values.password);

      // 发送注册请求
      await dispatch(fetchRegister({
        username: values.username,
        nickname: values.nickname,
        password: encryptedPassword // 使用加密后的密码
      }))

      message.success('注册成功,请登录')
      // 注册成功后跳转到登录页
      navigate('/login')
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      if (err.response?.status === 409) {
        message.error('用户名已存在')
      } else if (err.response?.status === 400) {
        message.error('密码格式错误或解密失败')
      } else {
        message.error(err.message || '注册失败,请稍后重试')
      }
    }
  }

  return (
    <div className="register">
      <Card className="register-container">
        {/* 注册表单 */}
        <Form
          validateTrigger="onBlur"
          onFinish={onFinish}
          labelCol={{
            span: 4,
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
              {
                min: 3,
                message: '用户名至少3个字符',
              },
            ]}>
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[
              {
                required: true,
                message: '请输入昵称',
              },
            ]}>
            <Input size="large" placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              {
                min: 6,
                message: '密码至少6个字符',
              },
            ]}>
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '请确认密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}>
            <Input.Password size="large" placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Register
