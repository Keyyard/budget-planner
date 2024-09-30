import { useState, useEffect } from 'react';
import BudgetInput from "../BudgetInput";
import RecentTransactions from "../RecentTransactions";

const Home = () => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Welcome to your finance tracker</h1>
        <p className="mt-2 text-lg">Track your expenses and income</p>
      </div>
      <BudgetInput addTransaction={addTransaction} />
      <RecentTransactions  />
    </>
  );
};

export default Home;