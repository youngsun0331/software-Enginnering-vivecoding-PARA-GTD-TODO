import API from './axiosInstance';

// POST /api/v1/auth/signup — 회원가입
export const signup = async (email, password, name) => {
  const response = await API.post('/api/v1/auth/signup', { email, password, name });
  return response.data;
};

// POST /api/v1/auth/login — 로그인
export const login = async (email, password) => {
  const response = await API.post('/api/v1/auth/login', { email, password });
  return response.data;
};

// POST /api/v1/auth/logout — 로그아웃
export const logout = async () => {
  await API.post('/api/v1/auth/logout');
};

// GET /api/v1/auth/me — 내 정보 조회
export const fetchMe = async () => {
  const response = await API.get('/api/v1/auth/me');
  return response.data;
};
