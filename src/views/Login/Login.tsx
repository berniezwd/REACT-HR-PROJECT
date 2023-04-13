import './Login.less'
import { loginAction, updateToken, updateTokenAction } from '../../store/modules/user'
import { Button, Form, Input, message, Row, Col, Spin } from 'antd'
import { useState } from 'react'
import { useRTK, useRouter, useSelect } from '../../hooks'

const testUsers: Login.User[] = [
  {
    email: 'huangrong@imooc.com',
    pass: 'huangrong',
  },
  {
    email: 'hongqigong@imooc.com',
    pass: 'hongqigong',
  },
]

export default function Login() {
  const { dispatch } = useRTK()
  const { router } = useRouter()
  const infos = useSelect('infos')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // 一键登录操作
  const authLogin = (values: Login.User) => {
    form.setFieldsValue(values)
    onFinish(values)
  }

  // 登录操作
  const onFinish = (values: Login.User) => {
    setLoading(true)
    dispatch(loginAction(values)).then((action: Login.IndexSign) => {
      const { token } = action.payload as Login.IndexSign
      if (token) {
        // 更新token
        dispatch(updateToken(token))
        // 获取用户信息
        dispatch(updateTokenAction(token)).then((res: Record<string, any>) => {
          if (res.payload.errcode === 0) {
            setLoading(false)
            if (infos) {
              message.success('登录成功')
              router('/sign')
            }
          }
        })
      } else {
        message.error('登录失败，请重试')
        setLoading(false)
      }
    })
  }

  return (
    <div className="Login">
      <Spin spinning={loading}>
        <div className="header">
          <span className="header-logo">
            <i className="iconfont icon-react"></i>
            <i className="iconfont icon-icon-test"></i>
            <i className="iconfont icon-typescript"></i>
          </span>
          <span className="header-title">在线考勤系统</span>
        </div>
        <div className="desc">零基础从入门到进阶，系统掌握前端三大热门技术(Vue、React、TypeScript)</div>

        <Form
          form={form}
          className="main"
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 400 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off">
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, type: 'email', message: '请输入正确的邮箱!' }]}>
            <Input placeholder="请输入您的邮箱!" />
          </Form.Item>

          <Form.Item label="密码" name="pass" rules={[{ required: true, message: '请输入您的密码!' }]}>
            <Input.Password placeholder="请输入您的密码!" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              立即登录
            </Button>
          </Form.Item>
        </Form>
        <div className="users">
          <Row gutter={20}>
            {testUsers.map((item: Login.User) => {
              return (
                <Col key={item.pass} span={12}>
                  <h3>
                    测试账号：
                    <Button onClick={() => authLogin(item)}>一键登录</Button>
                  </h3>
                  <p>账号: {item.email}</p>
                  <p>密码: {item.pass}</p>
                </Col>
              )
            })}
          </Row>
        </div>
      </Spin>
    </div>
  )
}
