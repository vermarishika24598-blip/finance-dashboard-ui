import React, { createContext, useContext, useState, useEffect } from "react";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [role, setRole] = useState("Viewer");
  const [filterCategory, setFilterCategory] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortBy, setSortBy] = useState("Date");

  // ✅ SAVE to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ✅ ADD TRANSACTION (NO API)
  const addTransaction = (txn) => {
    const newTxn = {
      ...txn,
      id: Date.now() // unique id
    };
    setTransactions((prev) => [...prev, newTxn]);
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
