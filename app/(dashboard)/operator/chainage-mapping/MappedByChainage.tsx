import type { ChainageWithUsers } from "@/types/chainage-mapping";

const formatRole = (role: string) => role.replace(/_/g, " ");

const sortUsersByDesignation = (
  users: ChainageWithUsers["users"],
): ChainageWithUsers["users"] =>
  [...users].sort((a, b) => a.user.role.localeCompare(b.user.role));

const MappedByChainage = ({
  chainages,
}: {
  chainages: ChainageWithUsers[];
}) => {
  return (
    <div className="space-y-4">
      {chainages.map((c) => {
        const sortedUsers = sortUsersByDesignation(c.users);
        return (
          <div
            key={c.id}
            className="border border-(--border-default) rounded-md p-3"
          >
            <div className="font-medium text-(--text-primary) mb-2">
              {c.label} ({c.startKm}–{c.endKm} km)
            </div>
            {sortedUsers.length === 0 ? (
              <p className="text-(--text-muted) text-sm">No users assigned</p>
            ) : (
              <ul className="text-sm text-(--text-secondary) space-y-1">
                {sortedUsers.map((cu) => (
                  <li key={cu.id}>
                    {cu.user.name} ({formatRole(cu.user.role)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MappedByChainage;
