import { useState } from 'react'
// import AssetSelection from './AssetSelection2'
import { Button, ButtonGroup, Center } from '@mantine/core'

export const EditableBrKey = ({
  value,
  label,
  onSave,
  onCancel,
  validate,
}: EditableFieldProps) => {
  const [v, setV] = useState<string>(value || '')

  return (
    <div key={value}>
      <Center>
        <span style={{ marginRight: '20px' }}>{label}:</span>
        {/* <AssetSelection
        brKey={v}
        onSelected={e => {
          console.log(e)
          setV(e)
        }}
      /> */}
        <ButtonGroup style={{ marginLeft: '20px' }}>
          <Button
            onClick={e => {
              console.log(e)
              console.log('presave', v, value)
              onSave(v)
            }}
            disabled={!validate(v)}
          >
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
        </ButtonGroup>
      </Center>
    </div>
  )
}
