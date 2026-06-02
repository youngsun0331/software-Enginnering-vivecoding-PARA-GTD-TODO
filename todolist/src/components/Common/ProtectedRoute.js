import React, { useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  // 앱 초기 진입 시 세션 체크가 안 끝났으면 로딩 표시
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="인증 정보를 확인하는 중..." />
      </div>
    );
  }

  // 로그인이 안 되어 있으면 로그인 페이지로 리다이렉트하되, 원래 가려던 페이지 위치를 기억함
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
