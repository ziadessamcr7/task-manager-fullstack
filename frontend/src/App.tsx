import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Protected Route Component
// Redirects to login if user is not authenticated
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Check authentication synchronously on every render
  // This ensures we always check the current token state
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
}

// Public Route Component (for login/register)
// Redirects to tasks if user is already authenticated
const PublicRoute = ({ children }: PublicRouteProps) => {
  // Check authentication synchronously on every render
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Redirect to tasks if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - redirect to /tasks if authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected route - redirect to /login if not authenticated */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Default route - redirect to /tasks if authenticated, else /login */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

