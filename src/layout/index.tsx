import { Layout, theme } from 'antd'
import './components/layout.less'
import LayoutHeader from './components/layoutHeader'
import LayoutBreadcurmb from './components/layoutBreadcurmb'
import LayoutAside from './components/layoutAside'
import LayoutContent from './components/layoutContent'

const { Header, Content, Sider } = Layout

export default function Home() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <Layout>
      <Header className="header">
        <LayoutHeader />
      </Header>
      <Layout>
        <Sider width={240} theme={'light'}>
          <LayoutAside />
        </Sider>
        <Layout style={{ padding: '15px' }}>
          <LayoutBreadcurmb />
          <Content
            style={{
              padding: 18,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}>
            <LayoutContent />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
