import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import Filters from '../components/Filters';
import { fetchIssues } from '../services/api';
import { ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
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
  const [showFilters, setShowFilters] = useState(true); // toggle sidebar

  // Fetch issues
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

  // Apply filters
  useEffect(() => {
    let result = [...allIssues];
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(issue =>
        issue.title.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term)
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
      result = result.filter(issue => new Date(issue.createdAt) >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59);
      result = result.filter(issue => new Date(issue.createdAt) <= end);
    }

    setFilteredIssues(result);
  }, [filters, allIssues]);

  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    if (!acc[issue.status]) acc[issue.status] = [];
    acc[issue.status].push(issue);
    return acc;
  }, {});

  const statusOrder = ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'];
  const sortedStatuses = statusOrder.filter(status => groupedIssues[status]);

  if (loading) return <div className="text-center py-12">Loading issues...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Dashboard</Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">All Issues</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className="px-3 py-2 bg-gray-100 text-sm text-gray-700 rounded-md hover:bg-gray-200"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Sidebar Filters */}
        <div className={`transition-all duration-300 ${showFilters ? 'lg:w-1/5' : 'lg:w-0'} overflow-hidden`}>
          {showFilters && (
            <Filters onFilterChange={setFilters} />
          )}
        </div>
        

        {/* Main Content */}
        <div className="lg:w-4/5 w-full">
        
          <div className="flex justify-between items-center mb-6">
            {/* Toggle Sidebar Button (Desktop) */}
              <div className="hidden lg:flex flex-col justify-start mt-1">
                    <button
                      onClick={() => setShowFilters(prev => !prev)}
                      className="p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"
                      title={showFilters ? 'Hide Filters' : 'Show Filters'}
                    >
                      {showFilters ? (
                        <ChevronDoubleLeftIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDoubleRightIcon className="w-5 h-5" />
                      )}
                    </button>
              </div>
            {/* <h1 className="text-2xl font-bold text-gray-800">
              {filteredIssues.length} {filteredIssues.length === 1 ? 'Issue' : 'Issues'}
            </h1> */}
            <Link
              to="/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              + Create New Issue
            </Link>
          </div>

          {/* Grouped Issues */}
          {sortedStatuses.length > 0 ? (
            <div className="space-y-8">
              {sortedStatuses.map(status => (
                <div key={status} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {status} ({groupedIssues[status].length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedIssues[status].map(issue => (
                      <IssueCard
                        key={issue._id}
                        issue={issue}
                        onStatusChange={(newStatus) => {
                          const updated = allIssues.map(i =>
                            i._id === issue._id ? { ...i, status: newStatus } : i
                          );
                          setAllIssues(updated);
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
