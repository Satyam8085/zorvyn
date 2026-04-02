import { formatCurrency, formatDate } from '../utils/financeUtils'

function AmountCell({ amount, type }) {
  const toneClass =
    type === 'income'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400'

  return (
    <span className={`font-semibold ${toneClass}`}>
      {type === 'income' ? '+' : '-'}
      {formatCurrency(amount)}
    </span>
  )
}

export default function TransactionsSection({
  transactions,
  allTransactionsCount,
  categories,
  filters,
  role,
  isSearchSettling,
  onFilterChange,
  onResetFilters,
  onOpenNew,
  onEdit,
  onRestoreDemoData,
}) {
  const hasTransactions = allTransactionsCount > 0
  const noFilteredMatches = hasTransactions && transactions.length === 0

  return (
    <section className="glass-panel section-reveal p-6">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Transactions</p>
          <h2>Search, filter, and review activity</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="tag">{transactions.length} visible rows</span>
          {role === 'admin' ? (
            <button className="btn-primary" onClick={onOpenNew} type="button">
              Add transaction
            </button>
          ) : (
            <span className="tag">Viewer can inspect only</span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr,repeat(3,minmax(0,1fr))]">
        <label className="field">
          <span className="field-label">Search</span>
          <input
            onChange={(event) => onFilterChange('search', event.target.value)}
            placeholder="Category, description, amount..."
            type="search"
            value={filters.search}
          />
        </label>

        <label className="field">
          <span className="field-label">Type</span>
          <select onChange={(event) => onFilterChange('type', event.target.value)} value={filters.type}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Category</span>
          <select
            onChange={(event) => onFilterChange('category', event.target.value)}
            value={filters.category}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Sort</span>
          <select
            onChange={(event) => onFilterChange('sortBy', event.target.value)}
            value={filters.sortBy}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {isSearchSettling ? 'Updating results...' : 'Filters update instantly on the client.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={onResetFilters} type="button">
            Clear filters
          </button>
          {role === 'admin' ? (
            <button className="btn-ghost" onClick={onRestoreDemoData} type="button">
              Restore demo data
            </button>
          ) : null}
        </div>
      </div>

      {!hasTransactions ? (
        <div className="empty-state mt-6">
          <p className="text-lg font-semibold">No transactions stored yet.</p>
          <p className="max-w-md text-sm text-[var(--muted)]">
            The dashboard handles empty data gracefully. Switch to admin mode to restore the
            sample dataset or add your own entries.
          </p>
        </div>
      ) : noFilteredMatches ? (
        <div className="empty-state mt-6">
          <p className="text-lg font-semibold">No transactions match the current filters.</p>
          <p className="max-w-md text-sm text-[var(--muted)]">
            Try broadening the search or resetting filters to see the full ledger again.
          </p>
        </div>
      ) : (
        <>
          <div className="table-shell mt-6 hidden overflow-hidden rounded-[1.6rem] border border-white/25 lg:block">
            <table className="min-w-full overflow-hidden bg-white/60 text-left dark:bg-white/5">
              <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.26em] text-[var(--muted)] dark:bg-white/[0.03]">
                <tr>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    className="transaction-row border-t border-black/5 align-middle dark:border-white/10"
                    key={transaction.id}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-sm text-[var(--muted)]">ID {transaction.id}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--muted)]">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="tag">{transaction.category}</span>
                    </td>
                    <td className="px-5 py-4 capitalize text-[var(--muted)]">
                      {transaction.type}
                    </td>
                    <td className="px-5 py-4">
                      <AmountCell amount={transaction.amount} type={transaction.type} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {role === 'admin' ? (
                        <button
                          className="btn-ghost"
                          onClick={() => onEdit(transaction)}
                          type="button"
                        >
                          Edit
                        </button>
                      ) : (
                        <span className="text-sm text-[var(--muted)]">Read only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 lg:hidden">
            {transactions.map((transaction, index) => (
              <article
                className="data-tile rounded-[1.5rem] border border-white/25 bg-white/60 p-4 dark:bg-white/5"
                style={{ animationDelay: `${90 + index * 50}ms` }}
                key={transaction.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-[var(--muted)]">{formatDate(transaction.date)}</p>
                  </div>
                  <AmountCell amount={transaction.amount} type={transaction.type} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="tag">{transaction.category}</span>
                  <span className="tag capitalize">{transaction.type}</span>
                </div>
                {role === 'admin' ? (
                  <button
                    className="btn-ghost mt-4"
                    onClick={() => onEdit(transaction)}
                    type="button"
                  >
                    Edit transaction
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
