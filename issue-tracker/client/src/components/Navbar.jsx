// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    
    <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Logo and Site Name */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img
                src="https://www.freeiconspng.com/uploads/warning-problem-icon-png-21.png"
                alt="Issue Tracker Logo"
                className="w-10 h-10"
              />
              <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
                Issue Tracker
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

         

          {/* Right Side: Auth and User Controls */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <button className="relative p-1 rounded-full hover:bg-indigo-700 transition duration-300">
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <span className="text-sm font-medium">{user.username}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 hidden group-hover:block bg-indigo-800 mt-2 py-2 w-48 rounded-md shadow-xl z-10">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-indigo-700">Your Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-indigo-700">Settings</Link>
                    <div className="border-t border-indigo-700"></div>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-700 text-red-300 hover:text-red-200"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
                
               
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300 border border-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition duration-300 font-semibold shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}