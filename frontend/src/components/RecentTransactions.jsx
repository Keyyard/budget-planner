import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [tags, setTags] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/tags", {
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

    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await res.json();
        console.log("Fetched transactions:", data); // Debugging statement
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Transactions response is not an array:", data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTags();
    fetchTransactions();
  }, []);

  const getTagDetails = (tagId) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? { name: tag.name, color: tag.color } : { name: 'Unknown', color: '#FFFFFF' };
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  const handleEditOpen = (transaction) => {
    setCurrentTransaction(transaction);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentTransaction(null);
  };

  const handleDeleteOpen = (transaction) => {
    setCurrentTransaction(transaction);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setCurrentTransaction(null);
  };

  const handleEditConfirm = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/transactions/${currentTransaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(currentTransaction),
        }
      );

      if (res.ok) {
        setTransactions(
          transactions.map((t) =>
            t.id === currentTransaction.id ? currentTransaction : t
          )
        );
        toast.success("Transaction updated successfully");
      } else {
        toast.error("Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Error updating transaction");
    } finally {
      handleEditClose();
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/transactions/${currentTransaction.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.ok) {
        setTransactions(
          transactions.filter((t) => t.id !== currentTransaction.id)
        );
        toast.success("Transaction deleted successfully");
      } else {
        toast.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error deleting transaction");
    } finally {
      handleDeleteClose();
    }
  };

  return (
    <div className="p-4 bg-background dark:bg-background-dark">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => {
            const { name, color } = getTagDetails(transaction.tag_id);
            return (
              <li
                key={transaction.id}
                className="mb-2 p-4 border rounded shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {formatNumber(transaction.amount)} VND
                  </span>
                  <span
                    className="p-1 rounded text-gray-600"
                    style={{ backgroundColor: color }}
                  >
                    {name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(transaction.date).toLocaleString()}
                  </div>
                  <div className="flex ml-auto">
                    <button
                      onClick={() => handleEditOpen(transaction)}
                      className="mx-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOpen(transaction)}
                      className="mx-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

{/* Edit Dialog */}
<Dialog open={openEdit} onClose={handleEditClose}>
  <DialogTitle>Edit Transaction</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      label="Amount"
      type="number"
      fullWidth
      value={currentTransaction?.amount || ""}
      onChange={(e) =>
        setCurrentTransaction({
          ...currentTransaction,
          amount: e.target.value,
        })
      }
    />
    <FormControl fullWidth margin="dense" style={{ marginTop: '16px' }}>
      <InputLabel style={{ backgroundColor: 'white', padding: '0 4px' }}>Tag</InputLabel>
      <Select
        value={currentTransaction?.tag_id || ""}
        onChange={(e) =>
          setCurrentTransaction({
            ...currentTransaction,
            tag_id: e.target.value,
          })
        }
      >
        {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag.id}>
            {tag.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleEditClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleEditConfirm} color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

RecentTransactions.propTypes = {
  newTransaction: PropTypes.object,
};

export default RecentTransactions;
