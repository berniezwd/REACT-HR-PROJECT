import { useLocation, matchRoutes, Navigate } from 'react-router-dom'
import { routes } from '../router'
import { useSelect } from '../hooks'
import _ from 'lodash'

interface BeforeEachProps {
  children?: React.ReactNode
}

export default function BeforeEach(props: BeforeEachProps) {
  const token = useSelect('token')
  const infos = useSelect('infos')
  const location = useLocation()
  const matchs = matchRoutes(routes, location)

  if (Array.isArray(matchs)) {
    // 匹配当前路由信息
    const meta = matchs[matchs.length - 1].route.meta
    // 如果当前路由需要登录，但是用户信息为空，就跳转到登录页
    if (meta?.auth && _.isEmpty(infos)) {
      if (!token) {
        return <Navigate to="/login" />
      }
    }
  }

  // 有token 且 有用户信息 且 当前路由是登录页，就跳转到主页
  if (token && !_.isEmpty(infos) && location.pathname === '/login') {
    return <Navigate to="/sign" />
  }
  return <>{props.children}</>
}
