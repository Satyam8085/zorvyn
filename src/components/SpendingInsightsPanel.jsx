import { formatCurrency } from '../utils/financeUtils'

export default function SpendingInsightsPanel({ insights, role }) {
  const { highestSpendingCategory, monthlyComparison, topExpense, observation } = insights

  return (
    <section className="glass-panel section-reveal p-6">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Useful observations</h2>
        </div>
        <span className="tag">{role === 'admin' ? 'Admin controls enabled' : 'Viewer mode'}</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="insight-card data-tile" style={{ animationDelay: '70ms' }}>
          <p className="insight-label">Highest spending category</p>
          <h3>{highestSpendingCategory?.category ?? 'No expense data'}</h3>
          <p className="insight-value">
            {highestSpendingCategory
              ? formatCurrency(highestSpendingCategory.amount)
              : 'Add expenses to reveal patterns.'}
          </p>
        </article>

        <article className="insight-card data-tile" style={{ animationDelay: '140ms' }}>
          <p className="insight-label">Monthly comparison</p>
          <h3>
            {monthlyComparison
              ? `${monthlyComparison.currentLabel} vs ${monthlyComparison.previousLabel}`
              : 'Not enough monthly history'}
          </h3>
          <p className="insight-value">
            {monthlyComparison
              ? `${monthlyComparison.difference >= 0 ? '+' : '-'}${formatCurrency(
                  Math.abs(monthlyComparison.difference),
                )} (${Math.abs(monthlyComparison.percentChange).toFixed(1)}%)`
              : 'Add another month of activity to compare.'}
          </p>
        </article>

        <article className="insight-card data-tile" style={{ animationDelay: '210ms' }}>
          <p className="insight-label">Largest expense</p>
          <h3>{topExpense?.description ?? 'No expense logged'}</h3>
          <p className="insight-value">
            {topExpense ? formatCurrency(topExpense.amount) : 'Viewer can only inspect data.'}
          </p>
        </article>
      </div>

      <article className="insight-banner mt-4 rounded-[1.5rem] border border-white/25 bg-white/55 p-4 text-sm leading-6 text-[var(--muted)] dark:bg-white/5">
        {observation}
      </article>
    </section>
  )
}
