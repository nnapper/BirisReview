import { Button, Center, Text, Textarea } from '@mantine/core'
import { PaperPlaneRightIcon, XCircleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useDetailsQuery } from '../bridgeApi'
import { useRejectDocMutation } from './docApi'
import { notifications } from '@mantine/notifications'

const DocRejection = (props: {
  brKeys: string[]
  docId: number
  fileName: string
  handleCancel: () => void
}) => {
  const { brKeys, docId, fileName, handleCancel } = props

  const [index, setIndex] = useState<number>(0)
  const { data: vm } = useDetailsQuery(brKeys[index])

  const [toContacts, setToContacts] = useState<string>('')
  const [ccContacts, setCcContacts] = useState<string>('')
  const [body, setBody] = useState<string>('')

  const [reject] = useRejectDocMutation()

  useEffect(() => {
    if (vm == null || vm.assignedAbme == null) {
      if (index < brKeys.length - 1) setIndex(index + 1)
      return
    }

    setToContacts(vm.assignedAbme.abmeEmail)
    setCcContacts(vm.assignedAbme.supervisorEmail)
  }, [vm])

  const handleReject = async () => {
    try {
      reject({
        email: {
          from: 'testing',
          toContacts: toContacts.split(/[,;\s]/),
          ccContacts: ccContacts.split(/[,;\s]/),
          subject: `Biris Rejection ${fileName}`,
          body,
        },
        docId,
      })
      handleCancel()
      notifications.show({
        title: `${docId} rejected successfully`,
        message: `Doc ${docId} has been approved`,
        position: 'top-center',
        color: 'green',
      })
    } catch (err) {
      notifications.show({
        title: `${err}`,
        message: `Something went wrong when trying to reject doc ${docId}, please reach out to andrew.ao@dot.ca.gov`,
        position: 'top-center',
        color: 'red',
      })
    }
  }

  return (
    <div className="email">
      <Textarea
        label="To"
        value={toContacts}
        onChange={e => setToContacts(e.currentTarget.value)}
        minRows={1}
        autosize
        placeholder="loading..."
      />
      <Textarea
        label="Cc"
        value={ccContacts}
        onChange={e => setCcContacts(e.currentTarget.value)}
        minRows={1}
        autosize
        placeholder="cc email address..."
      />
      <Text mt="sm" size="md">
        Subject: Biris {fileName}
      </Text>
      <Textarea
        value={body}
        onChange={e => setBody(e.currentTarget.value)}
        placeholder="Reason for rejection"
        autosize
        minRows={10}
        maxRows={20}
        error={body === ''}
      />
      <Center>
        <Button
          onClick={handleReject}
          disabled={body === '' || toContacts.trim().length === 0}
        >
          Send <PaperPlaneRightIcon />
        </Button>
        <Button bg="#495057" onClick={handleCancel}>
          Cancel <XCircleIcon />
        </Button>
      </Center>
    </div>
  )
}

export default DocRejection
