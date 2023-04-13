import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import http from '../../utils/http'

export interface Infos {
  [index: string]: unknown
}
export type SignState = {
  signInfos: Infos
}

type Time = {
  userid: string
}

const signsSlice = createSlice({
  name: 'signs',
  initialState: {
    signInfos: {},
  } as SignState,
  reducers: {
    updateInfos(state, action: PayloadAction<Infos>) {
      state.signInfos = action.payload
    },
  },
})

// 异步action -> 获取打卡信息
export const getTimeAction = createAsyncThunk('signs/getTimeAction', async (payload: Time) => {
  const res = await http.get('/signs/time', payload, { method: 'get' })
  return res
})

// 异步action -> 更新打卡信息
export const putTimeAction = createAsyncThunk('signs/putTimeAction', async (payload: Time) => {
  const res = await http.put('/signs/time', payload, { method: 'put' })
  return res
})

export const { updateInfos } = signsSlice.actions
export default signsSlice.reducer
