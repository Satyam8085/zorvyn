import { formatCurrency } from '../utils/financeUtils'

export default function SummaryMetricCard({ label, value, delta, tone, index = 0 }) {
  const accentClass =
    tone === 'income'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'expense'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-[var(--text)]'

  const accentBarClass =
    tone === 'income'
      ? 'from-emerald-500/90 to-teal-400/80'
      : tone === 'expense'
        ? 'from-rose-500/90 to-orange-400/80'
        : 'from-amber-500/90 to-sky-400/80'

  const icon = tone === 'income' ? 'IN' : tone === 'expense' ? 'OUT' : 'NET'

  return (
    <article
      className="metric-card metric-card-animated"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className={`metric-glow bg-gradient-to-br ${accentBarClass}`} />
      <div className="metric-topline">
        <span className="metric-icon">{icon}</span>
        {delta ? <span className="tag">{delta}</span> : null}
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
        <div className="flex items-end justify-between gap-4">
          <h2 className={`text-3xl ${accentClass}`}>{formatCurrency(value)}</h2>
          <span className="metric-line" />
        </div>
      </div>
    </article>
  )
}
