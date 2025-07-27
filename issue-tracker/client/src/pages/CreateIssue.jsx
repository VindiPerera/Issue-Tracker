// src/pages/CreateIssue.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IssueForm from '../components/IssueForm';
import { createIssue } from '../services/api';

export default function CreateIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open'
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await createIssue(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create issue');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Issue</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <IssueForm 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleSubmit} 
        buttonText="Create Issue"
      />
    </div>
  );
}