import { Box } from "@chakra-ui/react"

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  isNumeric?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  size?: string
  variant?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <Box
      as="table"
      width="100%"
      borderWidth="1px"
      rounded="md"
      fontSize="sm"
      style={{ borderCollapse: "collapse" }}
    >
      <Box as="thead" bg="gray.50">
        <Box as="tr">
          {columns.map((col) => (
            <Box
              as="th"
              key={col.header}
              textAlign={col.isNumeric ? "right" : "left"}
              p={2}
              fontSize="xs"
              fontWeight="semibold"
            >
              {col.header}
            </Box>
          ))}
        </Box>
      </Box>
      <Box as="tbody">
        {data.map((row, i) => (
          <Box as="tr" key={i} _even={{ bg: "gray.50" }}>
            {columns.map((col) => (
              <Box
                as="td"
                key={col.header}
                p={2}
                textAlign={col.isNumeric ? "right" : "left"}
              >
                {typeof col.accessor === "function"
                  ? col.accessor(row)
                  : String(row[col.accessor])}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default DataTable
