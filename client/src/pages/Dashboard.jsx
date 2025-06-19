// This file is part of the Job Application Tracker project.
// It is a simple dashboard page that displays a welcome message.

import React from 'react';
import Layout from '../components/Layout';
import JobList from '../components/JobList';

export default function Dashboard() {
  return (
    <Layout>
      <h1>Dashboard</h1>
      <JobList />
    </Layout>
  );
}
