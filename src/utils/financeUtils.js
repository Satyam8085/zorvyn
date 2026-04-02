const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short' })
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (value) =>
  value ? dateFormatter.format(new Date(`${value}T00:00:00`)) : 'No date'

export const getSignedAmount = (transaction) =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount

export const getTotalBalance = (transactions) =>
  transactions.reduce((total, transaction) => total + getSignedAmount(transaction), 0)

export const getIncomeTotal = (transactions) =>
  transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

export const getExpenseTotal = (transactions) =>
  transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

export const getMonthlyTrend = (transactions) => {
  const monthlyMap = new Map()

  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7)
    const current = monthlyMap.get(monthKey) ?? {
      monthKey,
      label: monthFormatter.format(new Date(`${monthKey}-01T00:00:00`)),
      income: 0,
      expense: 0,
    }

    if (transaction.type === 'income') current.income += transaction.amount
    else current.expense += transaction.amount

    monthlyMap.set(monthKey, current)
  })

  let runningBalance = 0

  return [...monthlyMap.values()]
    .sort((left, right) => left.monthKey.localeCompare(right.monthKey))
    .map((entry) => {
      const net = entry.income - entry.expense
      runningBalance += net

      return { ...entry, net, balance: runningBalance }
    })
}

export const getSpendingBreakdown = (transactions) => {
  const palette = ['#d97706', '#2563eb', '#14b8a6', '#ef4444', '#8b5cf6', '#0f766e']
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')
  const totalExpense = getExpenseTotal(expenses)
  const totals = new Map()

  expenses.forEach((transaction) => {
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount)
  })

  return [...totals.entries()]
    .map(([category, amount], index) => ({
      category,
      amount,
      share: totalExpense === 0 ? 0 : amount / totalExpense,
      color: palette[index % palette.length],
    }))
    .sort((left, right) => right.amount - left.amount)
}

export const getFilteredTransactions = (transactions, filters) => {
  const normalizedSearch = filters.search.trim().toLowerCase()

  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.date,
        String(transaction.amount),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

    const matchesType = filters.type === 'all' || transaction.type === filters.type
    const matchesCategory =
      filters.category === 'all' || transaction.category === filters.category

    return matchesSearch && matchesType && matchesCategory
  })

  return filtered.sort((left, right) => {
    switch (filters.sortBy) {
      case 'oldest':
        return left.date.localeCompare(right.date)
      case 'highest':
        return right.amount - left.amount
      case 'lowest':
        return left.amount - right.amount
      case 'newest':
      default:
        return right.date.localeCompare(left.date)
    }
  })
}

export const getInsights = (transactions) => {
  const monthlyTrend = getMonthlyTrend(transactions)
  const spendingBreakdown = getSpendingBreakdown(transactions)
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense')
  const highestSpendingCategory = spendingBreakdown[0] ?? null
  const currentMonth = monthlyTrend.at(-1) ?? null
  const previousMonth = monthlyTrend.at(-2) ?? null
  const topExpense =
    [...expenseTransactions].sort((left, right) => right.amount - left.amount)[0] ?? null

  let monthlyComparison = null

  if (currentMonth && previousMonth) {
    const difference = currentMonth.expense - previousMonth.expense
    monthlyComparison = {
      currentLabel: currentMonth.label,
      previousLabel: previousMonth.label,
      difference,
      percentChange:
        previousMonth.expense === 0 ? 0 : (difference / previousMonth.expense) * 100,
    }
  }

  let observation = 'Add or edit transactions to generate richer insights.'

  if (highestSpendingCategory && monthlyComparison) {
    if (monthlyComparison.difference > 0) {
      observation = `${highestSpendingCategory.category} is your biggest cost center, and spending is up ${Math.abs(monthlyComparison.percentChange).toFixed(1)}% versus ${monthlyComparison.previousLabel}.`
    } else if (monthlyComparison.difference < 0) {
      observation = `${highestSpendingCategory.category} still leads spending, but total spend dropped ${Math.abs(monthlyComparison.percentChange).toFixed(1)}% month over month.`
    } else {
      observation = `${highestSpendingCategory.category} remains the biggest cost center while overall spending stayed flat month over month.`
    }
  }

  return {
    highestSpendingCategory,
    monthlyComparison,
    topExpense,
    observation,
  }
}
