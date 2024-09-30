import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { API_BASE_URL } from '../config';

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("${API_BASE_URL}/register", {
        // Ensure the URL is correct
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store tokens in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        toast.success(data.message || "Registration successful!");
        setTimeout(() => {
          window.location.href = "/"; // Redirect after registration
        }, 500);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.log("Error during registration:", error); // Debug log
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-background dark:bg-background-dark">
      <Toaster />
      <div className="bg-[--primary-color] w-full max-w-md text-center p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-white">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 rounded-md text-black dark:text-white bg-background dark:bg-background-dark focus:outline-none focus:ring focus:ring-primary"
            required
          />

          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded-md text-black dark:text-white bg-background dark:bg-background-dark focus:outline-none focus:ring focus:ring-primary"
            required
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 rounded-md text-black dark:text-white bg-background dark:bg-background-dark focus:outline-none focus:ring focus:ring-primary"
            required
          />

          <button
            type="submit"
            className="p-2 px-4 rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 text-white"
          >
            Register
          </button>
        </form>
        <div>
            <a href="/login" className=" hover:underline  text-white">
              Already have an account? Login here.
            </a>
          </div>
      </div>
    </div>
  );
};

export default RegisterForm;
