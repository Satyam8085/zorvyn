import { formatCurrency } from '../utils/financeUtils'

export default function BalanceTrendChart({ trend }) {
  if (trend.length === 0) {
    return (
      <section className="glass-panel section-reveal p-6">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Balance trend</p>
            <h2>Time-based view</h2>
          </div>
        </div>
        <div className="empty-state">
          <p>No monthly data available yet.</p>
        </div>
      </section>
    )
  }

  const width = 420
  const height = 220
  const padding = 20
  const balances = trend.map((item) => item.balance)
  const minimum = Math.min(...balances)
  const maximum = Math.max(...balances)
  const range = maximum - minimum || 1
  const stepX = trend.length === 1 ? 0 : (width - padding * 2) / (trend.length - 1)

  const points = trend.map((item, index) => {
    const x = padding + stepX * index
    const y =
      height - padding - ((item.balance - minimum) / range) * (height - padding * 2 || 1)

    return { ...item, x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${
    height - padding
  } Z`

  return (
    <section className="glass-panel section-reveal p-6">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Balance trend</p>
          <h2>Running balance by month</h2>
        </div>
        <span className="tag">Cumulative net balance</span>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
        <div className="chart-shell rounded-[1.75rem] border border-white/25 bg-white/45 p-4 shadow-sm dark:bg-white/5">
          <svg className="h-auto w-full" viewBox={`0 0 ${width} ${height}`} role="img">
            <defs>
              <linearGradient id="balanceFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {points.map((point) => (
              <line
                key={`${point.monthKey}-grid`}
                x1={point.x}
                x2={point.x}
                y1={padding}
                y2={height - padding}
                stroke="rgba(148, 163, 184, 0.14)"
              />
            ))}
            <path className="chart-area" d={areaPath} fill="url(#balanceFill)" />
            <path
              className="chart-line"
              d={linePath}
              fill="none"
              stroke="#b45309"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            {points.map((point) => (
              <circle
                className="chart-dot"
                key={point.monthKey}
                cx={point.x}
                cy={point.y}
                fill="#fff"
                r="6"
                stroke="#b45309"
                strokeWidth="3"
              />
            ))}
          </svg>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-[var(--muted)]">
            {trend.map((item) => (
              <div key={item.monthKey}>
                <p>{item.label}</p>
                <p className="mt-1 font-semibold text-[var(--text)]">
                  {formatCurrency(item.balance)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {trend.map((item, index) => (
            <article
              className="data-tile rounded-[1.5rem] border border-white/25 bg-white/55 p-4 dark:bg-white/5"
              style={{ animationDelay: `${80 + index * 80}ms` }}
              key={item.monthKey}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{item.label}</p>
                <span className="tag">{formatCurrency(item.net)}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>Income</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.income)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expenses</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">
                    {formatCurrency(item.expense)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ending balance</span>
                  <span className="font-semibold text-[var(--text)]">
                    {formatCurrency(item.balance)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
