type EditableFieldProps = {
  value: string
  label: string
  onSave: (newVal: string | null) => void
  onCancel: () => void
  validate: (newVal: string | null) => boolean | undefined
}
