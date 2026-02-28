import Link from "next/link";

import type { AlarmsSearchParams } from "@/types/alarm";
import DateInput from "@/components/form/DateInput";
import Button from "@/components/ui/Button";
import { buildAlarmFilterUrl } from "@/lib/url/buildAlarmFilterUrl";
import { cn } from "@/lib/utils";
import {
  ALARM_LIST_FILTER_STATUSES,
  CRITICALITY_VALUES,
} from "@/constants/alarm";

type Props = {
  basePath: string;
  params: AlarmsSearchParams;
};

export default function OperatorAlarmsFilters({ basePath, params }: Props) {
  const buildUrl = (overrides: Partial<AlarmsSearchParams>) =>
    buildAlarmFilterUrl(basePath, params, overrides);

  const pillClass = (active: boolean) =>
    cn(
      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
      active
        ? "bg-(--brand-primary) text-white"
        : "bg-(--bg-surface) text-(--text-secondary) hover:bg-(--border-default) hover:text-(--text-primary)",
    );

  return (
    <div className="rounded-lg border border-(--border-default) bg-(--bg-elevated) p-4">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--text-muted)">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({ status: "", criticality: "" })}
              className={pillClass(!params.status && !params.criticality)}
            >
              All
            </Link>
            {ALARM_LIST_FILTER_STATUSES.map((status) => (
              <Link
                key={status}
                href={buildUrl({ status })}
                className={pillClass(params.status === status)}
              >
                {status}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--text-muted)">
            Criticality
          </p>
          <div className="flex flex-wrap gap-2">
            {CRITICALITY_VALUES.map((criticality) => (
              <Link
                key={criticality}
                href={buildUrl({ criticality })}
                className={pillClass(params.criticality === criticality)}
              >
                {criticality}
              </Link>
            ))}
          </div>
        </div>

        <form
          method="get"
          action={basePath}
          className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4"
        >
          <input type="hidden" name="status" value={params.status ?? ""} />
          <input
            type="hidden"
            name="criticality"
            value={params.criticality ?? ""}
          />
          <div className="min-w-0 md:flex-1">
            <DateInput
              label="From date"
              name="dateFrom"
              defaultValue={params.dateFrom}
            />
          </div>
          <div className="min-w-0 md:flex-1">
            <DateInput
              label="To date"
              name="dateTo"
              defaultValue={params.dateTo}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="shrink-0 w-full md:w-auto"
          >
            Apply dates
          </Button>
        </form>
      </div>
    </div>
  );
}
