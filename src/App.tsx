import { Outlet } from 'react-router-dom'
import BeforeEach from './components/BeforeEach'
function App() {
  return <BeforeEach>{<Outlet></Outlet>}</BeforeEach>
}
export default App
