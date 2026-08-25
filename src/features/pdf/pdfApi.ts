import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { appAuth, appServer } from '../../config'
import type { BirisFileInfo } from './pdfSlice'
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



type UpdateDocBridgesFieldParams = {
  docId: number
  oldBrKey: string
  value: string
}

export const pdfApi = createApi({
  reducerPath: 'pdfApi',
  baseQuery: fetchBaseQuery({
    baseUrl: appServer + '/api',
    prepareHeaders: (headers) => { 
      const token = localStorage.getItem(appAuth) ?? ''
      headers.set('x-access-token', '' + token)
    },
  }),
  endpoints: builder => ({
    fetchPdfs: builder.query<BirisFileInfo[], void>({
      query: () => {
        return {
          url: '/admin/docsToBeReviewed',
        }
      },
    }),
    loadPdf: builder.query<string, number>({
      query: (docId) => { 
        return {
          url: `/biris/pdfByIdForAdmin?id=${docId}`,
          responseHandler: (response) => response.blob()
        }
      },
      transformResponse: (response: Blob) => { 
        return URL.createObjectURL(response)
      },
    }),
    checkInspKey: builder.query<boolean, CheckInspKeyParams>({
      query: (vm) => { 
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
    search: builder.query<AssetInfo[], SearchParams>({
      query: (brKey) => { 
        return {
          url: `/docparams/search?b=${brKey.query}`,
        }
      }
    }),
    updateDocField: builder.mutation<DocDescriptorVM, UpdateDocFieldParams>({
      query: (vm) => { 
        return {
          url: '/admin/updateDocField',
          method: 'POST',
          body: vm
        }
      }
    }),
    updateDocBridgesField: builder.mutation<DocDescriptorVM, UpdateDocBridgesFieldParams>({
      query: (vm) => { 
        return {
          url: '/admin/updateDocBridgesField',
          method: 'POST',
          body: vm
        }
      }
    }),
  }),
})

export const {
  useFetchPdfsQuery,
  useLoadPdfQuery,
  useDocTypesQuery,
  useLazyCheckInspKeyQuery,
  useLazySearchQuery,
  useUpdateDocFieldMutation,
  useUpdateDocBridgesFieldMutation
} = pdfApi
