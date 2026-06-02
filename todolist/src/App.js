import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import InboxPage from './pages/InboxPage';
import ParaPage from './pages/ParaPage';
import CategoryManagePage from './pages/CategoryManagePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  const { checkSession, isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    // 앱 로드 시 세션 확인
    checkSession();
  }, [checkSession]);

  // 로딩 중이거나 아직 세션 확인 전이면 메인 레이아웃 렌더링을 늦추거나, 
  // ProtectedRoute에서 핸들링하게 합니다.
  // 여기서는 ProtectedRoute가 /login으로 튕겨주거나 로딩을 보여줍니다.

  return (
    <BrowserRouter>
      {/* 로그인/회원가입은 레이아웃 없이 전체 화면 */}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/inbox" replace /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/inbox" replace /> : <SignupPage />} />
        
        {/* 나머지는 보호된 라우트 및 레이아웃 포함 */}
        <Route element={
          <div className="app-layout" id="app-layout">
            <Sidebar />
            <main className="main-content" id="main-content">
              <div className="main-content__inner">
                <ProtectedRoute />
              </div>
            </main>
          </div>
        }>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/para/:tab" element={<ParaPage />} />
          <Route path="/categories" element={<CategoryManagePage />} />
          <Route path="*" element={<Navigate to="/inbox" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
