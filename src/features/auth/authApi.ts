import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { adminUserGroup, adServer, userAuth, httpHeaderSecurity } from '../../config'

type AuthenticateParams = {
  snumber: string
  password: string
  app: string
}

type AuthenticateReturn = {
  token: string
}

type BelongsReturn = {
  group: string
  snumber: string
  token: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: adServer + '/api/user',
  }),
  endpoints: builder => ({
    authenticate: builder.mutation<AuthenticateReturn, AuthenticateParams>({
      query: user => {
        return {
          url: '/authenticate',
          method: 'POST',
          body: user,
        }
      },
    }),
    belongs: builder.query<BelongsReturn, void>({
      query: () => {
        const token = localStorage.getItem(userAuth) ?? ''
        return {
          url: '/belongs?group=' + adminUserGroup,
          headers: { [httpHeaderSecurity]: token },
        }
      },
    }),
  }),
})

export const {
  useAuthenticateMutation,
  useLazyBelongsQuery
} = authApi
