import Link from "next/link";
import { CreateAlarmForm } from "./CreateAlarmForm";

export default function CreateAlarmPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/alarms"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Back to alarms
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
          Create Alarm
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter alarm details. Chainage uses 3 decimal precision.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <CreateAlarmForm />
      </div>
    </div>
  );
}
