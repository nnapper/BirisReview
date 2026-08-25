import { Button } from '@mantine/core'
import {
  pdfApi,
  useFetchPdfsQuery,
  useLoadPdfQuery,
  useUpdateDocBridgesFieldMutation,
  useUpdateDocFieldMutation,
} from './pdfApi'
import { useDispatch, useSelector } from 'react-redux'
import {
  approvePdf,
  updatePdf,
  type BirisFileInfo,
  incrementIndex,
  rejectPdf,
} from './pdfSlice'
import type { RootState } from '../../store'
import { skipToken } from '@reduxjs/toolkit/query'
import { BirisAdminEdit } from '../../components/BirisAdminEdit/BirisAdminEdit'
import { formatOra2Date } from '../../utils/ctutils'

// TODO: SET UP GRID FOR BIRIS ADMIN EDIT

type PdfViewerProps = {
  url: string | undefined
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  return !url ?
      <div className="pdf-viewer">Loading PDF....</div>
    : <iframe src={url} width="100%" height="100%" />
}

export const PdfApproval = () => {
  const { data: pdfs } = useFetchPdfsQuery()
  const index = useSelector((state: RootState) => state.pdf.index)

  console.log('list of pdfs is', pdfs)

  const pdf =
    pdfs && pdfs.length != 0 && index < pdfs.length ? pdfs[index] : null
  const { data: url } = useLoadPdfQuery(pdf ? pdf.docId : skipToken)

  const dispatch = useDispatch()
  const changePdf = (increment: number) => {
    console.log(`index vs increment: ${index} vs ${increment}`)
    dispatch(incrementIndex({ increment }))
  }

  const [updateDocField] = useUpdateDocFieldMutation()
  const pushPdfUpdates = async () => {
    // pdf should always be not null when this is called
    // @ts-ignore
    const docId = pdf.docId

    // @ts-ignore
    for (const [field, value] of Object.entries(pdf)) {
      if (Object.prototype.hasOwnProperty.call(pdf, field)) {
        let transformedValue: string
        if (field === 'pageCount') {
          transformedValue = ''
        } else if (field === 'createdDate') {
          transformedValue = formatOra2Date(value + '')
        } else {
          transformedValue = value + ''
        }
        try {
          await updateDocField({
            docId,
            field,
            value: transformedValue,
          })
        } catch (err) {
          console.log('pdf update err', err)
        }
      }
    }
  }

  const approve = async () => {
    await pushPdfUpdates()
    dispatch(approvePdf())
  }
  const reject = () => {
    dispatch(rejectPdf())
  }

  const handleUpdateDoc = (field: keyof BirisFileInfo, value: string) => {
    dispatch(
      updatePdf({
        index,
        field,
        value,
      }),
    )
  }

  const [updateDocBridgeField] = useUpdateDocBridgesFieldMutation()
  const handleUpdateDocBridge = async (
    oldBrKey: string | null,
    value: string | null,
  ) => {
    if (oldBrKey == value) return

    if (oldBrKey == null && pdf != null && value != null) {
      const i = pdf.brKeys.indexOf(value)
      if (i > -1) return
    }

    try {
      const updatedPdf = await updateDocBridgeField({
        // @ts-ignore
        docId: pdf.docId,
        oldBrKey: oldBrKey + '',
        value: value + '',
      }).unwrap()
      // @ts-ignore
      Object.assign(pdf, updatedPdf)
    } catch (err) {
      console.log(err)
    }
  }
  const onLoading = (loading: { src: string; message: string | null }) => {}

  return (
    <div className="pdf-approval">
      {!pdf && <div>No pdfs left to approve</div>}
      {pdf && (
        <BirisAdminEdit
          docInfo={pdf}
          reportTypes={[]}
          handleUpdateDoc={handleUpdateDoc}
          handleUpdateDocBridge={handleUpdateDocBridge}
          onLoading={onLoading}
        />
      )}
      {pdf && (
        <div className="pdf-viewer">
          <PdfViewer url={url} />
          <Button
            bg="gray"
            // @ts-ignore if pdf exists so does pdfs
            disabled={pdfs.length == 1}
            onClick={() => {
              changePdf(-1)
            }}
          >
            Previous
          </Button>
          <Button
            bg="gray"
            onClick={() => {
              changePdf(1)
            }}
          >
            Next/Skip
          </Button>
          <Button
            disabled={
              // @ts-ignore
              pdfs.length == 0
            }
            onClick={approve}
          >
            Approve
          </Button>
          <Button
            bg="red"
            disabled={
              // @ts-ignore
              pdfs.length == 0
            }
            onClick={reject}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}
