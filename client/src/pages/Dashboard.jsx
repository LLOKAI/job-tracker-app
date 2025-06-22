// This file is part of the Job Application Tracker project.
// It is a simple dashboard page that displays a welcome message.

import React, { useState } from 'react';
import Layout from '../components/Layout';
import JobList from '../components/JobList';

export default function Dashboard() {
  const [compactMode] = useState(() => {
    const stored = localStorage.getItem('settings_compactMode');
    return stored ? JSON.parse(stored) : false;
  });

  return (
    <>
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
      <JobList compactMode={compactMode} />
    </>
  );
}
