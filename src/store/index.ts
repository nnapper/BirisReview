import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from './listenerMiddleware'
import authReducer from '../features/auth/authSlice'
import pdfReducer from '../features/pdf/pdfSlice'
import { authApi } from '../features/auth/authApi'
import { pdfApi } from '../features/pdf/pdfApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pdf: pdfReducer,
    [authApi.reducerPath]: authApi.reducer,
    [pdfApi.reducerPath]: pdfApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware)
    .concat(authApi.middleware)
    .concat(pdfApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store