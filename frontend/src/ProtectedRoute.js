import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;