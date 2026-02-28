import type { ChainageMapping } from "@/types/chainage-mapping";
import type { Column } from "@/types/ui";
import Button from "@/components/ui/Button";

export interface ChainageMappingsTableActions {
  onRemove: (id: string) => void;
}

/** Table columns for operator chainage mappings list. */
export const getOperatorChainageMappingsColumns = (
  actions: ChainageMappingsTableActions,
): Column<ChainageMapping>[] => [
  {
    header: "User",
    accessor: "user",
    render: (r) => `${r.user.name} (${r.user.email})`,
  },
  {
    header: "Chainage",
    accessor: "chainage",
    render: (r) =>
      `${r.chainage.label} (${r.chainage.startKm}–${r.chainage.endKm} km)`,
  },
  {
    header: "Actions",
    accessor: "id",
    key: "actions",
    render: (r) => (
      <Button
        type="button"
        variant="ghost"
        className="text-sm text-(--alarm-critical) hover:underline"
        onClick={() => actions.onRemove(r.id)}
      >
        Remove
      </Button>
    ),
  },
];
