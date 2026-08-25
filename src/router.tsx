import { createBrowserRouter, redirect } from 'react-router'
import App from './App'
import { Login } from './features/auth/Login'
import type { AppStore } from './store'
import { PdfApproval } from './features/pdf/PdfApproval'

export const router = (store: AppStore) => {
  const checkLoggedIn = () => {
    const token = store.getState().auth.token
    if (!token) {
      console.log('redirected to login')
      return redirect('/login')
    }
    return null
  }

  return createBrowserRouter([
    {
      path: '/',
      element: <App />,
      loader: checkLoggedIn,
      children: [{ path: 'pdf', element: <PdfApproval /> }],
    },
    {
      path: '/login',
      element: <Login />,
    },
  ])
}
