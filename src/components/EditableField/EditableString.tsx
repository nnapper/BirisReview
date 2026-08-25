import { Button, Grid, GridCol, TextInput } from '@mantine/core'
import { useState } from 'react'

export const EditableString = ({
  value,
  label,
  onSave,
  onCancel,
  validate,
}: EditableFieldProps) => {
  const [v, setV] = useState<string>(value)

  return (
    <Grid>
      <GridCol span={4}>{label}</GridCol>
      <GridCol span={6}>
        <TextInput
          value={v}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setV(e.target.value)
          }
        />
      </GridCol>
      <GridCol span={2}>
        <Button onClick={() => onSave(v)} disabled={!validate(v)}>
          Save
        </Button>
        <Button bg="gray" onClick={onCancel}>
          Cancel
        </Button>
      </GridCol>
    </Grid>
  )
}
