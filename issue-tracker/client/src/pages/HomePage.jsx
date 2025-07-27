// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import Filters from '../components/Filters';
import { fetchIssues } from '../services/api';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    searchTerm: '',
    statuses: [],
    priorities: [],
    startDate: '',
    endDate: ''
  });

  // Fetch issues on mount
  useEffect(() => {
    const getIssues = async () => {
      try {
        const data = await fetchIssues();
        setAllIssues(data);
        setFilteredIssues(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load issues');
        setLoading(false);
      }
    };
    getIssues();
  }, [user]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...allIssues];
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) || 
        issue.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.statuses.length > 0) {
      result = result.filter(issue => 
        filters.statuses.includes(issue.status)
      );
    }
    
    if (filters.priorities.length > 0) {
      result = result.filter(issue => 
        filters.priorities.includes(issue.priority)
      );
    }
    
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      result = result.filter(issue => 
        new Date(issue.createdAt) >= start
      );
    }
    
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59);
      result = result.filter(issue => 
        new Date(issue.createdAt) <= end
      );
    }
    
    setFilteredIssues(result);
  }, [allIssues, filters]);

  // Group issues by status
  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    if (!acc[issue.status]) {
      acc[issue.status] = [];
    }
    acc[issue.status].push(issue);
    return acc;
  }, {});

  const statusOrder = ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'];
  const sortedStatuses = statusOrder.filter(status => groupedIssues[status]);

  if (loading) {
    return <div className="text-center py-12">Loading issues...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Dashboard</Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">All Issues</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar - smaller width */}
        <div className="lg:w-1/5">
          
            <Filters onFilterChange={setFilters} compact />
          
        </div>
        
        {/* Issues list - larger width */}
        <div className="lg:w-4/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {filteredIssues.length} {filteredIssues.length === 1 ? 'Issue' : 'Issues'}
            </h1>
            <Link
              to="/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-70" >
              + Create New Issue
            </Link>
          </div>


          {/* Grouped issues by status */}
          {sortedStatuses.length > 0 ? (
            <div className="space-y-8">
              {sortedStatuses.map(status => (
                <div key={status} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {status} ({groupedIssues[status].length})
                    </h2>
                    <Link 
                      to={`/create?status=${status.toLowerCase().replace(' ', '-')}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                    
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedIssues[status].map(issue => (
                      <IssueCard 
                        key={issue._id} 
                        issue={issue} 
                        onStatusChange={(newStatus) => {
                          const updatedIssues = allIssues.map(i => 
                            i._id === issue._id ? {...i, status: newStatus} : i
                          );
                          setAllIssues(updatedIssues);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-gray-500 mb-4">No issues match your filters</div>
              <button 
                onClick={() => setFilters({
                  searchTerm: '',
                  statuses: [],
                  priorities: [],
                  startDate: '',
                  endDate: ''
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}