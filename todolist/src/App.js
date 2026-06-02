import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import InboxPage from './pages/InboxPage';
import ParaPage from './pages/ParaPage';
import CategoryManagePage from './pages/CategoryManagePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout" id="app-layout">
        <Sidebar />
        <main className="main-content" id="main-content">
          <div className="main-content__inner">
            <Routes>
              <Route path="/" element={<Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/para/:tab" element={<ParaPage />} />
              <Route path="/categories" element={<CategoryManagePage />} />
              <Route path="*" element={<Navigate to="/inbox" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
