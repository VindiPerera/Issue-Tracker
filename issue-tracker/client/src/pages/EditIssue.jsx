// src/pages/EditIssue.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IssueForm from '../components/IssueForm';
import { fetchIssue, updateIssue } from '../services/api';

export default function EditIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getIssue = async () => {
      try {
        const data = await fetchIssue(id);
        setFormData({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load issue');
        setLoading(false);
      }
    };

    getIssue();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await updateIssue(id, formData);
      navigate(`/issue/${id}`);
    } catch (err) {
      setError('Failed to update issue');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading issue...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Issue</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {formData && (
        <IssueForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleSubmit} 
          buttonText="Update Issue"
        />
      )}
    </div>
  );
}