import { BadgeConfidence } from "@/components/Utilities/BadgeConfidence"
import { type Column, DataTable } from "./DataTable"

interface SourceMetricRow {
  metric: string
  a: number | null
  b: number | null
}

interface CompareTableProps {
  rows: SourceMetricRow[]
  sourceA: string
  sourceB: string
}

export function CompareTable({ rows, sourceA, sourceB }: CompareTableProps) {
  const columns: Column<SourceMetricRow>[] = [
    { header: "Metric", accessor: "metric" },
    {
      header: sourceA,
      accessor: (r) => <BadgeConfidence score={r.a} />, // wraps numeric in badge
    },
    {
      header: sourceB,
      accessor: (r) => <BadgeConfidence score={r.b} />,
    },
  ]
  return <DataTable columns={columns} data={rows} />
}

export default CompareTable
