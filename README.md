# Zorvyn Finance Dashboard 

A frontend only finance dashboard built with Vite, React, and Tailwind CSS.

## Overview

This project is a clean and interactive finance dashboard for tracking financial activity with mock data. It includes summary cards, charts, transaction management, role based UI behavior, insights, responsive layouts, dark mode, animations, local storage persistence, and JSON export.

## Features

### Dashboard Overview

- Total Balance summary card
- Income summary card
- Expenses summary card
- Time based balance trend chart
- Categorical spending breakdown chart

### Transactions Section

- Transaction list with date, amount, category, type, and description
- Search by text
- Filter by type
- Filter by category
- Sort by newest, oldest, highest amount, and lowest amount
- Responsive table on desktop and card layout on mobile

### Role Based UI

- Viewer can inspect data only
- Admin can add transactions
- Admin can edit transactions
- Role switcher in the header for demo purposes

### Insights Section

- Highest spending category
- Monthly comparison
- Largest expense
- Helpful observation generated from the current data

### State Management

The app uses `useReducer`, `useMemo`, `useEffect`, and `useDeferredValue` to manage:

- transactions data
- filters
- selected role
- theme
- derived dashboard calculations

### UI and UX

- Responsive design for desktop and mobile
- Empty state handling for charts and transaction views
- Light mode and dark mode
- Smooth entrance and hover animations
- Reduced motion support

### Optional Enhancements Included

- Local storage persistence
- JSON export
- UI animations and transitions

## Tech Stack

- Vite
- React
- Tailwind CSS

## Project Structure

```text
src/
  components/
    BalanceTrendChart.jsx
    DashboardHeader.jsx
    SpendingBreakdownChart.jsx
    SpendingInsightsPanel.jsx
    SummaryMetricCard.jsx
    TransactionEditorModal.jsx
    TransactionsSection.jsx
  data/
    sampleTransactions.js
  utils/
    financeUtils.js
  FinanceDashboard.jsx
  index.css
  main.jsx
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

- This is a frontend only project with mock data.
- Currency is displayed in Indian rupees.
- Transactions are saved in local storage.
- Export downloads the current transactions as a JSON file.

## Assignment Coverage

This project includes all core assignment requirements:

- dashboard overview
- transactions section
- role based UI
- insights section
- state management
- responsive and readable UI
- graceful empty states

