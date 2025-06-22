import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    url: '',
    notes: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create job');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit job');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Add New Job</h1>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '500px',
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}>
        <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
        <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="url" name="url" placeholder="Job URL" value={formData.url} onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} rows={4} />
        <button type="submit" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Submit
        </button>
      </form>
    </div>
  );
}
