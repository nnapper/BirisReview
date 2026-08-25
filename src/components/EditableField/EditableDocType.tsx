import { useState } from 'react'
import { DocTypeSelection2 } from './DocTypeSelection'
import { Button, Grid, GridCol } from '@mantine/core'

export const EditableDocType = ({
  value,
  label,
  onSave,
  onCancel,
  validate,
}: EditableFieldProps) => {
  const [v, setV] = useState<number>(+value)

  return (
    <Grid>
      <GridCol span={4}>{label}:</GridCol>
      <GridCol span={6}>
        <DocTypeSelection2
          docTypeId={+value}
          onSelected={newVal => setV(newVal != null ? newVal.id : -1)}
        />
      </GridCol>
      <GridCol span={2}>
        <Button
          onClick={() => {
            onSave(v + '')
          }}
          disabled={!validate(v + '')}
        >
          Save
        </Button>
        <Button bg="gray" onClick={onCancel}>
          Cancel
        </Button>
      </GridCol>
    </Grid>
  )
}
