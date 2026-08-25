import { useState } from 'react'
import { DocTypeSelection3 } from './DocTypeSelection'
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
        <DocTypeSelection3
          docTypeId={+value}
          onSelected={newVal => setV(newVal != null ? newVal.id : -1)}
        />
      </GridCol>
      <GridCol span={2}>
        <Button
          onClick={() => {
            console.log('v is', v)
            onSave(v + '')
          }}
          disabled={!validate(v + '')}
        >
          Save
        </Button>
        <Button bg="#495057" onClick={onCancel}>
          Cancel
        </Button>
      </GridCol>
    </Grid>
  )
}
