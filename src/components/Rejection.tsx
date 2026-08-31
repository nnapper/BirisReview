import { Button, Center, Text, Textarea } from '@mantine/core'
import { PaperPlaneRightIcon, XCircleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useDetailsQuery } from '../features/bridgeApi'
import { useRejectDocMutation } from '../features/doc/docApi'
import { notifications } from '@mantine/notifications'

export const Rejection = (props: {
  brKeys: string[]
  docId: number
  fileName: string
  handleCancel: () => void
}) => {
  const { brKeys, docId, fileName, handleCancel } = props

  const [index, setIndex] = useState<number>(0)
  const { data: vm } = useDetailsQuery(brKeys[index])

  const [toContacts, setToContacts] = useState<string>('Loading email')
  const [ccContacts, setCcContacts] = useState<string>('Loading email')
  const [body, setBody] = useState<string>('')

  useEffect(() => {
    if (vm && !vm.assignedAbme) setIndex(index + 1)
    else if (vm) {
      setToContacts(vm.assignedAbme.abmeEmail)
      setCcContacts(vm.assignedAbme.supervisorEmail)
    }
  }, [vm])

  const [reject] = useRejectDocMutation()

  const handleReject = async () => {
    try {
      reject({
        email: {
          from: 'testing',
          toContacts: toContacts.split(/[,;\s]/),
          ccContacts: ccContacts.split(/[,;\s]/),
          subject: `Biris ${fileName}`,
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
      />
      <Textarea
        label="Cc"
        value={ccContacts}
        onChange={e => setCcContacts(e.currentTarget.value)}
        minRows={1}
        autosize
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
        <Button onClick={handleReject} disabled={body === ''}>
          Send <PaperPlaneRightIcon />
        </Button>
        <Button bg="#495057" onClick={handleCancel}>
          Cancel <XCircleIcon />
        </Button>
      </Center>
    </div>
  )
}
