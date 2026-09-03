import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { appAuth, appServer, httpHeaderSecurity } from '../../config'
import { serialize } from '../../utils/ctutils'

export type CheckInspKeyParams = {
  inspDate: string
  brKey: string
  inspKey: string
}

export type DocType = {
  id: number
  dscr: string
}

export type AssetInfo = {
  brKey: string
  type: string
  name: string
}

type SearchParams = {
  query: string
}

type UpdateDocFieldParams = {
  docId: number
  field: string
  value: string
}

type DocDescriptorVM = {
  brKeys: string[]
  contractNum: string
  dirId: string
  docDate: string
  docId: number
  docTypeId: number
  endDate: string
  filename: string
  inspKey: string
  pageCount: number | null
  pageDesc: string
  pageNum: number | null
  PageSuffix: string
  snumber: string
  createdDate: Date
}

export type BirisFileInfo = {
  brKeys: string[]
  contractNum: string

  dir: string
  dirId: number
  docId: number
  docTypeId: number

  filename: string
  pageDesc: string
  docDate: string
  createdDate: string
  pageNum: number
  pageCount: number
  pageSuffix: string
  snumber: string

  inspKey: string | null
}

type UpdateDocBridgesFieldParams = {
  docId: number
  oldBrKey: string | null
  value: string | null
}

type Email = {
  from: string
  toContacts: string[]
  ccContacts: string[]
  subject: string
  body: string
}

type RejectDocParams = {
  email: Email
  docId: number
}

export const docApi = createApi({
  reducerPath: 'docApi',
  baseQuery: fetchBaseQuery({
    baseUrl: appServer + '/api',
    prepareHeaders: (headers) => { 
      const token = localStorage.getItem(appAuth) ?? ''
      headers.set(httpHeaderSecurity, token)
    },
  }),
  tagTypes: ['docs'],
  endpoints: builder => ({
    fetchDocs: builder.query<BirisFileInfo[], void>({
      query: () => {
        return {
          url: '/admin/docsToBeReviewed',
        }
      },
      providesTags: ['docs'],
    }),
    loadDoc: builder.query<string, number>({
      query: docId => { 
        return {
          url: `/biris/pdfByIdForAdmin?id=${docId}`,
          responseHandler: (response) => response.blob()
        }
      },
      transformResponse: (blob: Blob) => { 
        return URL.createObjectURL(blob)
      },
      onCacheEntryAdded: async (_, { cacheDataLoaded, cacheEntryRemoved }) => {
        try {
          const { data: url } = await cacheDataLoaded
          console.log('cacheDataLoaded', url)
          await cacheEntryRemoved
          console.log('ready to remove URL', url)
          URL.revokeObjectURL(url)
        } catch (err) {
          console.log('error whhen disposing of blob', err)
        }
      },
    }),
    checkInspKey: builder.query<boolean, CheckInspKeyParams>({
      query: vm => { 
        return {
          url: `/docparams/checkInspKey?${serialize(vm)}`,
        }
      }
    }),
    docTypes: builder.query<DocType[], void>({
      query: () => { 
        return {
          url: '/docparams/docTypes',
        }
      }
    }),
    reportDocTypes: builder.query<number[], void>({
      query: () => { 
        return {
          url: '/docparams/reportDocTypes',
        }
      }
    }),    
    search: builder.query<AssetInfo[], SearchParams>({
      query: brKey => { 
        return {
          url: `/docparams/search?b=${brKey.query}`,
        }
      }
    }),
    updateDocField: builder.mutation<DocDescriptorVM, UpdateDocFieldParams>({
      query: vm => { 
        return {
          url: '/admin/updateDocFieldForApproval',
          method: 'POST',
          body: vm
        }
      },
      invalidatesTags: ['docs'],
    }),
    updateDocBridgesField: builder.mutation<DocDescriptorVM, UpdateDocBridgesFieldParams>({
      query: (vm) => { 
        return {
          url: '/admin/updateDocBridgesField',
          method: 'POST',
          body: vm
        }
      },
      invalidatesTags: ['docs'],
    }),
    approveDoc: builder.mutation<DocDescriptorVM, UpdateDocFieldParams>({
      query: (vm) => { 
        return {
          url: '/admin/updateDocField',
          method: 'POST',
          body: vm
        }
      },
      invalidatesTags: ['docs'],
    }),
    rejectDoc: builder.mutation<void, RejectDocParams>({
      query: vm => { 
        return {
          url: '/admin/rejectBiris',
          method: 'POST',
          body: vm
        }
      },
      invalidatesTags: ['docs'],
    })
  })
})

export const {
  useFetchDocsQuery,
  useLoadDocQuery,
  useDocTypesQuery,
  useReportDocTypesQuery,
  useLazyCheckInspKeyQuery,
  useLazySearchQuery,
  useUpdateDocFieldMutation,
  useUpdateDocBridgesFieldMutation,
  useApproveDocMutation,
  useRejectDocMutation
} = docApi
