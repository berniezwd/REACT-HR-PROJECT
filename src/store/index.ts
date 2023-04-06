import { AnyAction, Reducer, configureStore } from '@reduxjs/toolkit'
import userSlice, { UserState } from './modules/user'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { useDispatch } from 'react-redux'
import { PersistPartial } from 'redux-persist/es/persistReducer'

// 持久化的一些配置
const persistConfig = {
  key: 'user', // 这里的命名，会成为localstorage中的 "persist:user"
  version: 1,
  storage,
  whitelist: ['token'], // 字段白名单，意思是只持久化counter这个字段
}

const store = configureStore({
  reducer: {
    user: persistReducer(persistConfig, userSlice) as Reducer<UserState & PersistPartial, AnyAction>,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
persistStore(store)

export default store
