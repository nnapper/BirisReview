import { Notification } from '@mantine/core'
import { CheckIcon } from '@phosphor-icons/react'

export const RejectToaster = (props: { docId: string }) => {
  return (
    <Notification icon={<CheckIcon size={20} />} color="green">
      Doc {props.docId} rejected successfully
    </Notification>
  )
}
