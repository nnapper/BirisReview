import { Button, Text } from '@mantine/core'
import {
  useApproveDocMutation,
  useFetchDocsQuery,
  useLoadDocQuery,
  useUpdateDocBridgesFieldMutation,
  useUpdateDocFieldMutation,
  type BirisFileInfo,
} from './docApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { BirisAdminEdit } from '../../components/BirisAdminEdit/BirisAdminEdit'
import { formatOra2Date } from '../../utils/ctutils'
import { useState } from 'react'
import { Rejection } from '../../components/Rejection'
import { RejectToaster } from '../../components/Toaster'
import { notifications } from '@mantine/notifications'

type PdfViewerProps = {
  url: string | undefined
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  return !url ?
      <div className="pdf-viewer">Loading PDF....</div>
    : <iframe src={url} width="100%" height="100%" />
}

export const DocApproval = () => {
  const { data: pdfs } = useFetchDocsQuery()
  const [index, setIndex] = useState<number>(0)

  const pdf =
    pdfs && pdfs.length != 0 && index < pdfs.length ? pdfs[index] : null
  const { data: url } = useLoadDocQuery(pdf ? pdf.docId : skipToken)

  const [updateDocField] = useUpdateDocFieldMutation()
  const [approveDoc] = useApproveDocMutation()
  // pdf should always be not null when this is called
  const approve = async () => {
    console.log('approved')
    try {
      await approveDoc({
        // @ts-ignore
        docId: pdf.docID,
        field: 'pageCount',
        // @ts-ignore
        value: pdf.pageCount + '',
      })
    } catch (err) {
      console.log('doc approval err', err)
    }
  }

  const [draftEmail, setDraftEmail] = useState<boolean>(false)
  const reject = () => {
    console.log('rejected')
    setDraftEmail(true)
  }

  // pdf should always be not null when this is called
  const handleUpdateDoc = async (field: keyof BirisFileInfo, value: string) => {
    console.log(`updating doc field: ${field} with the value ${value}`)
    let transformedValue: string
    if (field === 'createdDate') {
      transformedValue = formatOra2Date(value + '')
    } else {
      transformedValue = value + ''
    }
    try {
      const updatedDoc = await updateDocField({
        // @ts-ignore
        docId: pdf.docId,
        field,
        value: transformedValue,
      }).unwrap()
      console.log('updated doc should be', updatedDoc)
    } catch (err) {
      console.log(`doc update err for field ${field}: ${err}`)
    }
  }

  const [updateDocBridgeField] = useUpdateDocBridgesFieldMutation()
  const handleUpdateDocBridge = async (
    oldBrKey: string | null,
    value: string | null,
  ) => {
    if (oldBrKey == value) return

    if (oldBrKey == null && pdf != null && value != null) {
      const i = pdf.brKeys.indexOf(value)
      console.log('key already there?', i)
      if (i > -1) return
    }

    try {
      await updateDocBridgeField({
        // @ts-ignore
        docId: pdf.docId,
        oldBrKey: oldBrKey ? oldBrKey + '' : oldBrKey,
        value: value ? value + '' : value,
      }).unwrap()
    } catch (err) {
      console.log(err)
    }
  }

  notifications.show({
    title: 'Arrived at doc approval',
    message: 'User authorized',
  })

  return (
    <div className="pdf-approval">
      {!pdf && <div>No pdfs left to approve</div>}
      {pdf && (
        <div>
          <BirisAdminEdit
            docInfo={pdf}
            reportTypes={[]}
            handleUpdateDoc={handleUpdateDoc}
            handleUpdateDocBridge={handleUpdateDocBridge}
          />
          <RejectToaster docId="hllo" />
        </div>
      )}
      {pdf && (
        <div className="pdf-viewer">
          {draftEmail && (
            <Rejection
              brKey={pdf.brKeys[0]}
              docId={pdf.docId}
              fileName={pdf.filename}
              handleCancel={() => setDraftEmail(false)}
            />
          )}
          <PdfViewer url={url} />
          {!draftEmail && (
            <div>
              <Text>
                {index + 1} / {pdfs?.length}
              </Text>
              <Button
                bg="#495057"
                // @ts-ignore if pdf exists so does pdfs
                disabled={index === 0 || pdfs.length == 1}
                onClick={() => setIndex(index - 1)}
              >
                Previous
              </Button>
              <Button bg="#495057" onClick={() => setIndex(index + 1)}>
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
      )}
    </div>
  )
}
