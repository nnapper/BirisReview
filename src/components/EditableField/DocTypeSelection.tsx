import { useEffect, useState } from 'react'
import { Autocomplete } from '@mantine/core'
import { useDocTypesQuery, type DocType } from '../../features/pdf/pdfApi'

type DocTypeSelectionProps = {
  docTypeId: number
  onSelected: (newId: DocType | undefined) => void
  required?: boolean
}

export const DocTypeSelection2 = (props: DocTypeSelectionProps) => {
  const [docType, setDocType] = useState<DocType | null>(null)
  // const [docTypeIds, setDocTypeIds] = useState<DocType[]>([])

  const { data: docTypes, error } = useDocTypesQuery()

  if (error || !docTypes) return <div>Unable to pull doc types</div>

  const search = ({ query }: { query: string }) => {
    if (!docTypes) return
    const items = docTypes.filter(t => String(t.id).startsWith(query))
    if (items.length === 1) {
      setDocType(items[0])
    }
  }

  const handleAutoCompleteSelect = (id: string) => {
    const selectedItem = docTypes.find(docType => docType.id === +id)
    if (selectedItem !== undefined) {
      console.log('hello')
      setDocType(docType)
    }
  }

  return (
    <div>
      <Autocomplete
        value={'' + docType?.id}
        data={docTypes.map(docType => `${docType.id} - ${docType.dscr}`)}
        onChange={value => {
          setDocType(docType)
          search({ query: value })
        }}
        // error={required && valObj == null}
        // renderOption={renderList}
        comboboxProps={{
          onOptionSubmit: value => handleAutoCompleteSelect(value),
        }}
      />
    </div>
  )
}

export const DocTypeSelection = (props: DocTypeSelectionProps) => {
  const { docTypeId, onSelected, required = true } = props

  const [items, setItems] = useState<DocType[]>([])

  const [v, setV] = useState<string>(docTypeId < 0 ? '' : docTypeId + '')
  const [valObj, setValObj] = useState<DocType | undefined>(undefined)

  const { data: docTypes } = useDocTypesQuery()

  useEffect(() => {
    setV(docTypeId > -1 ? docTypeId + '' : '')
  }, [docTypeId, setV])

  useEffect(() => {
    if (!docTypes || docTypes.length === 0) return

    const vO =
      v != null && v.length > 0 ?
        docTypes.find(e => String(e.id) === v)
      : undefined
    setValObj(vO)
    onSelected(vO)
  }, [v, docTypes])

  const search = ({ query }: { query: string }) => {
    if (!docTypes) return
    const items = docTypes.filter(t => String(t.id).startsWith(query))
    if (items.length === 1) {
      onSelected(items[0])
    }
    setItems(items)
  }

  const itemTemplate = (item: DocType) => {
    return (
      <div style={{ width: '300px' }}>
        {item.id} - {item.dscr}
      </div>
    )
  }

  const handleAutoCompleteSelect = (id: string) => {
    const selectedItem = items.find(item => item.id === +id)
    if (selectedItem !== undefined) {
      console.log('hello')
      setV(String(selectedItem.id))
    }
  }

  return (
    <div>
      <Autocomplete
        value={v}
        data={items.map(item => `${item.id} - ${item.dscr}`)}
        onChange={value => {
          setV(value)
          search({ query: value })
        }}
        comboboxProps={{
          onOptionSubmit: value => handleAutoCompleteSelect(value),
        }}
      />
    </div>
  )
}
