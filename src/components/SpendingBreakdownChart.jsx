import { formatCurrency } from '../utils/financeUtils'

export default function SpendingBreakdownChart({ breakdown }) {
  if (breakdown.length === 0) {
    return (
      <section className="glass-panel section-reveal p-6">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Spending mix</p>
            <h2>Categorical view</h2>
          </div>
        </div>
        <div className="empty-state">
          <p>No expense data to group yet.</p>
        </div>
      </section>
    )
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0)
  let progress = 0

  const gradient = breakdown
    .map((item) => {
      const start = progress * 100
      progress += item.share
      const end = progress * 100
      return `${item.color} ${start}% ${end}%`
    })
    .join(', ')

  return (
    <section className="glass-panel section-reveal p-6">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Spending mix</p>
          <h2>Where expenses are going</h2>
        </div>
        <span className="tag">{formatCurrency(total)} total expenses</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
        <div className="donut-shell mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-white/35 bg-white/55 p-5 dark:bg-white/5">
          <div
            className="donut-ring flex h-full w-full items-center justify-center rounded-full"
            style={{ background: `conic-gradient(${gradient})` }}
          >
            <div className="flex h-30 w-30 flex-col items-center justify-center rounded-full bg-[var(--panel-strong)] text-center">
              <span className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Total
              </span>
              <span className="mt-2 text-2xl">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {breakdown.map((item, index) => (
            <article
              className="data-tile rounded-[1.5rem] border border-white/25 bg-white/55 p-4 dark:bg-white/5"
              style={{ animationDelay: `${100 + index * 70}ms` }}
              key={item.category}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="font-semibold">{item.category}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {(item.share * 100).toFixed(1)}% of all expenses
                    </p>
                  </div>
                </div>
                <span className="font-semibold">{formatCurrency(item.amount)}</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full progress-bar-fill"
                  style={{
                    backgroundColor: item.color,
                    width: `${Math.max(item.share * 100, 8)}%`,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
