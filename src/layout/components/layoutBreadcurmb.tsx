import { Breadcrumb } from 'antd'
import './layout.less'
import { useRoute } from '../../hooks'

export default function layoutBreadcurmb() {
  const { matchRoute } = useRoute()
  const items = matchRoute?.map((item) => {
    return {
      href: item.pathnameBase,
      title: item.route.meta?.title,
    }
  })
  return <Breadcrumb className="HomeBreadcurmb" items={items} />
}
