import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import http from '../../utils/http'
import { LoginPayload } from '../../utils/apis'

export interface UserState {
  token: string
  infos: {
    [key: string]: unknown
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: '',
    infos: {},
  } as UserState,
  reducers: {
    updateToken(state, action: PayloadAction<UserState['token']>) {
      state.token = action.payload
    },
    updateInfos(state, action: PayloadAction<UserState['infos']>) {
      state.infos = action.payload
    },
    clearToken(state) {
      state.token = ''
    },
  },
})

// 异步action -> 登录
export const loginAction = createAsyncThunk('user/loginAction', async (payload: LoginPayload) => {
  const res = await http.post('/users/login', payload, { method: 'post' })
  return res
})
// 异步action -> 获取用户信息
export const infosAction = createAsyncThunk('user/infosAction', async () => {
  const res = await http.get('/users/infos')
  return res
})

export const { clearToken, updateInfos, updateToken } = userSlice.actions
export default userSlice.reducer
