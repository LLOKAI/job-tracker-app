import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NewJob from './pages/NewJob';
import EditJob from './pages/EditJob';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/jobs/new" element={<NewJob />} />
          <Route path="/jobs/:id/edit" element={<EditJob />} />
          {/* Add more routes here later */}
        </Routes>
      </Layout>
    </Router>
  );
}
