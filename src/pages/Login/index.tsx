import './index.scss'
import { Button, Card, Form, Input, message } from 'antd'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '@/store/modules/user'
import { useNavigate, Link } from 'react-router-dom'
import { encrypt } from '@/utils/crypto' // 引入加密工具
import type { AxiosError } from 'axios'
import type { AppDispatch } from '@/store'

// 定义表单值的类型接口
interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const onFinsh = async (values: LoginFormValues) => {
    try {
      // 对密码进行 AES 加密
      const encryptedPassword = encrypt(values.password);

      // 发送加密后的密码
      await dispatch(fetchLogin({
        username: values.username,
        password: encryptedPassword // 使用加密后的密码
      }))

      navigate('/', { replace: true });
      message.success('登录成功')
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      message.error(err.message || '登录失败,请检查用户名和密码')
    }
  }

  return (
    <div className="login">
      <Card className="login-container">
        {/* 登录表单 */}
        <Form validateTrigger="onBlur"
          onFinish={onFinsh}
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
            ]}>
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}>
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <span>还没有账号? </span>
              <Link to="/register">立即注册</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login