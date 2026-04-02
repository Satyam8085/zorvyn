import { useEffect, useState } from 'react'

const emptyDraft = {
  date: '',
  description: '',
  amount: '',
  category: '',
  type: 'expense',
}

export default function TransactionEditorModal({
  isOpen,
  transaction,
  categories,
  onClose,
  onSave,
}) {
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return

    if (transaction) {
      setDraft({
        date: transaction.date,
        description: transaction.description,
        amount: String(transaction.amount),
        category: transaction.category,
        type: transaction.type,
      })
      setError('')
      return
    }

    setDraft({
      ...emptyDraft,
      date: new Date().toISOString().slice(0, 10),
    })
    setError('')
  }, [isOpen, transaction])

  if (!isOpen) return null

  const updateField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!draft.description.trim() || !draft.category.trim() || !draft.date) {
      setError('Please complete description, category, and date.')
      return
    }

    const parsedAmount = Number.parseFloat(draft.amount)

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a number greater than zero.')
      return
    }

    onSave({
      ...transaction,
      date: draft.date,
      description: draft.description.trim(),
      amount: parsedAmount,
      category: draft.category.trim(),
      type: draft.type,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="modal-panel w-full max-w-2xl rounded-[2rem] border border-white/20 bg-[var(--panel-strong)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Admin editor</p>
            <h2 className="mt-2 text-3xl">
              {transaction ? 'Edit transaction' : 'Add a new transaction'}
            </h2>
          </div>
          <button className="btn-ghost" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Description</span>
            <input
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Client invoice"
              value={draft.description}
            />
          </label>

          <label className="field">
            <span className="field-label">Date</span>
            <input
              onChange={(event) => updateField('date', event.target.value)}
              type="date"
              value={draft.date}
            />
          </label>

          <label className="field">
            <span className="field-label">Amount</span>
            <input
              inputMode="decimal"
              min="0"
              onChange={(event) => updateField('amount', event.target.value)}
              placeholder="0.00"
              step="0.01"
              type="number"
              value={draft.amount}
            />
          </label>

          <label className="field">
            <span className="field-label">Type</span>
            <select onChange={(event) => updateField('type', event.target.value)} value={draft.type}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="field md:col-span-2">
            <span className="field-label">Category</span>
            <input
              list="transaction-categories"
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Groceries"
              value={draft.category}
            />
            <datalist id="transaction-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          {error ? (
            <p className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 md:col-span-2">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              {transaction ? 'Save changes' : 'Create transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
