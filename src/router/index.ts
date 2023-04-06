import { ReactNode, createElement, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { CopyOutlined, CalendarOutlined, WarningOutlined, FileAddOutlined, ScheduleOutlined } from '@ant-design/icons'

const Login = lazy(() => import('../views/Login/Login'))
const Home = lazy(() => import('../views/Home/Home'))
const Sign = lazy(() => import('../views/Sign/Sign'))
const Check = lazy(() => import('../views/Check/Check'))
const Apply = lazy(() => import('../views/Apply/Apply'))
const Error = lazy(() => import('../views/Error/Error'))
const Exception = lazy(() => import('../views/Exception/Exception'))
const BeforeEach = lazy(() => import('../components/BeforeEach'))

declare module 'react-router' {
  interface IndexRouteObject {
    meta?: {
      title?: string
      menu?: boolean
      icon?: ReactNode
      auth?: boolean
    }
  }
  interface NonIndexRouteObject {
    meta?: {
      title?: string
      menu?: boolean
      icon?: ReactNode
      auth?: boolean
    }
  }
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: createElement(BeforeEach, null, createElement(Home)),
    meta: {
      title: '考勤管理',
      menu: true,
      icon: createElement(CopyOutlined),
      auth: true,
    },
    children: [
      {
        path: 'Sign',
        element: createElement(Sign),
        meta: {
          title: '在线打卡签到',
          menu: true,
          icon: createElement(CalendarOutlined),
          auth: true,
        },
      },
      {
        path: 'Check',
        element: createElement(Check),
        meta: {
          title: '我的考勤审批',
          menu: true,
          icon: createElement(ScheduleOutlined),
          auth: true,
        },
      },
      {
        path: 'Apply',
        element: createElement(Apply),
        meta: {
          title: '添加考勤审批',
          menu: true,
          icon: createElement(FileAddOutlined),
          auth: true,
        },
      },
      {
        path: 'Exception',
        element: createElement(Exception),
        meta: {
          title: '异常考勤查询',
          menu: true,
          icon: createElement(WarningOutlined),
          auth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    element: createElement(BeforeEach, null, createElement(Login)),
    meta: {
      title: '登录',
      menu: false,
      icon: null,
      auth: false,
    },
  },
  {
    path: '*',
    element: createElement(Error),
  },
]

const router = createBrowserRouter(routes)

export default router
