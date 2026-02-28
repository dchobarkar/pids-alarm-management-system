"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ChainageMapping } from "@/types/chainage-mapping";
import Table from "@/components/ui/Table";
import { removeMapping } from "./actions";
import { getOperatorChainageMappingsColumns } from "@/config/operator-chainage-mappings-columns";

const MappingsList = ({ mappings }: { mappings: ChainageMapping[] }) => {
  const router = useRouter();

  const handleRemove = useCallback(
    async (id: string) => {
      if (!confirm("Remove this mapping?")) return;
      await removeMapping(id);
      router.refresh();
    },
    [router],
  );

  const columns = useMemo(
    () =>
      getOperatorChainageMappingsColumns({
        onRemove: handleRemove,
      }),
    [handleRemove],
  );

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
