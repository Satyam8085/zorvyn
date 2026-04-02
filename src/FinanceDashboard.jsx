import { useDeferredValue, useEffect, useMemo, useReducer } from 'react'
import BalanceTrendChart from './components/BalanceTrendChart'
import DashboardHeader from './components/DashboardHeader'
import SpendingBreakdownChart from './components/SpendingBreakdownChart'
import SpendingInsightsPanel from './components/SpendingInsightsPanel'
import SummaryMetricCard from './components/SummaryMetricCard'
import TransactionEditorModal from './components/TransactionEditorModal'
import TransactionsSection from './components/TransactionsSection'
import { defaultCategories, initialTransactions } from './data/sampleTransactions'
import {
  formatDate,
  getExpenseTotal,
  getFilteredTransactions,
  getIncomeTotal,
  getInsights,
  getMonthlyTrend,
  getSpendingBreakdown,
  getTotalBalance,
} from './utils/financeUtils'

const STORAGE_KEYS = {
  theme: 'zorvyn-theme',
  transactions: 'zorvyn-transactions',
}

const defaultFilters = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'newest',
}

const createInitialState = () => {
  let storedTransactions = null

  try {
    storedTransactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) ?? 'null')
  } catch {
    storedTransactions = null
  }

  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme)

  return {
    role: 'admin',
    theme: storedTheme === 'dark' ? 'dark' : 'light',
    filters: { ...defaultFilters },
    transactions: Array.isArray(storedTransactions) ? storedTransactions : initialTransactions,
    isModalOpen: false,
    editingTransaction: null,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        role: action.value,
        isModalOpen: action.value === 'viewer' ? false : state.isModalOpen,
        editingTransaction: action.value === 'viewer' ? null : state.editingTransaction,
      }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.key]: action.value,
        },
      }
    case 'RESET_FILTERS':
      return { ...state, filters: { ...defaultFilters } }
    case 'OPEN_CREATE':
      return { ...state, isModalOpen: true, editingTransaction: null }
    case 'OPEN_EDIT':
      return { ...state, isModalOpen: true, editingTransaction: action.transaction }
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, editingTransaction: null }
    case 'SAVE_TRANSACTION': {
      const incoming = action.transaction
      const updatedTransactions = incoming.id
        ? state.transactions.map((transaction) =>
            transaction.id === incoming.id ? incoming : transaction,
          )
        : [
            {
              ...incoming,
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `txn-${Date.now()}`,
            },
            ...state.transactions,
          ]

      return {
        ...state,
        transactions: updatedTransactions,
        isModalOpen: false,
        editingTransaction: null,
      }
    }
    case 'RESTORE_DEMO_DATA':
      return {
        ...state,
        transactions: initialTransactions,
        filters: { ...defaultFilters },
        isModalOpen: false,
        editingTransaction: null,
      }
    default:
      return state
  }
}

function downloadJsonFile(transactions) {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'zorvyn-finance-data.json'
  link.click()
  URL.revokeObjectURL(url)
}

export default function FinanceDashboard() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const deferredSearch = useDeferredValue(state.filters.search)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(state.transactions))
  }, [state.transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, state.theme)
  }, [state.theme])

  const categories = useMemo(
    () =>
      [...new Set([...defaultCategories, ...state.transactions.map((item) => item.category)])].sort(),
    [state.transactions],
  )

  const filteredTransactions = useMemo(
    () =>
      getFilteredTransactions(state.transactions, {
        ...state.filters,
        search: deferredSearch,
      }),
    [
      state.transactions,
      state.filters.type,
      state.filters.category,
      state.filters.sortBy,
      deferredSearch,
    ],
  )

  const monthlyTrend = useMemo(() => getMonthlyTrend(state.transactions), [state.transactions])
  const spendingBreakdown = useMemo(() => getSpendingBreakdown(state.transactions), [state.transactions])
  const insights = useMemo(() => getInsights(state.transactions), [state.transactions])
  const totalBalance = useMemo(() => getTotalBalance(state.transactions), [state.transactions])
  const incomeTotal = useMemo(() => getIncomeTotal(state.transactions), [state.transactions])
  const expenseTotal = useMemo(() => getExpenseTotal(state.transactions), [state.transactions])
  const latestTransaction = useMemo(
    () =>
      [...state.transactions].sort((left, right) => right.date.localeCompare(left.date))[0] ?? null,
    [state.transactions],
  )

  const netLabel =
    incomeTotal === 0 ? 'No inflow yet' : `${((totalBalance / incomeTotal) * 100).toFixed(0)}% retained`

  return (
    <div className="app-shell" data-theme={state.theme}>
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="ambient-grid" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <DashboardHeader
          lastTransactionDate={latestTransaction ? formatDate(latestTransaction.date) : ''}
          onExport={() => downloadJsonFile(state.transactions)}
          onRoleChange={(value) => dispatch({ type: 'SET_ROLE', value })}
          onThemeToggle={() => dispatch({ type: 'TOGGLE_THEME' })}
          role={state.role}
          theme={state.theme}
          transactionCount={state.transactions.length}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryMetricCard
            index={0}
            label="Total balance"
            tone="balance"
            value={totalBalance}
            delta={netLabel}
          />
          <SummaryMetricCard
            index={1}
            label="Income"
            tone="income"
            value={incomeTotal}
            delta="All inflows"
          />
          <SummaryMetricCard
            index={2}
            label="Expenses"
            tone="expense"
            value={expenseTotal}
            delta="Tracked outflows"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <BalanceTrendChart trend={monthlyTrend} />
          <SpendingBreakdownChart breakdown={spendingBreakdown} />
        </section>

        <SpendingInsightsPanel insights={insights} role={state.role} />

        <TransactionsSection
          allTransactionsCount={state.transactions.length}
          categories={categories}
          filters={state.filters}
          isSearchSettling={state.filters.search !== deferredSearch}
          onEdit={(transaction) => dispatch({ type: 'OPEN_EDIT', transaction })}
          onFilterChange={(key, value) => dispatch({ type: 'SET_FILTER', key, value })}
          onOpenNew={() => dispatch({ type: 'OPEN_CREATE' })}
          onResetFilters={() => dispatch({ type: 'RESET_FILTERS' })}
          onRestoreDemoData={() => dispatch({ type: 'RESTORE_DEMO_DATA' })}
          role={state.role}
          transactions={filteredTransactions}
        />

        <footer className="px-1 pb-4 text-sm text-[var(--muted)]">
          
        </footer>
      </div>

      <TransactionEditorModal
        categories={categories}
        isOpen={state.role === 'admin' && state.isModalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSave={(transaction) => dispatch({ type: 'SAVE_TRANSACTION', transaction })}
        transaction={state.editingTransaction}
      />
    </div>
  )
}
