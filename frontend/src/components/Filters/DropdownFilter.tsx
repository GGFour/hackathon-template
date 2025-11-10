// Box import removed; using native select

interface DropdownFilterProps {
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  size?: string
}

export function DropdownFilter({
  value,
  onChange,
  options,
  placeholder = "Filter",
}: DropdownFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        maxWidth: "180px",
        fontSize: "12px",
        padding: "6px",
        border: "1px solid",
        borderRadius: 6,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default DropdownFilter
