// src/components/Filters.jsx
import { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Filters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Status and priority options
  const statusOptions = ['Open', 'In Progress', 'Testing', 'Resolved', 'Closed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {
      searchTerm,
      statuses: selectedStatuses,
      priorities: selectedPriorities,
      startDate,
      endDate
    };
    onFilterChange(filters);
  }, [searchTerm, selectedStatuses, selectedPriorities, startDate, endDate]);

  // Toggle status selection
  const toggleStatus = (status) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  // Toggle priority selection
  const togglePriority = (priority) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority) 
        : [...prev, priority]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setStartDate('');
    setEndDate('');
  };

  // Status suggestions for search bar
  const statusSuggestions = statusOptions.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          Clear all
          <XMarkIcon className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        {/* Status Suggestions */}
        {showSuggestions && searchTerm && statusSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="px-3 py-2 text-xs text-gray-500">Status suggestions:</div>
            {statusSuggestions.map(status => (
              <button
                key={status}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                onMouseDown={() => {
                  setSearchTerm('');
                  toggleStatus(status);
                }}
              >
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Filters */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Status</h3>
        <div className="space-y-2">
          {statusOptions.map(status => (
            <label key={status} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={() => toggleStatus(status)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Priority</h3>
        <div className="space-y-2">
          {priorityOptions.map(priority => (
            <label key={priority} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedPriorities.includes(priority)}
                onChange={() => togglePriority(priority)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Date Range</h3>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedStatuses.length > 0 || selectedPriorities.length > 0 || startDate || endDate) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedStatuses.map(status => (
              <span 
                key={status}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center"
              >
                {status}
                <button 
                  onClick={() => toggleStatus(status)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {selectedPriorities.map(priority => (
              <span 
                key={priority}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"
              >
                {priority}
                <button 
                  onClick={() => togglePriority(priority)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {startDate && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                From: {new Date(startDate).toLocaleDateString()}
                <button 
                  onClick={() => setStartDate('')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {endDate && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                To: {new Date(endDate).toLocaleDateString()}
                <button 
                  onClick={() => setEndDate('')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}