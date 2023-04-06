import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/reset.less'
import './assets/styles/iconfont.less'
import './assets/styles/common.less'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>,
    </Provider>
  </Suspense>,
)
