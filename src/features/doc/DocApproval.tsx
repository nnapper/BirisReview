import { Button, ButtonGroup, Center, Text } from '@mantine/core'
import {
  useApproveDocMutation,
  useFetchDocsQuery,
  useLoadDocQuery,
  useReportDocTypesQuery,
  useUpdateDocBridgesFieldMutation,
  useUpdateDocFieldMutation,
  type BirisFileInfo,
} from './docApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { BirisAdminEdit } from '../../components/BirisAdminEdit'
import { useState } from 'react'
import { DocRejection } from './DocRejection'
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

  const { data: reportTypes } = useReportDocTypesQuery()
  const [updateDocField] = useUpdateDocFieldMutation()
  const [approveDoc] = useApproveDocMutation()
  // pdf should always be not null when this is called
  const approve = async () => {
    try {
      await approveDoc({
        // @ts-ignore
        docId: pdf.docId,
        field: 'pageCount',
        // @ts-ignore
        value: pdf.pageCount + '',
      })
      notifications.show({
        // @ts-ignore
        title: `${pdf.docId} approved successfully`,
        // @ts-ignore
        message: `Doc ${pdf.docId} has been approved`,
        position: 'top-center',
        color: 'green',
      })
    } catch (err) {
      notifications.show({
        title: `${err}`,
        message: `Something went wrong when trying to approve the doc, please reach out to andrew.ao@dot.ca.gov`,
        position: 'top-center',
        color: 'red',
      })
    }
  }

  const [draftEmail, setDraftEmail] = useState<boolean>(false)
  const reject = () => setDraftEmail(true)

  // pdf should always be not null when this is called
  const handleUpdateDoc = async (field: keyof BirisFileInfo, value: string) => {
    console.log(`updating doc field: ${field} with the value ${value}`)
    try {
      await updateDocField({
        // @ts-ignore
        docId: pdf.docId,
        field,
        value,
      }).unwrap()
      notifications.show({
        title: `${field} updated successfully`,
        // @ts-ignore
        message: `Doc ${pdf.docId}'s ${field} is now ${value}`,
        position: 'top-center',
        color: 'green',
      })
    } catch (err) {
      notifications.show({
        title: `${err}`,
        message: `Something went wrong when trying to update ${field}. please reach out to andrew.ao@dot.ca.gov`,
        position: 'top-center',
        color: 'red',
      })
    }
  }

  const [updateDocBridgeField] = useUpdateDocBridgesFieldMutation()
  const handleUpdateDocBridge = async (
    oldBrKey: string | null,
    value: string | null,
  ) => {
    if (oldBrKey == value) return

    // check if a new bridge is already linked when adding a new bridge
    if (!oldBrKey && value) {
      // @ts-ignore
      const i = pdf.brKeys.indexOf(value)
      console.log('key already there?', i)
      if (i > -1) return
    }

    try {
      await updateDocBridgeField({
        // @ts-ignore
        docId: pdf.docId,
        oldBrKey,
        value,
      }).unwrap()
      notifications.show({
        title: 'Doc bridges updated successfully',
        message:
          value ?
            oldBrKey ? `Updated the bridge key ${oldBrKey} to ${value}`
            : `Added the bridge key ${value} to the doc`
          : `Bridge key ${oldBrKey} was deleted from the doc`,
        position: 'top-center',
        color: 'green',
      })
    } catch (err) {
      notifications.show({
        title: `${err}`,
        message:
          'Something went wrong when trying to link an asset, please reach out to andrew.ao@dot.ca.gov',
        position: 'top-center',
        color: 'red',
      })
    }
  }

  return (
    <div className="pdf-approval">
      {!pdf && <div>No pdfs left to approve</div>}
      {pdf && (
        <>
          <BirisAdminEdit
            docInfo={pdf}
            reportTypes={reportTypes ?? []}
            handleUpdateDoc={handleUpdateDoc}
            handleUpdateDocBridge={handleUpdateDocBridge}
          />
          <div className="pdf-viewer">
            {draftEmail && (
              <DocRejection
                brKeys={pdf.brKeys}
                docId={pdf.docId}
                fileName={pdf.filename}
                handleCancel={() => setDraftEmail(false)}
              />
            )}
            <PdfViewer url={url} />
            {!draftEmail && (
              <div>
                <Text>
                  Reviewing {index + 1} / {pdfs?.length}
                </Text>
                <Center>
                  <ButtonGroup>
                    <Button
                      bg="#495057"
                      // @ts-ignore if pdf exists so does pdfs
                      disabled={index === 0 || pdfs.length == 1}
                      onClick={() => setIndex(index - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      bg="#495057"
                      onClick={() => setIndex(index + 1)}
                      // @ts-ignore
                      disabled={index === pdfs.length - 1}
                    >
                      Next
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
                  </ButtonGroup>
                </Center>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
