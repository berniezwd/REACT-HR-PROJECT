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
      state.infos = {}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateTokenAction.fulfilled, (state, action: Record<string, any>) => {
      state.infos = action.payload.infos // 在这里同步修改state的值
    })
  },
})

// 异步action -> 登录
export const loginAction = createAsyncThunk('user/loginAction', async (payload: LoginPayload) => {
  const res = await http.post('/users/login', payload, { method: 'post' })
  return res
})
// 异步action -> 1.更新token 2.获取用户信息后 3.最后更新用户信息
export const updateTokenAction = createAsyncThunk('user/updateTokenAction', async (token?: string) => {
  if (token) {
    updateToken(token)
  }
  const res = await http.get('/users/infos')
  return res
})

export const { clearToken, updateInfos, updateToken } = userSlice.actions
export default userSlice.reducer
