import { useSelector } from 'react-redux'
import { RootState } from '../store'

type SelectorsType = {
  [key in SliceModuleNameType]: (state: RootState) => any // 以 key 为选择器的 value 的值类型
}

// 需要使用的变量名
type SliceModuleNameType = 'user' | 'sign' | 'infos' | 'token' | 'signInfos' | 'check' | 'applyList'
// 需要返回的变量对象
const selectors: SelectorsType = {
  user: (state) => state.user, // 返回 user
  sign: (state) => state.sign, // 返回 sign
  infos: (state) => state.user.infos, // 返回 infos
  token: (state) => state.user.token, // 返回 token (state.user.token）
  signInfos: (state) => state.sign.signInfos, // 返回 token (state.user.token）
  check: (state) => state.check,
  applyList: (state) => state.check.applyList,
}

const useSelect = (key: SliceModuleNameType): any => {
  if (!selectors[key]) {
    return useSelector((_: RootState) => selectors[key])
  }
  return useSelector((state: RootState) => selectors[key](state))
}

export default useSelect
