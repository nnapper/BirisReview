import { useState } from 'react'
import { AssetSelection } from './AssetSelection'
import { Button, Grid, GridCol } from '@mantine/core'

export const EditableBrKey = ({
  value,
  label,
  onSave,
  onCancel,
  validate,
}: EditableFieldProps) => {
  const [v, setV] = useState<string>(value || '')

  return (
    <Grid key={value}>
      <GridCol span={4}>
        <span>{label}:</span>
      </GridCol>
      <GridCol span={6}>
        <AssetSelection brKey={v} onSelected={e => setV(e)} />
      </GridCol>
      <GridCol span={2}>
        <Button onClick={() => onSave(v)} disabled={!validate(v)}>
          Save
        </Button>
        <Button bg="#495057" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          bg="red"
          onClick={() => {
            onSave(null)
          }}
        >
          Delete
        </Button>
      </GridCol>
    </Grid>
  )
}
