"use client";

import { useRouter } from "next/navigation";
import type { ChainageMapping } from "@/types/chainage-mapping";
import Table from "@/components/ui/Table";
import { removeMapping } from "./actions";

const MappingsList = ({ mappings }: { mappings: ChainageMapping[] }) => {
  const router = useRouter();

  async function handleRemove(id: string) {
    if (!confirm("Remove this mapping?")) return;
    await removeMapping(id);
    router.refresh();
  }

  const columns = [
    {
      header: "User",
      accessor: "user" as const,
      render: (r: ChainageMapping) => `${r.user.name} (${r.user.email})`,
    },
    {
      header: "Chainage",
      accessor: "chainage" as const,
      render: (r: ChainageMapping) =>
        `${r.chainage.label} (${r.chainage.startKm}–${r.chainage.endKm} km)`,
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (r: ChainageMapping) => (
        <button
          type="button"
          onClick={() => handleRemove(r.id)}
          className="text-sm text-(--alarm-critical) hover:underline"
        >
          Remove
        </button>
      ),
    },
  ];

  if (mappings.length === 0) {
    return (
      <p className="text-(--text-muted) py-2">
        No mappings yet. Assign a user to chainage(s) above.
      </p>
    );
  }

  return <Table data={mappings} columns={columns} />;
};

export default MappingsList;
