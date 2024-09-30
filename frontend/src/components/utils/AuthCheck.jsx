import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    // If no token found, redirect to login
    if (!accessToken) {
      navigate("/login");
    } else {
      // Check if the token is still valid by calling a protected route
      fetch("http://localhost:5000/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            // If the token is invalid, remove it and redirect to login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Token validation failed", err);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        });
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the children (protected routes) only if the token exists and is valid
  return <>{children}</>;
};

export default AuthCheck;