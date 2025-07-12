import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function StackItNavbar({ isAuthenticated, onLogout }: NavbarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    onLogout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleHomeClick = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handleAskQuestion = () => {
    navigate('/ask');
  };

  return (
    <div className="bg-slate-800 text-white">

      {/* Main Navbar */}
      <nav className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={handleHomeClick}
            className="text-2xl font-bold hover:text-blue-300 transition-colors"
          >
            StackIt
          </button>

          {/* Center Navigation */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAskQuestion}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Ask Question
              </button>
            </div>
          )}

          {/* Right Side - Login/User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    <User className="w-6 h-6 text-white" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Settings
                      </a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        My Questions
                      </a>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login Button */
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}