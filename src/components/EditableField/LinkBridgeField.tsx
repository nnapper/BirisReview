import { Button, Grid, GridCol, Text } from '@mantine/core'
import { AssetSelection } from './AssetSelection'
import { useState } from 'react'

export const LinkBridgeField = (props: {
  handleUpdate: (newBrKey: string) => void
}) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [brKey, setBrKey] = useState<string>('')

  return editing ?
      <Grid>
        <GridCol span={4}>
          <Text>Asset ID:</Text>
        </GridCol>
        <GridCol span={6}>
          <AssetSelection brKey={brKey} onSelected={e => setBrKey(e)} />
        </GridCol>
        <GridCol span={2}>
          <Button
            onClick={() => {
              props.handleUpdate(brKey)
              setEditing(false)
            }}
            disabled={brKey === ''}
          >
            Save
          </Button>
          <Button bg="#495057" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </GridCol>
      </Grid>
    : <GridCol span={12}>
        <Button onClick={() => setEditing(true)}>Link a Bridge</Button>
      </GridCol>
}
