import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import http from '../../utils/http'

export interface Infos {
  [index: string]: unknown
}
type CheckState = {
  applyList: Infos[]
  checkList: Infos[]
}

type GetApply = {
  applicantid?: string
  approverid?: string
}
export type PostApply = {
  applicantid: string
  applicantname: string
  approverid: string
  approvername: string
  note: string
  reason: string
  time: [string, string]
}

type PutApply = {
  _id: string
  state: '已通过' | '未通过'
}

const checkSlice = createSlice({
  name: 'checks',
  initialState: {
    applyList: [],
    checkList: [],
  } as CheckState,
  reducers: {
    updateapplyList(state, action: PayloadAction<Infos[]>) {
      state.applyList = action.payload
    },
    updatecheckList(state, action: PayloadAction<Infos[]>) {
      state.checkList = action.payload
    },
  },
})

// 异步action -> 获取审批列表
export const getApplyAction = createAsyncThunk('checks/getApplyAction', async (payload: GetApply) => {
  const res = await http.get('/checks/apply', payload, { method: 'get' })
  return res
})

// 异步action -> 更新打卡信息
export const postApplyAction = createAsyncThunk('checks/postApplyAction', async (payload: PostApply) => {
  const res = await http.post('/checks/apply', payload, { method: 'post' })
  return res
})

// 异步action -> 更新打卡信息
export const putApplyAction = createAsyncThunk('checks/putApplyAction', async (payload: PutApply) => {
  const res = await http.put('/checks/apply', payload, { method: 'put' })
  return res
})

export const { updateapplyList, updatecheckList } = checkSlice.actions
export default checkSlice.reducer
