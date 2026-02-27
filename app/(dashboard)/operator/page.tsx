import Link from "next/link";

import {
  Bell,
  ClipboardCheck,
  LayoutDashboard,
  MapPin,
  Network,
  Users,
} from "lucide-react";

import Breadcrumb from "@/components/ui/Breadcrumb";

const QUICK_LINKS = [
  {
    href: "/operator/alarms",
    label: "Alarms",
    description: "View and manage pipeline intrusion alarms",
    icon: Bell,
  },
  {
    href: "/operator/reviews",
    label: "Reviews",
    description: "Review and verify alarm handling",
    icon: ClipboardCheck,
  },
  {
    href: "/operator/users",
    label: "Users",
    description: "Manage operators and roles",
    icon: Users,
  },
  {
    href: "/operator/chainages",
    label: "Chainages",
    description: "Configure chainage definitions",
    icon: MapPin,
  },
  {
    href: "/operator/chainage-mapping",
    label: "Chainage mapping",
    description: "Map chainages to users and coverage",
    icon: Network,
  },
] as const;

const Page = () => {
  return (
    <div className="p-6 md:p-8">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Dashboard" },
        ]}
      />

      <header className="mb-8 rounded-xl max-w-3xl mx-auto border border-(--border-default) bg-(--bg-surface) px-6 py-8 shadow-(--shadow-card) md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--brand-primary) text-white">
            <LayoutDashboard
              className="h-6 w-6"
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
          <div>
            <p className="mt-0.5 text-sm text-(--text-secondary)">
              Manage users, chainages, and alarm workflows from the sections
              below.
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-medium text-center uppercase tracking-wider text-(--text-muted)">
          Quick links
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-3xl">
          {QUICK_LINKS.map(({ href, label, description, icon: Icon }) => (
            <li key={href} className="py-8">
              <Link
                href={href}
                className="group flex gap-4 rounded-xl border border-(--border-default) bg-(--bg-surface) p-5 shadow-(--shadow-card) transition-colors hover:border-(--border-strong) hover:bg-(--bg-elevated)"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--bg-elevated) text-(--text-secondary) transition-colors group-hover:bg-(--brand-primary) group-hover:text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-(--text-primary) group-hover:text-(--brand-primary)">
                    {label}
                  </span>
                  <p className="mt-0.5 text-sm text-(--text-muted)">
                    {description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Page;
