import type { Chainage } from "@/lib/generated/prisma";
import type { Column } from "@/types/ui";
import Button from "@/components/ui/Button";

export interface ChainageTableActions {
  onEdit: (row: Chainage) => void;
  onDelete: (row: Chainage) => void;
}

/** Table columns for operator chainages list. */
export const getOperatorChainagesColumns = (
  actions: ChainageTableActions,
): Column<Chainage>[] => [
  { header: "Label", accessor: "label" },
  {
    header: "Start (km)",
    accessor: "startKm",
    render: (r) => r.startKm,
  },
  {
    header: "End (km)",
    accessor: "endKm",
    render: (r) => r.endKm,
  },
  {
    header: "Lat",
    accessor: "latitude",
    render: (r) => (r.latitude != null ? r.latitude : "—"),
  },
  {
    header: "Long",
    accessor: "longitude",
    render: (r) => (r.longitude != null ? r.longitude : "—"),
  },
  {
    header: "Edit",
    accessor: "id",
    key: "edit",
    render: (row) => (
      <Button
        type="button"
        variant="ghost"
        className="text-sm text-(--brand-primary) hover:underline"
        onClick={() => actions.onEdit(row)}
      >
        Edit
      </Button>
    ),
  },
  {
    header: "Delete",
    accessor: "id",
    key: "delete",
    render: (row) => (
      <Button
        type="button"
        variant="ghost"
        className="text-sm text-(--alarm-critical) hover:underline"
        onClick={() => actions.onDelete(row)}
      >
        Delete
      </Button>
    ),
  },
];
