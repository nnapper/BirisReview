import { useState } from 'react'
import {
  Button,
  Grid,
  GridCol,
  Autocomplete,
  type AutocompleteProps,
  type ComboboxItem,
  type OptionsFilter,
} from '@mantine/core'
import { useDocTypesQuery } from '../../features/doc/docApi'

export const EditableDocType = ({
  value,
  label,
  onSave,
  onCancel,
}: EditableFieldProps) => {
  const initialDocTypeId = value
  const [docTypeId, setDocTypeId] = useState<string>(value)
  const [validEntry, setValidEntry] = useState<boolean>(false)

  const { data: docTypesRaw, error } = useDocTypesQuery()
  if (error || !docTypesRaw) return <div>Unable to pull doc types</div>

  const docTypes = docTypesRaw.toSorted((a, b) => a.id - b.id)
  const filter: OptionsFilter = ({ options, search }) => {
    if (search == null || search === '') return options
    const s = search.trim()
    return (options as ComboboxItem[]).filter(option =>
      option.label.startsWith(s),
    )
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
    <Grid>
      <GridCol span={4}>{label}:</GridCol>
      <GridCol span={6}>
        <Autocomplete
          defaultValue={initialDocTypeId}
          value={docTypeId}
          data={docTypes.map(docType => docType.id + '')}
          onChange={value => {
            setDocTypeId(value)
            setValidEntry(
              initialDocTypeId !== value &&
                docTypes.find(docType => docType.id === +value) != null,
            )
          }}
          renderOption={renderList}
          filter={filter}
          autoSelectOnBlur
        />
      </GridCol>
      <GridCol span={2}>
        <Button onClick={() => onSave(docTypeId)} disabled={!validEntry}>
          Save
        </Button>
        <Button bg="#495057" onClick={onCancel}>
          Cancel
        </Button>
      </GridCol>
    </Grid>
  )
}
