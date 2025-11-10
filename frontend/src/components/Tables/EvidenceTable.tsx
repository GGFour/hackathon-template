import { TooltipInfo } from "@/components/Utilities/TooltipInfo"
import { type Column, DataTable } from "./DataTable"

export interface EvidenceRow {
  id: string
  type: string
  confidence: number | null
  summary: string
}

interface EvidenceTableProps {
  rows: EvidenceRow[]
}

export function EvidenceTable({ rows }: EvidenceTableProps) {
  const columns: Column<EvidenceRow>[] = [
    { header: "ID", accessor: "id" },
    { header: "Type", accessor: "type" },
    {
      header: "Confidence",
      accessor: (r) => (
        <TooltipInfo
          label={`${r.confidence ?? "?"}%`}
          description={r.summary}
        />
      ),
    },
    { header: "Summary", accessor: "summary" },
  ]
  return <DataTable columns={columns} data={rows} />
}

export default EvidenceTable
