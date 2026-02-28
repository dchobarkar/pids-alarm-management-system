import Link from "next/link";

import type { UserWithSupervisor } from "@/types/user";
import type { Column } from "@/types/ui";

/** Table columns for operator users list. Details links to user detail using basePath. */
export const getOperatorUsersColumns = (
  basePath: string,
): Column<UserWithSupervisor>[] => [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  {
    header: "Role",
    accessor: "role",
    render: (row) => (
      <span className="text-(--text-secondary)">
        {row.role.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    header: "Supervisor",
    accessor: "supervisorId",
    render: (row) => (row.supervisor ? row.supervisor.name : "—"),
  },
  {
    header: "",
    accessor: "id",
    render: (row) => (
      <Link
        href={`${basePath}/${row.id}`}
        className="text-sm text-(--brand-primary) hover:underline"
      >
        Details
      </Link>
    ),
  },
];
