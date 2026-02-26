type ChainageWithUsers = {
  id: string;
  label: string;
  startKm: number;
  endKm: number;
  users: {
    id: string;
    user: { id: string; name: string; email: string };
  }[];
};

const MappedByChainage = ({
  chainages,
}: {
  chainages: ChainageWithUsers[];
}) => {
  return (
    <div className="space-y-4">
      {chainages.map((c) => (
        <div
          key={c.id}
          className="border border-(--border-default) rounded-md p-3"
        >
          <div className="font-medium text-(--text-primary) mb-2">
            {c.label} ({c.startKm}–{c.endKm} km)
          </div>
          {c.users.length === 0 ? (
            <p className="text-(--text-muted) text-sm">No users assigned</p>
          ) : (
            <ul className="text-sm text-(--text-secondary) space-y-1">
              {c.users.map((cu) => (
                <li key={cu.id}>
                  {cu.user.name} ({cu.user.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MappedByChainage;
