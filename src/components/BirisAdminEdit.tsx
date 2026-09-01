import { EditableField } from './EditableField'
import { useEffect, useState } from 'react'
import { formatOraDate } from '../utils/ctutils'
import {
  useLazyCheckInspKeyQuery,
  type CheckInspKeyParams,
  type BirisFileInfo,
} from '../features/doc/docApi'
import { Alert, Flex, Grid, GridCol, Text } from '@mantine/core'
import { WarningIcon } from '@phosphor-icons/react'
import { LinkBridgeField } from './EditableField/LinkBridgeField'

interface BirisAdminEditProps {
  docInfo: BirisFileInfo
  reportTypes: number[]
  handleUpdateDoc: (field: keyof BirisFileInfo, value: string) => void
  handleUpdateDocBridge: (oldBrKey: string | null, value: string | null) => void
}

export const BirisAdminEdit = (props: BirisAdminEditProps) => {
  const {
    docId,
    docTypeId,
    dirId,
    brKeys,

    contractNum,
    pageDesc,
    pageNum,
    filename,
    docDate,
    pageCount,
    pageSuffix,
    inspKey,
    createdDate,
  } = props.docInfo

  const { handleUpdateDoc, handleUpdateDocBridge, reportTypes } = props
  const [inspKeyMessage, setInspKeyMessage] = useState('')
  const [tooManyBridgesTypeIdError, setTooManyBridgesTypeIdError] = useState('')

  const [checkInspKeyQuery] = useLazyCheckInspKeyQuery()
  const checkInspKey = async (vm: CheckInspKeyParams) => {
    try {
      const data = await checkInspKeyQuery(vm).unwrap()

      setInspKeyMessage(data ? 'matched' : 'not matched')
    } catch (err) {
      console.log('checkInspKey err', err)
    }
  }

  useEffect(() => {
    setTooManyBridgesTypeIdError(
      reportTypes.includes(docTypeId) && brKeys.length > 1 ?
        'One bridge should be linked to Inspection Report'
      : '',
    )

    console.log(
      'why does this not work',
      reportTypes.includes(docTypeId),
      inspKey ? inspKey.length > 0 : 'inspKey null',
    )

    if (
      reportTypes.includes(docTypeId) &&
      inspKey != null &&
      inspKey.length > 0
    ) {
      checkInspKey({
        inspDate: formatOraDate(docDate),
        brKey: brKeys[0],
        inspKey,
      })
    } else {
      setInspKeyMessage('not checked')
    }
  }, [docTypeId, docDate, brKeys, inspKey])

  const cvalues = [
    docId + '',
    dirId + '',
    filename,
    contractNum, //3
    pageDesc,
    pageNum + '',
    pageCount + '', //6
    pageSuffix,
    docTypeId + '',
    formatOraDate(createdDate),
  ]
  const cupdateFields = [
    null,
    null,
    null,
    'contractNum', //3
    'pageDesc',
    'pageNum',
    'pageCount', //6
    'pageSuffix',
    'docTypeId',
    null,
  ]
  const clabels = [
    'Document ID',
    'Directory ID',
    'File Name',
    'Contract Num', //3
    'Page Description',
    'Page Number',
    'Page Count', //6
    'Page Suffix',
    'Document Type',
    'Created Date',
  ]
  const ctypes = [
    'readonly',
    'readonly',
    'readonly',
    'string', //3
    'string',
    'string',
    'string', //6
    'string',
    'docType',
    'readonly',
  ]

  return (
    <div className="biris-admin-edit">
      <div>
        {cvalues.map((_, i) => (
          <EditableField
            key={i}
            value={cvalues[i] || ''}
            label={clabels[i]}
            dataType={ctypes[i]}
            handleUpdate={newVal => {
              if (cupdateFields[i] != null)
                // @ts-ignore
                handleUpdateDoc(cupdateFields[i], newVal)
            }}
          />
        ))}
        <div>
          <EditableField
            value={docDate}
            label="Document Date"
            dataType="calendar"
            handleUpdate={newVal => {
              // @ts-ignore
              handleUpdateDoc('docDate', newVal, docId)
            }}
          />
        </div>
        {reportTypes.includes(docTypeId) && (
          <EditableField
            value={inspKey || ''}
            label="Inspection Key"
            dataType="string"
            handleUpdate={newVal =>
              handleUpdateDoc('inspKey', newVal?.toUpperCase() || '')
            }
          />
        )}
        <Flex>
          {reportTypes.includes(docTypeId) &&
            (inspKeyMessage === 'matched' ?
              <Text bg="#d3f9d8" c="#2b8a3e" w="100%">
                Inspection Date and InspKey match
              </Text>
            : <Text bg="#ffe3e3" c="#c92a2a" w="100%">
                Inspection Date and InspKey do not match
              </Text>)}
        </Flex>
      </div>
      <h2>Assets Linked</h2>
      <div>
        {tooManyBridgesTypeIdError !== '' && (
          <Flex>
            <Text bg="#ffe3e3" c="#c92a2a" w="100%">
              Bridge Report should only be linked to 1 bridge.
            </Text>
          </Flex>
        )}

        {brKeys.length === 0 && (
          <Alert
            variant="light"
            color="red"
            withCloseButton
            title="Alert title"
            icon={<WarningIcon />}
          >
            No bridge is linked to the document
          </Alert>
        )}
      </div>
      <Grid>
        {brKeys.map((brKey: string) => (
          <GridCol key={brKey}>
            <EditableField
              value={brKey}
              label="Asset ID"
              dataType="brKey"
              handleUpdate={newVal => {
                handleUpdateDocBridge(brKey, newVal)
              }}
            />
          </GridCol>
        ))}
        <GridCol>
          <LinkBridgeField handleUpdate={e => handleUpdateDocBridge(null, e)} />
        </GridCol>
      </Grid>
    </div>
  )
}
