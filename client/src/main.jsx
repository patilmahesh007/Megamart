import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/login.jsx';
import Dashboard from './views/dashboard.jsx';
import Dynamic from './views/Dynamic.jsx';
import Home from './App.jsx';
import SubCategoryPage from './views/SubCategoryPage.jsx';
import Cart from './views/cart.jsx';
import Profile from './views/profile.jsx';


import ProductDetailPage from './components/admin/ProductDetailPage.jsx';
import AdminPanel from './views/admin.jsx';
import UserProductDetail from './views/userProductDetail.jsx';

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
      <Route path="/admin/products/:id" element={<ProductDetailPage />} />
      <Route path="/category/:subcategoryId" element={<SubCategoryPage />} />
      <Route path="/product/:id" element={<UserProductDetail />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/Profile" element={<Profile />} />

    </Routes>
  </BrowserRouter>
);
