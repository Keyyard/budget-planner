import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { API_BASE_URL } from '../config';

const BudgetInput = ({ addTransaction }) => {
  const [amount, setAmount] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("${API_BASE_URL}/tags", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setTags(data);
        } else {
          console.error("Tags response is not an array:", data);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount && tag) {
      const transaction = { amount: parseFloat(amount), tag_id: tag };
      console.log("Submitting transaction:", transaction); // Debugging statement
      console.log("JWT Token:", localStorage.getItem("access_token")); // Debugging statement
      try {
        const res = await fetch("${API_BASE_URL}/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(transaction),
        });

        if (res.ok) {
          addTransaction(transaction);
          setAmount("");
          setTag("");
            window.location.reload();
        } else {
          const errorData = await res.json();
          console.error("Failed to add transaction:", errorData); // Log the error response
        }
      } catch (error) {
        console.error("Error during transaction submission:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-background dark:bg-background-dark">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-1 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-[var(--background-light)] dark:bg-[var(--background-dark)]"
          placeholder="Enter amount"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full p-1 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-[var(--background-light)] dark:bg-[var(--background-dark)]"
        >
          <option value="" className="text-[var(--text-color)]">
            Select tag
          </option>{" "}
          {tags.map((t) => (
            <option
              key={t.id}
              value={t.id}
              style={{ backgroundColor: t.color }}
            >
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-primary dark:bg-primary-dark text-white rounded-md"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};
BudgetInput.propTypes = {
  addTransaction: PropTypes.func.isRequired,
};

export default BudgetInput;
