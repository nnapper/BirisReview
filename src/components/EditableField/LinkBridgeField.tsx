import { Button, Grid, GridCol } from '@mantine/core'
import { AssetSelection } from './AssetSelection'
import { useState } from 'react'

export const LinkBridgeField = ({
  handleUpdate,
}: {
  handleUpdate: (newVal: string) => void
}) => {
  const [editing, setEditing] = useState<boolean>(false)

  return editing ?
      <GridCol span={12}>
        <AssetSelection
          brKey={''}
          onSelected={newVal => {
            console.log('new val')
            handleUpdate(newVal)
            setEditing(false)
          }}
        />
      </GridCol>
    : <GridCol span={12}>
        <Button onClick={() => setEditing(true)}>Link a Bridge</Button>
      </GridCol>
}
