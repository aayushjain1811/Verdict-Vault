import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
      <div>
        <h1 className="font-display text-3xl text-bone">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl font-read text-sm leading-relaxed text-smoke">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-gold/12 bg-charcoal/40", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <Panel className="p-6">
      <p className="docket !text-ash">{label}</p>
      <p className="mt-3 font-display text-3xl text-bone">{value}</p>
      {delta && <p className="mt-1.5 text-xs text-gold">{delta}</p>}
    </Panel>
  );
}

const statusStyles: Record<string, string> = {
  PUBLISHED: "border-gold/40 text-gold-pale",
  DRAFT: "border-smoke/30 text-smoke",
  IN_REVIEW: "border-[#7A5C2E] text-gold/80",
  ARCHIVED: "border-ash/30 text-ash",
  APPROVED: "border-gold/40 text-gold-pale",
  PENDING: "border-smoke/30 text-smoke",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        statusStyles[status] ?? "border-smoke/30 text-smoke"
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

/** Marks features whose UI is complete but whose persistence layer is not wired. */
export function NotWiredNotice({ what }: { what: string }) {
  return (
    <div className="mb-8 rounded-lg border border-gold/25 bg-gold/[.05] px-5 py-4">
      <p className="text-sm leading-relaxed text-smoke">
        <span className="text-gold-pale">Demo mode.</span> {what} isn’t live
        because Firebase isn’t configured yet. Add your keys to{" "}
        <code className="font-mono text-xs text-gold/80">.env.local</code>{" "}
        (see the README) to persist and read real data.
      </p>
    </div>
  );
}

// --- Additional primitives (data-driven admin) -----------------------------

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-gold/12 bg-charcoal/50 p-6", className)}>
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <AdminCard>
      <p className="docket !text-gold/60">{label}</p>
      <p className="mt-3 font-display text-4xl text-bone">{value}</p>
      {hint && <p className="mt-1 text-xs text-ash">{hint}</p>}
    </AdminCard>
  );
}

const badgeStyles: Record<string, string> = {
  published: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  draft: "border-gold/30 bg-gold/10 text-gold-pale",
  in_review: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  rejected: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
        badgeStyles[status] ?? "border-smoke/30 bg-smoke/10 text-smoke"
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-gold-gradient text-ink hover:brightness-110",
    ghost: "border border-gold/25 text-bone hover:border-gold/50",
    danger: "border border-rose-500/30 text-rose-300 hover:bg-rose-500/10",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all disabled:opacity-50",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
