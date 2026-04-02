export default function DashboardHeader({
  role,
  theme,
  onRoleChange,
  onThemeToggle,
  onExport,
  transactionCount,
  lastTransactionDate,
}) {
  return (
    <section
      className="glass-panel section-reveal relative overflow-hidden px-6 py-7 md:px-8"
      style={{ background: 'var(--hero)' }}
    >
      <div className="hero-wave" />
      <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="pointer-events-none absolute left-0 top-10 h-32 w-32 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-24 h-40 w-40 rounded-full border border-white/25 opacity-40" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="tag">Finance Dashboard UI</span>
            <span className="tag">{transactionCount} tracked transactions</span>
            <span className="tag">
              {lastTransactionDate ? `Last update ${lastTransactionDate}` : 'No transactions yet'}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
              Cashflow cockpit
            </p>
            <h1 className="max-w-xl text-4xl leading-tight md:text-5xl">
              A calm, readable snapshot of balance, spend, and momentum.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)] md:text-base">
              This dashboard uses mock data and front-end state only. Switch roles to
              simulate viewer access or admin controls for managing transactions.
            </p>
          </div>

          <div className="hero-metrics">
            <article className="hero-stat">
              <span className="hero-stat-label">Tracking</span>
              <strong>{transactionCount}</strong>
              <span className="hero-stat-copy">active entries in the working ledger</span>
            </article>
            <article className="hero-stat">
              <span className="hero-stat-label">Access</span>
              <strong>{role === 'admin' ? 'Admin' : 'Viewer'}</strong>
              <span className="hero-stat-copy">
                {role === 'admin' ? 'editing unlocked for this demo' : 'read-only review mode'}
              </span>
            </article>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[32rem]">
          <label className="field">
            <span className="field-label">Role</span>
            <select value={role} onChange={(event) => onRoleChange(event.target.value)}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>

          <button className="btn-secondary justify-center" onClick={onThemeToggle} type="button">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button className="btn-primary justify-center" onClick={onExport} type="button">
            Export JSON
          </button>
        </div>
      </div>
    </section>
  )
}
