import API from './axiosInstance';

// GET /api/v1/projects — 전체 프로젝트 목록 조회
export const fetchProjects = async () => {
  const response = await API.get('/api/v1/projects');
  return response.data;
};

// POST /api/v1/projects — 프로젝트 생성
export const createProject = async (title, description = '') => {
  const response = await API.post('/api/v1/projects', { title, description });
  return response.data;
};

// GET /api/v1/projects/{projectId} — 프로젝트 단건 조회
export const fetchProjectById = async (projectId) => {
  const response = await API.get(`/api/v1/projects/${projectId}`);
  return response.data;
};

// PATCH /api/v1/projects/{projectId} — 프로젝트 수정
export const updateProject = async (projectId, data) => {
  const response = await API.patch(`/api/v1/projects/${projectId}`, data);
  return response.data;
};

// PATCH /api/v1/projects/{projectId}/status — 프로젝트 상태 변경 (ACTIVE ↔ ARCHIVED)
export const updateProjectStatus = async (projectId, status) => {
  const response = await API.patch(`/api/v1/projects/${projectId}/status`, { status });
  return response.data;
};

// DELETE /api/v1/projects/{projectId} — 프로젝트 삭제
export const deleteProject = async (projectId) => {
  await API.delete(`/api/v1/projects/${projectId}`);
};
