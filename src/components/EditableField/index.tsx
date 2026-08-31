import { useState } from 'react'
import { EditableCalendar } from './EditableCalendar'
import { EditableString } from './EditableString'
import { EditableBrKey } from './EditableBrKey'
import { ReadOnlyField } from './ReadOnlyField'
import { EditableDocType } from './EditableDocType'

type EditableFieldProps = {
  value: string
  label: string
  dataType: string
  handleUpdate: (newVal: string | null) => void
  validate?: (newVal: string | null) => boolean | undefined
}

export const EditableField = (props: EditableFieldProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const { value, label, dataType, handleUpdate } = props
  const validate = props.validate == null ? () => true : props.validate

  const compProps = {
    value,
    label,
    onSave: (newVal: string | null) => {
      handleUpdate(newVal)
      setEditing(false)
    },
    onCancel: () => setEditing(false),
    validate,
  }

  return (
    <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
      {editing ?
        dataType === 'string' || dataType === 'number' ?
          <EditableString {...compProps} />
        : dataType === 'calendar' ?
          <EditableCalendar {...compProps} />
        : dataType === 'brKey' ?
          <EditableBrKey key={value} {...compProps} />
        : dataType === 'docType' ?
          <EditableDocType key={value} {...compProps} />
        : <div>I dunno</div>
      : dataType === 'readonly' ?
        <ReadOnlyField
          value={value}
          label={label}
          onCopy={() => navigator.clipboard.writeText(value)}
        />
      : <ReadOnlyField
          value={value}
          label={label}
          onEditing={() => setEditing(true)}
        />
      }
    </div>
  )
}
