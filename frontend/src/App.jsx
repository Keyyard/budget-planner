import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Settings from "./components/layout/Settings";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import AuthCheck from "./components/utils/AuthCheck";
import ColorThemeToggle from "./components/ColorThemeToggle";
import Home from "./components/layout/Home";
import RecentTransactions from "./components/RecentTransactions";
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background dark:bg-background-dark text-text-color dark:text-white pb-16">
        <ColorThemeToggle />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/"
            element={
              <AuthCheck>
                <Home />
              </AuthCheck>
            }
          />
          <Route
            path="/transactions"
            element={
              <AuthCheck>
                <RecentTransactions />
              </AuthCheck>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthCheck>
                <Settings />
              </AuthCheck>
            }
          />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
};

export default App;