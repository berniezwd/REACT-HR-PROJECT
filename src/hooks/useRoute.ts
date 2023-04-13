import { matchRoutes, useLocation, useSearchParams } from 'react-router-dom'
import { routes } from '../router/index'
const useRoute = () => {
  const localtion = useLocation()
  const matchRoute = matchRoutes(routes, localtion)
  const [searchParams, setSearchParams] = useSearchParams()
  return {
    localtion,
    matchRoute,
    searchParams,
    setSearchParams,
  }
}
export default useRoute
