import { useState } from 'react'
import {
  Autocomplete,
  type ComboboxItem,
  type OptionsFilter,
} from '@mantine/core'
import { useDocTypesQuery, type DocType } from '../../features/pdf/pdfApi'

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

  const handleAutoCompleteSelect = (docType: string) => {
    const id = docType.split(' ')[0]
    const selectedItem = docTypes.find(docType => docType.id === +id)
    if (selectedItem !== undefined) {
      setDocTypeId(selectedItem.id)
      props.onSelected(selectedItem)
    }
  }

  return (
    <div>
      <Autocomplete
        value={docTypeId + ''}
        data={docTypes.map(docType => `${docType.id} - ${docType.dscr}`)}
        onChange={value => {
          if (!Number.isNaN(+value)) {
            setDocTypeId(+value)
            search({ query: value })
          }
        }}
        filter={filter}
        comboboxProps={{
          onOptionSubmit: value => handleAutoCompleteSelect(value),
        }}
      />
    </div>
  )
}
