// src/components/IssueCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const statusOptions = [
  { value: 'Open', color: 'bg-red-100 text-red-800' },
  { value: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'In Review', color: 'bg-blue-100 text-blue-800' },
  { value: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'Closed', color: 'bg-gray-100 text-gray-800' },
];

const priorityColors = {
  High: 'text-red-600',
  Medium: 'text-yellow-600',
  Low: 'text-green-600'
};

export default function IssueCard({ issue, onStatusChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentStatus = statusOptions.find(opt => opt.value === issue.status);

  const handleStatusChange = (newStatus) => {
    onStatusChange(newStatus);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <Link to={`/issue/${issue._id}`} className="block flex-1">
          <h3 className="font-semibold text-gray-800 hover:text-blue-600">
            {issue.title}
          </h3>
        </Link>
        
        {/* Status dropdown */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus.color} flex items-center`}
          >
            {issue.status}
            <ChevronDownIcon className="ml-1 h-3 w-3" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.preventDefault();
                    handleStatusChange(option.value);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm ${option.value === issue.status ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Link to={`/issue/${issue._id}`} className="block">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{issue.description}</p>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className={`font-medium ${priorityColors[issue.priority] || 'text-gray-600'}`}>
            {issue.priority} Priority
          </span>
          <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
        
        {issue.assignee && (
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 mr-2">Assigned to:</span>
            <div className="flex items-center">
              <img 
                src={`https://ui-avatars.com/api/?name=${issue.assignee}&background=random`}
                alt={issue.assignee}
                className="w-5 h-5 rounded-full mr-1"
              />
              <span className="text-xs font-medium">{issue.assignee}</span>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}