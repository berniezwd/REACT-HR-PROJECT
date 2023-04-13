import { Avatar, Badge, Dropdown, MenuProps, Space } from 'antd'
import './layout.less'
import { BellOutlined } from '@ant-design/icons'
import { useSelect, useRTK, useRouter } from '../../hooks'

const items1: MenuProps['items'] = [
  {
    key: '1',
    label: <div>暂无消息</div>,
  },
]

export default function layoutHeader() {
  const { name, head } = useSelect('infos')
  const { clearTokenAction } = useRTK()
  const { router } = useRouter()
  const handleLogout = () => {
    clearTokenAction()
    router('/login', { replace: true })
  }

  const items2: MenuProps['items'] = [
    {
      key: '1',
      label: <div>个人中心</div>,
    },
    {
      key: '2',
      label: <div onClick={handleLogout}>退出登录</div>,
    },
  ]

  return (
    <div className="HomeHeader">
      <span className="home-header-logo">
        <i className="iconfont icon-react"></i>
        <i className="iconfont icon-icon-test"></i>
        <i className="iconfont icon-typescript"></i>
      </span>
      <span className="home-header-title">在线考勤系统</span>
      <Dropdown menu={{ items: items1 }} arrow placement={'bottom'}>
        <Badge dot count={2}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Dropdown>
      <Dropdown menu={{ items: items2 }} arrow placement={'bottom'}>
        <Space className="home-header-space">
          <Avatar src={head} />
          {name}
        </Space>
      </Dropdown>
    </div>
  )
}
