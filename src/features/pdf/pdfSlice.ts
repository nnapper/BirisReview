import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useUpdateDocFieldMutation } from './pdfApi'

export type BirisFileInfo = {
  docId: number
  dirId: number
  docTypeId: number

  filename: string
  pageDesc: string
  docDate: string
  createdDate: string
  pageNum: number
  pageCount: number
  pageSuffix: string
  contractNum: string
  snumber: string

  inspKey: string | null
  brKeys: string[]
}

type PdfState = {
  pdfs: BirisFileInfo[]
  index: number
}

const initialState: PdfState = {
  pdfs: [],
  index: 0,
}

type UpdatePdfPayload = {
  index: number
  field: keyof BirisFileInfo
  value: BirisFileInfo[keyof BirisFileInfo]
}

const updateValue = <TObj, F extends keyof TObj>(obj: TObj, field: F, value: TObj[F]) => {
  return {...obj, [field]: value}
}

const pdfSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPdfs: (state, action) => {
      state.pdfs = action.payload.pdfs
    },
    incrementIndex: (state, action) => { 
      const increment = action.payload.increment
      state.index += increment
      console.log('index is', state.index)
    },
    approvePdf: (state) => {
      if (!state.pdfs) return
      const updatedPdfs = state.pdfs
      updatedPdfs.splice(state.index, 1)
      state.pdfs = updatedPdfs
      // add api call for approval
      console.log('after approval is', updatedPdfs)
    },
    skipPdf: (state) => {
      if (!state.pdfs) return
      state.index++
      // if (state.index >= state.pdfs.length) state.index = 0
    },
    updatePdf: (state, action: PayloadAction<UpdatePdfPayload>) => {
      if (state.pdfs.length === 0) return
      const { index, field, value } = action.payload
      // @ts-ignore if field is docDate should not accept number
      state.pdfs[index] = updateValue(state.pdfs[index], field, value)
      console.log("updated field of", state.pdfs[index])
    },
    rejectPdf: (state) => { 
      if (!state.pdfs) return
      const updatedPdfs = state.pdfs
      updatedPdfs.splice(state.index, 1)
      state.pdfs = updatedPdfs
      // add api call for rejection
      console.log('after rejection is', state.pdfs)
    }
  }
})

export const { setPdfs, approvePdf, skipPdf, updatePdf, incrementIndex, rejectPdf } = pdfSlice.actions
export default pdfSlice.reducer
