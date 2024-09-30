import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import AddTag from "../AddTag";
import { Toaster, toast } from "react-hot-toast";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserData();
      setUser(userData);
    };

    fetchUser();
  }, []);

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
    fetchTags();
  }, []);

  const handleAddTag = (newTag) => {
    setTags([...tags, newTag]);
    toast.success("Tag added successfully");
  };

  const handleClickOpen = (tagId) => {
    setTagToDelete(tagId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTagToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/tags/${tagToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (res.ok) {
        setTags(tags.filter((tag) => tag.id !== tagToDelete));
        toast.success("Tag deleted successfully");
      } else {
        console.error("Failed to delete tag");
      }
    } catch (error) {
      console.error("Error during tag deletion:", error);
    } finally {
      handleClose();
    }
  };

  const handleLogout = () => {
    const logoutUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          // clean up localStorage
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
          toast.success(data.message || "Logout successful");
          window.location.href = "/login";
        } else {
          toast.error(data.error || "Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // clean up localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    };

    logoutUser();
  };

  const getUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
      return null;
    }

    const response = await fetch("http://localhost:5000/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch user data", errorData);
      return null;
    }
  };

  return (
    <div className="settings-container p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {user && (
        <div className="mb-4">
          <div>Welcome back, {user.logged_in_as}</div>{" "}
        </div>
      )}
      {!user && (
        <div>
          <p>You are not logged in.</p>
          <div>
            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="mb-4 p-2 bg-primary text-white rounded shadow"
            >
              Login
            </button>
            <button
              onClick={() => {
                window.location.href = "/register";
              }}
              className="mb-4 p-2 ml-2 bg-primary text-white rounded shadow"
            >
              Register
            </button>
          </div>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Add New Tag</h2>
        <AddTag onAddTag={handleAddTag} />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Existing Tags</h2>
        <ul>
          {tags.map((tag) => (
            <li
              key={tag.id}
              style={{ backgroundColor: tag.color }}
              className="p-1 mb-1 rounded flex justify-between items-center border border-gray-300"
            >
              <span>{tag.name}</span>
              <button
                onClick={() => handleClickOpen(tag.id)}
                className="bg-red-500 text-white p-1 rounded flex items-center justify-center"
                style={{ width: "24px", height: "24px" }}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
      {user && (
        <div>
          <button
            onClick={handleLogout}
            className="mb-4 p-2 bg-red-500 text-white rounded shadow"
          >
            Logout
          </button>
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tag?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;
