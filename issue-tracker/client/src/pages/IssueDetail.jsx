// src/pages/IssueDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { fetchIssue, deleteIssue, updateIssue } from '../services/api';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    const getIssue = async () => {
      try {
        const data = await fetchIssue(id);
        setIssue(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load issue details');
        setLoading(false);
      }
    };
    getIssue();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    
    setActionLoading(true);
    try {
      await deleteIssue(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete issue');
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!issue || issue.status === newStatus) return;
    
    setActionLoading(true);
    try {
      const updatedIssue = await updateIssue(id, { status: newStatus });
      setIssue(updatedIssue);
      setShowStatusMenu(false);
    } catch (err) {
      setError('Failed to update status');
    }
    setActionLoading(false);
  };

  const handleCloseIssue = () => {
    handleStatusChange('Closed');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Issue</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <Link 
              to="/" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <XMarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Issue Not Found</h2>
          <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse All Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Issues
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Issue Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        issue.status === 'Open' ? 'bg-green-100 text-green-800' :
                        issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        issue.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                        issue.status === 'Resolved' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      } flex items-center gap-1`}
                    >
                      {issue.status}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showStatusMenu && (
                      <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                        <div className="px-4 py-2 text-xs text-gray-500">Change status to:</div>
                        {['Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
                          <button
                            key={status}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                              issue.status === status ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleStatusChange(status)}
                          >
                            {issue.status === status && (
                              <CheckCircleIcon className="h-4 w-4 mr-2 text-blue-600" />
                            )}
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span className={`font-medium ${
                      issue.priority === 'High' || issue.priority === 'Critical' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {issue.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>ID: {issue._id}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {issue.status !== 'Closed' && (
                  <button 
                    onClick={handleCloseIssue}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center disabled:opacity-70"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    <span>Close Issue</span>
                  </button>
                )}
                
                <button 
                  onClick={() => navigate(`/edit/${issue._id}`)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-70"
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  <span>Edit Issue</span>
                </button>
                
                <button 
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center disabled:opacity-70"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Issue Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <div className="flex items-center mb-3">
                  <DocumentTextIcon className="h-6 w-6 text-gray-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Issue created</p>
                      <p className="text-sm text-gray-500">by John Doe</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(issue.createdAt)}</p>
                    </div>
                  </div>
                  
                  {issue.updatedAt && (
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Issue updated</p>
                        <p className="text-sm text-gray-500">by Jane Smith</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(issue.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Metadata Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${
                      issue.status === 'Open' ? 'text-green-600' :
                      issue.status === 'In Progress' ? 'text-yellow-600' :
                      issue.status === 'Closed' ? 'text-gray-600' :
                      'text-blue-600'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority</span>
                    <span className={`font-medium ${
                      issue.priority === 'High' || issue.priority === 'Critical' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">{formatDate(issue.createdAt)}</span>
                  </div>
                  
                  {issue.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-900">{formatDate(issue.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Assignee</h2>
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                    <div className="bg-gray-400 border-2 border-dashed rounded-xl w-8 h-8" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Unassigned</p>
                    <p className="text-sm text-gray-500">Assign to yourself or team member</p>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 text-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Assign to me
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Issues</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm text-gray-900 truncate">Fix login page responsiveness on mobile</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <p className="text-sm text-gray-900 truncate">Add password validation requirements</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                    <p className="text-sm text-gray-900 truncate">Update user profile API endpoint</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {actionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Processing your request...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}