import Link from "next/link";
import type { Crumb } from "@/types/ui";

interface Props {
  crumbs: Crumb[];
}

const Breadcrumb = ({ crumbs }: Props) => {
  return (
    <nav className="text-xs text-(--text-secondary) mb-3">
      {crumbs.map((crumb, i) => (
        <span key={i}>
          {crumb.href ? (
            <Link href={crumb.href} className="underline">
              {crumb.label}
            </Link>
          ) : (
            <span>{crumb.label}</span>
          )}
          {i < crumbs.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
