import { create } from 'zustand';
import { fetchMe } from '../api/authApi';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false, // 앱 진입 시 세션 체크 완료 여부

  // 유저 정보 세팅
  setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),

  // 로그아웃 시 초기화
  clearUser: () => set({ user: null, isAuthenticated: false }),

  // 앱 로드 시 세션 유효성 체크
  checkSession: async () => {
    try {
      const userData = await fetchMe();
      set({ user: userData, isAuthenticated: true, isInitialized: true });
    } catch (error) {
      // 401 Unauthorized 등
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },
}));

export default useAuthStore;
