import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

type AuthState = {
  token: string | null
  username: string | null
  id: number
}

const initialState: AuthState = {
  token: null,
  username: null,
  id: -1
}

type TokenInfo = {
  snumber: string
  name: string
  id: number
  lastChecked: number
  exp: number
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null
    },
    setAuthUser: (state, action) => {
      state.token = action.payload.token
      const { name: username, id } = jwtDecode(state.token ?? '') as TokenInfo
      state.username = username
      state.id = id
    },
  }
})

export const { logout, setAuthUser } = authSlice.actions
export default authSlice.reducer
