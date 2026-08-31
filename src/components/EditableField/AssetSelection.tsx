import { Autocomplete, type AutocompleteProps } from '@mantine/core'
import { useState } from 'react'
import { useLazySearchQuery, type AssetInfo } from '../../features/doc/docApi'

export const AssetSelection = (props: {
  brKey: string
  onSelected: (brKey: string) => void
}) => {
  const { brKey, onSelected } = props
  const [value, setValue] = useState<string>(brKey)
  const [bridges, setBridges] = useState<AssetInfo[]>([])

  const [searchQuery] = useLazySearchQuery()

  const search = async ({ query }: { query: string }) => {
    const b = query
    if (b != null && b.length > 1) {
      try {
        const data = await searchQuery({ query: b }).unwrap()
        setBridges(data)
        if (data.length === 1) {
          setValue(data[0].brKey)
          onSelected(data[0].brKey)
        }
      } catch (err) {
        console.log('searching brKeys', err)
      }
    }
  }

  const handleAutoCompleteSelect = (brKey: string) => {
    setValue(brKey)
    onSelected(brKey)
  }

  const renderList: AutocompleteProps['renderOption'] = ({ option }) => {
    const bridge = bridges.find(bridge => bridge.brKey === option.value)
    return bridge ?
        <div>
          {bridge.brKey} - {bridge.name}
        </div>
      : option.value
  }

  return (
    <Autocomplete
      value={value}
      data={bridges.map(item => `${item.brKey}`)}
      onChange={value => {
        setValue(value)
        search({ query: value })
      }}
      renderOption={renderList}
      comboboxProps={{
        onOptionSubmit: value => handleAutoCompleteSelect(value),
      }}
      autoSelectOnBlur
    />
  )
}
