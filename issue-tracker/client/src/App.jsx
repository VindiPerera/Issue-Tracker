// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateIssue from './pages/CreateIssue';
import IssueDetail from './pages/IssueDetail';
import EditIssue from './pages/EditIssue';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } />
            <Route path="/create" element={
              <PrivateRoute>
                <CreateIssue />
              </PrivateRoute>
            } />
            <Route path="/issue/:id" element={
              <PrivateRoute>
                <IssueDetail />
              </PrivateRoute>
            } />
            <Route path="/edit/:id" element={
              <PrivateRoute>
                <EditIssue />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="py-4 text-center text-gray-600 text-sm border-t">
          Issue Tracker © {new Date().getFullYear()}
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;