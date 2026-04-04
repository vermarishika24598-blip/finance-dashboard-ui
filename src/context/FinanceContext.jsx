import React, { createContext, useContext, useState, useEffect } from "react";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [role, setRole] = useState("Viewer");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortBy, setSortBy] = useState("Date"); // default sorting


  // Fetch transactions from Mock API (optional)
  useEffect(() => {
    if (transactions.length === 0) {
      fetch("http://localhost:5000/transactions")
        .then((res) => res.json())
        .then((data) => setTransactions(data))
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add transaction
  const addTransaction = async (txn) => {
    const response = await fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txn),
    });
    const newTxn = await response.json();
    setTransactions([...transactions, newTxn]);
  };

  return (
    <FinanceContext.Provider
      value={{
  transactions,
  search,
  setSearch,
  filterType,
  setFilterType,
  role,
  setRole,
  addTransaction,
  filterCategory,
  setFilterCategory,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
}}

    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
