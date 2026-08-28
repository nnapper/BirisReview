import { Button, Center, Text, Textarea } from '@mantine/core'
import { PaperPlaneRightIcon, XCircleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useDetailsQuery } from '../features/bridgeApi'
import { useRejectDocMutation } from '../features/doc/docApi'

export const Rejection = (props: {
  brKey: string
  docId: number
  fileName: string
  handleCancel: () => void
}) => {
  const { brKey, docId, fileName, handleCancel } = props

  const { data: vm } = useDetailsQuery(brKey)

  const abme = vm?.assignedAbme.abmeEmail || 'Loading email'
  const supervisor = vm?.assignedAbme.supervisorEmail || 'Loading email'

  const [toContacts, setToContacts] = useState<string>('')
  const [ccContacts, setCcContacts] = useState<string>('')
  const [body, setBody] = useState<string>('')

  useEffect(() => {
    setToContacts(abme)
    setCcContacts(supervisor)
  }, [abme, supervisor])

  const [reject] = useRejectDocMutation()

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
        <Button
          onClick={() => {
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
          }}
          disabled={body === ''}
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
