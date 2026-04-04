# 💰 Finance Dashboard

A modern **Finance Dashboard** built with **React + Tailwind CSS + Framer Motion**, powered by a **Mock API (json-server)**.  
This project helps track **Income, Expenses, Balance**, and provides **Charts, Filters, Insights, and Export options**.

---

## 🚀 Features

- 🔍 **Search & Filters**
  - Search by category/type
  - Filter by Income/Expense
  - Advanced filters: Category + Date Range

- 📊 **Visualizations**
  - Line Chart for trends
  - Pie Chart for category distribution
  - Insights component for quick analysis

- 👥 **Role-based Access**
  - Viewer → Read-only access
  - Admin → Can add new transactions

- 📂 **Data Management**
  - Transactions stored in `db.json` via `json-server`
  - Add new transactions dynamically
  - Export transactions to **CSV**

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion  
- **State Management:** React Context API  
- **Backend (Mock API):** json-server  
- **Charts:** Recharts / Chart.js (depending on your setup)

---

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/finance-dashboard.git
   cd finance-dashboard



Install dependencies:


npm install
Start the mock API:

npx json-server --watch db.json --port 5000
Start the React app:


npm run dev