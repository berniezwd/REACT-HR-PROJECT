import { useSelector } from 'react-redux'
import './Login.less'
import { Button, message } from 'antd'
import { RootState, useAppDispatch } from '../../store'
import { loginAction, updateToken } from '../../store/modules/user'
import { LoginPayload } from '../../utils/apis'

interface IAction {
  [index: string]: any
}

export default function Login() {
  const token = useSelector((state: RootState) => state.user.token)
  const dispatch = useAppDispatch()
  const handleLoginAction = () => {
    const params: LoginPayload = {
      email: 'huangrong@imooc.com',
      pass: 'huangrong',
    }
    dispatch(loginAction(params)).then((action: IAction) => {
      const { token } = action.payload as IAction
      console.log('token', token)
      if (token) {
        dispatch(updateToken(token))
        message.success('登录成功')
      } else {
        message.error('登录失败')
      }
    })
  }
  return (
    <div>
      Login
      <br />
      <div>{token}</div>
      <Button type="primary" onClick={handleLoginAction}>
        登录
      </Button>
    </div>
  )
}
