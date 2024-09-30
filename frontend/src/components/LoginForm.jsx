import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { API_BASE_URL } from '../config';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("${API_BASE_URL}/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        toast.success(data.error || "Login successful!");
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-background dark:bg-background-dark">
      <Toaster />
      <div className="bg-[--primary-color] w-full max-w-md text-center p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 rounded-md text-black dark:text-white bg-background dark:bg-background-dark focus:outline-none focus:ring focus:ring-primary"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded-md text-black dark:text-white bg-background dark:bg-background-dark focus:outline-none focus:ring focus:ring-primary"
            required
          />

          <button
            type="submit"
            className="p-2 px-4 rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 text-white"
          >
            Login
          </button>
        </form>
        <div>
          <a href="/register" className="hover:underline text-white">
            Do not have an account? Register here.
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
