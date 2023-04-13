import { useNavigate } from 'react-router-dom'
const useRouter = () => {
  const router = useNavigate()
  return {
    router,
  }
}
export default useRouter
