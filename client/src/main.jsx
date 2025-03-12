import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/login.jsx';
import Dashboard from './views/dashboard.jsx';
import AdminPanel from './views/admin.jsx';
import Dynamic from './views/Dynamic.jsx';
import Home from './App.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/AdminPanel" element={<AdminPanel />} />
      <Route path="/admin/:route" element={<Dynamic/>} />

    </Routes>
  </BrowserRouter>
);
