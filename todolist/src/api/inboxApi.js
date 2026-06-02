import API from './axiosInstance';

// GET /api/v1/inbox — 인박스 태스크 목록 조회
export const fetchInboxTasks = async () => {
  const response = await API.get('/api/v1/inbox');
  return response.data;
};

// POST /api/v1/inbox — 인박스 태스크 생성
export const createInboxTask = async (title) => {
  const response = await API.post('/api/v1/inbox', { title });
  return response.data;
};

// PATCH /api/v1/inbox/tasks/{taskId}/complete — 태스크 완료 토글
export const toggleTaskComplete = async (taskId) => {
  const response = await API.patch(`/api/v1/inbox/tasks/${taskId}/complete`);
  return response.data;
};
