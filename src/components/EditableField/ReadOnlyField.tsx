import { Button, Grid, GridCol } from '@mantine/core'
import { PencilIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

export const ReadOnlyField = ({
  value,
  label,
  onEditing,
  children,
}: {
  value: string | null
  label: string
  onEditing?: () => void
  onCopy?: () => void
  children?: ReactNode
}) => {
  return (
    <Grid>
      <GridCol span={4}>{label}:</GridCol>
      <GridCol span={6}>
        {value} {children}
      </GridCol>
      <GridCol span={2}>
        {onEditing != null && (
          <Button onClick={onEditing}>
            <PencilIcon />
          </Button>
        )}
      </GridCol>
    </Grid>
  )
}
