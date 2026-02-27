import { cn } from "@/lib/utils";
import type { Column } from "@/types/ui";

interface Props<T extends { id?: string | number }> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

const Table = <T extends { id?: string | number }>({
  data,
  columns,
  className,
}: Props<T>) => {
  return (
    <div
      className={cn(
        "overflow-auto border border-(--border-default) rounded-md",
        className,
      )}
    >
      <table className="w-full text-sm">
        <thead className="bg-(--bg-surface) text-(--text-secondary)">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="text-left px-3 py-2 font-medium"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => {
            const baseId = row.id ?? i;
            const rowKey =
              typeof baseId === "string" ? `${baseId}-${i}` : `${String(baseId)}-${i}`;
            return (
              <tr
                key={rowKey}
                className="border-t border-(--border-default) hover:bg-(--bg-surface)"
              >
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="px-3 py-2">
                    {col.render ? col.render(row) : String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
