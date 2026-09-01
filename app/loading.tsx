export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vault-radial">
      <div className="flex flex-col items-center gap-6">
        <svg
          viewBox="0 0 64 64"
          className="h-14 w-14 animate-spin text-gold/60"
          style={{ animationDuration: "2.4s" }}
          fill="none"
          aria-hidden
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <path
            d="M32 4a28 28 0 0 1 28 28"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
        <p className="text-[11px] uppercase tracking-eyebrow text-gold/50">
          Opening the vault
        </p>
      </div>
    </div>
  );
}
