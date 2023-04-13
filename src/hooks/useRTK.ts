import { useAppDispatch } from '../store'
import { clearToken, updateToken } from '../store/modules/user'

const useRTK = () => {
  const dispatch = useAppDispatch()
  const clearTokenAction = () => {
    dispatch(clearToken())
  }
  const updateTokenAction = (token: string) => {
    dispatch(updateToken(token))
  }
  return {
    dispatch,
    clearTokenAction,
    updateTokenAction,
  }
}
export default useRTK
