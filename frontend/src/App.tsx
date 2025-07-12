import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import QAHomepage from './pages/Home'
import StackItNavbar from './components/Navbar'
import QuestionDetailPage from './pages/QuestionDetail'
import StackItLanding from './pages/Landing'
import AskQuestionPage from './pages/PostQuestion'
import AuthComponent from './pages/Auth'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Auth Route Component (redirect if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <StackItNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<StackItLanding />} />
          <Route 
            path="/auth" 
            element={
              <AuthRoute>
                <AuthComponent />
              </AuthRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <QAHomepage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ask" 
            element={
              <ProtectedRoute>
                <AskQuestionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/question/:id" 
            element={
              <ProtectedRoute>
                <QuestionDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
