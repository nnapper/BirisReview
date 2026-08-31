import { useState } from 'react'
import { formatOraDate } from '../../utils/ctutils'
import { Button, Grid, GridCol } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'

export const EditableCalendar = ({
  value,
  label,
  onSave,
  onCancel,
  validate,
}: EditableFieldProps) => {
  const [date, setDate] = useState<string | null>(value)

  return (
    <Grid>
      <GridCol span={4}>{label}</GridCol>
      <GridCol span={6}>
        <DatePickerInput
          value={date}
          onChange={setDate}
          valueFormat="DD-MMM-YYYY"
        />
      </GridCol>
      <GridCol span={2}>
        <Button
          onClick={() => {
            onSave(formatOraDate(date))
          }}
          disabled={!date || !validate(date.toString())}
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
