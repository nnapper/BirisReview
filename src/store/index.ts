import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from './listenerMiddleware'
import authReducer from '../features/auth/authSlice'
import { authApi } from '../features/auth/authApi'
import { docApi } from '../features/doc/docApi'
import { bridgeApi } from '../features/bridgeApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [docApi.reducerPath]: docApi.reducer,
    [bridgeApi.reducerPath]: bridgeApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware)
    .concat(authApi.middleware)
    .concat(docApi.middleware)
    .concat(bridgeApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export const apiLoading = (state: RootState) => {
  const apiSlices = [
    state[docApi.reducerPath],
    state[bridgeApi.reducerPath],
    state[authApi.reducerPath],
  ]

  return apiSlices.some(api =>
    Object.values(api.queries).some(q => q?.status === 'pending') ||
    Object.values(api.mutations).some(m => m?.status === 'pending')
  )
}