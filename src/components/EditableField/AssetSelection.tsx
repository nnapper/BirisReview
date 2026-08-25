import { Autocomplete, type AutocompleteProps } from '@mantine/core'
import { useState } from 'react'
import { useLazySearchQuery, type AssetInfo } from '../../features/pdf/pdfApi'

export const AssetSelection = (props: {
  brKey: string
  onSelected: (brKey: string) => void
}) => {
  const { brKey, onSelected } = props
  const [value, setValue] = useState<string>(brKey)
  const [items, setItems] = useState<AssetInfo[]>([])

  const [searchQuery] = useLazySearchQuery()

  const search = async ({ query }: { query: string }) => {
    const b = query
    if (b != null && b.length > 1) {
      try {
        const data = await searchQuery({ query: b }).unwrap()
        setItems(data)
        if (data.length === 1) {
          setValue(data[0].brKey)
          onSelected(data[0].brKey)
        }
      } catch (err) {
        console.log('searching brKeys', err)
      }
    }
  }

  const handleAutoCompleteSelect = (id: string) => {
    console.log('looking at', id)
    setValue(id)
  }

  const itemTemplate = (i: AssetInfo) => (
    <div>
      {i.brKey} - {i.name}
    </div>
  )

  const renderList: AutocompleteProps['renderOption'] = ({ option }) => {
    const item = items.find(item => item.brKey === option.value)
    return item ? itemTemplate(item) : option.value
  }

  return (
    <div>
      <Autocomplete
        value={value}
        data={items.map(item => `${item.brKey}`)}
        onChange={value => {
          setValue(value)
          search({ query: value })
        }}
        onFocus={() => {
          if (value === '') {
            search({ query: '' })
          }
        }}
        renderOption={renderList}
        comboboxProps={{
          onOptionSubmit: value => handleAutoCompleteSelect(value),
        }}
      />
    </div>
  )
}
