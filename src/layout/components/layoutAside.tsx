import _ from 'lodash'
import { Menu, MenuProps } from 'antd'
import { Link } from 'react-router-dom'
import { routes } from '../../router'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useRoute } from '../../hooks'
import './layout.less'

type MenuItem = Required<MenuProps>['items'][number]

export default function layoutAside() {
  const { matchRoute } = useRoute()

  const subPath = matchRoute![0].pathnameBase || '' // 一级路由展开的key
  const secPath = matchRoute![1].pathnameBase || '' // 二级路由选中的key

  const permission = useSelector((state: RootState) => state.user.infos.permission) as string[]

  // 筛选是否有menu的菜单项和菜单children的项
  const menus = _.cloneDeep(routes).filter((parent) => {
    if (parent.children) {
      parent.children = parent.children?.filter((v) => {
        if (v.meta && v.name && v.meta.menu && permission.includes(v.name)) {
          return v
        }
      })
    }
    return parent.meta?.menu && permission.includes(parent.name as string)
  })
  const items1: MenuItem[] = menus.map((item) => {
    const children = item.children?.map((child) => {
      return {
        key: item.path! + child.path!,
        label: <Link to={item.path! + child.path!}>{child.meta?.title}</Link>,
        icon: child.meta?.icon,
      }
    })
    return {
      key: item.path!,
      label: item.meta?.title,
      icon: item.meta?.icon,
      children: children,
    }
  })
  return <Menu className="HomeAside" openKeys={[subPath]} selectedKeys={[secPath]} mode="inline" items={items1} />
}
