import { useLocation, matchRoutes, Navigate } from 'react-router-dom'
import { routes } from '../router'
interface BeforeEachProps {
  children?: React.ReactNode
}
export default function BeforeEach(props: BeforeEachProps) {
  const location = useLocation()
  const matchedRoutes = matchRoutes(routes, location)
  if (matchedRoutes) {
    const meta = matchedRoutes[matchedRoutes?.length - 1].route.meta
    // console.log('meta', meta)
    // if (meta?.auth) {
    //   return <Navigate to="/login" />
    // }
  }
  return <>{props.children}</>
}
