import {
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react"
import { appAuth, bmapServer, httpHeaderSecurity } from "../config"

type Abme = {
  brKey: string
  abme: string
  abmeEmail: string
  supervisor: string
  supervisorEmail: string
}

type DetailsReturn = {
  info: Object
  assignedAbme: Abme
  abme: Object
  uw: Object
  rails: Object[]
  photos: Object[]
  health: Object
  projects: Object[]
}

export const bridgeApi = createApi({
  reducerPath: 'bridgeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: bmapServer + '/api',
    prepareHeaders: (headers) => { 
      const token = localStorage.getItem(appAuth) ?? ''
      headers.set(httpHeaderSecurity, token)
    }
  }),
  endpoints: builder => ({
    details: builder.query<DetailsReturn, string>({
      query: brKey => { 
        return {
          url: `/bridge/details?b=${brKey}`
        }
      }
    })
  })
})

export const { useDetailsQuery } = bridgeApi