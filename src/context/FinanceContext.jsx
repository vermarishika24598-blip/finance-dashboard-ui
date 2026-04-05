import React, { createContext, useContext, useState, useEffect } from "react";

// 🔥 Context Create
const FinanceContext = createContext();

// 🔥 Custom Hook
export const useFinance = () => useContext(FinanceContext);

// 🔥 Provider Component
export const FinanceProvider = ({ children }) => {
  // ✅ Transactions with LocalStorage persistence
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Role with LocalStorage persistence
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem("role");
    return savedRole ? savedRole : "Admin";
  });

  // Filters & Search
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortBy, setSortBy] = useState("Date");

  // 🔥 Save to LocalStorage whenever transactions or role change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  // ➕ Add Transaction
  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: Date.now() },
    ]);
  };

  // 🔄 Edit Transaction (optional)
  const editTransaction = (id, updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  // ❌ Delete Transaction (optional)
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        role,
        setRole,
        search,
        setSearch,
        filterType,
        setFilterType,
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
