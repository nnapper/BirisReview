import { createBrowserRouter, redirect } from 'react-router'
import App from './App'
import { Login } from './features/auth/Login'
import type { AppStore } from './store'
import { DocApproval } from './features/doc/DocApproval'

export const router = (store: AppStore) => {
  const checkLoggedIn = () => {
    const token = store.getState().auth.token
    if (!token) return redirect('/login')
  }

  return createBrowserRouter([
    {
      path: '/',
      element: <App />,
      loader: checkLoggedIn,
      children: [{ path: 'pdf', element: <DocApproval /> }],
    },
    {
      path: '/login',
      element: <Login />,
    },
  ])
}
