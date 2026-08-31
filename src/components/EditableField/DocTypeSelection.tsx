import { useState } from 'react'
import {
  Autocomplete,
  type AutocompleteProps,
  type ComboboxItem,
  type OptionsFilter,
} from '@mantine/core'
import { useDocTypesQuery, type DocType } from '../../features/doc/docApi'

type DocTypeSelectionProps = {
  docTypeId: number
  onSelected: (newId: DocType | undefined) => void
  required?: boolean
}

export const DocTypeSelection3 = (props: DocTypeSelectionProps) => {
  const [docTypeId, setDocTypeId] = useState<number | null>(props.docTypeId)

  const { data: docTypesRaw, error } = useDocTypesQuery()
  if (error || !docTypesRaw) return <div>Unable to pull doc types</div>

  const docTypes = docTypesRaw.toSorted((a, b) => a.id - b.id)

  const search = ({ query }: { query: string }) => {
    const items = docTypes.filter(t => String(t.id).startsWith(query))
    if (items.length === 1) {
      setDocTypeId(items[0].id)
      props.onSelected(items[0])
    }
  }

  const filter: OptionsFilter = ({ options, search }) => {
    return (options as ComboboxItem[]).filter(option =>
      option.label.startsWith(search.trim()),
    )
  }

  const updateValidDocTypeId = (id: number) => {
    const selectedItem = docTypes.find(docType => docType.id === +id)
    if (selectedItem !== undefined) {
      setDocTypeId(selectedItem.id)
      props.onSelected(selectedItem)
    }
  }

  const handleAutoCompleteSelect = (docType: string) => {
    updateValidDocTypeId(+docType)
  }

  const renderList: AutocompleteProps['renderOption'] = ({ option }) => {
    const docType = docTypes.find(docType => docType.id === +option.value)
    return docType ?
        <div>
          {docType.id} - {docType.dscr}
        </div>
      : option.value
  }

  return (
    <Autocomplete
      value={docTypeId + ''}
      data={docTypes.map(docType => `${docType.id}`)}
      onChange={value => {
        const id = +value
        if (!Number.isNaN(id)) {
          search({ query: value })
          updateValidDocTypeId(id)
        }
      }}
      renderOption={renderList}
      filter={filter}
      comboboxProps={{
        onOptionSubmit: value => handleAutoCompleteSelect(value),
      }}
      autoSelectOnBlur
    />
  )
}
