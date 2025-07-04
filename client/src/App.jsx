import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NewJob from './pages/NewJob';
import Stats from './pages/Stats';
import Reminders from './pages/Reminders';
import Tools from './pages/Tools';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/jobs/new" element={<NewJob />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/tools" element={<Tools />} />
          {/* Add more routes here later */}
        </Routes>
      </Layout>
    </Router>
  );
}
