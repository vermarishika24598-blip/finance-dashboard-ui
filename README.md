# 💰 Finance Dashboard

A modern **Finance Dashboard** built with **React**, **Tailwind CSS**, and **Framer Motion**.  

Track **Income**, **Expenses**, **Balance**, and visualize your data with charts and insights. Supports **role-based UI** (Admin / Viewer) and **dark mode**.  

---

## 🚀 Features

- **Dashboard Summary:** Total Income, Total Expense, Balance  
- **Transactions Table:** Date, Category, Type, Amount  
- **Search & Filters:** Search by category/type, filter by Income/Expense, date range  
- **Charts:** Line chart for trends, Pie chart for category distribution  
- **Role-Based Access:**  
  - Viewer → Read-only  
  - Admin → Can add transactions (Income/Expense)  
- **Dark Mode:** Toggle light/dark interface  

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion  
- **State Management:** React Context API  
- **Charts:** Recharts (LineChart, PieChart)  
- **Data Persistence:** LocalStorage (mock data)

---

## ⚙️ Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard
Install dependencies:
npm install
Start the React app:
npm run dev
Open in browser:

Navigate to http://localhost:5173 (or as Vite outputs in your terminal).

🔗 Live Demo

View Live Dashboard

📂 Notes
Admin can add transactions, Viewer has read-only access.
Dark mode persists using localStorage.
All data is mock; no real backend integration.
