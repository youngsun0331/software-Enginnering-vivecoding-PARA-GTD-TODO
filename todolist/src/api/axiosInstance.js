import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 하드코딩된 User UUID
const HARDCODED_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

// 요청 인터셉터: X-User-Id 헤더 자동 주입
API.interceptors.request.use(
  (config) => {
    config.headers['X-User-Id'] = HARDCODED_USER_ID;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 핸들링
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, message);
    return Promise.reject(error);
  }
);

export default API;
