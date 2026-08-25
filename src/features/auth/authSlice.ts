import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  userName: null,
  id: -1
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      console.log('Logout')
      state.token = null
    },
    setAuthUser: (state, action) => {
      state.token = action.payload.token
      // decrypt token
    },
  }
})

export const { logout, setAuthUser } = authSlice.actions
export default authSlice.reducer
