import API from './axiosInstance';

// PATCH /api/v1/para/tasks/{taskId}/categories — 태스크에 카테고리 할당
export const assignTaskCategories = async (taskId, categoryIds) => {
  const response = await API.patch(`/api/v1/para/tasks/${taskId}/categories`, { categoryIds });
  return response.data;
};

// PATCH /api/v1/para/notes/{noteId}/categories — 노트에 카테고리 할당
export const assignNoteCategories = async (noteId, categoryIds) => {
  const response = await API.patch(`/api/v1/para/notes/${noteId}/categories`, { categoryIds });
  return response.data;
};

// PATCH /api/v1/para/projects/{projectId}/categories — 프로젝트에 카테고리 할당
export const assignProjectCategories = async (projectId, categoryIds) => {
  const response = await API.patch(`/api/v1/para/projects/${projectId}/categories`, { categoryIds });
  return response.data;
};

// GET /api/v1/para/projects — Projects 뷰 조회
export const fetchParaProjects = async () => {
  const response = await API.get('/api/v1/para/projects');
  return response.data;
};

// GET /api/v1/para/areas — Areas 뷰 조회
export const fetchParaAreas = async () => {
  const response = await API.get('/api/v1/para/areas');
  return response.data;
};

// GET /api/v1/para/resources — Resources 뷰 조회
export const fetchParaResources = async () => {
  const response = await API.get('/api/v1/para/resources');
  return response.data;
};

// GET /api/v1/para/archives — Archives 뷰 조회
export const fetchParaArchives = async () => {
  const response = await API.get('/api/v1/para/archives');
  return response.data;
};

// 탭 이름으로 해당 PARA 뷰 데이터 조회
export const fetchParaByTab = async (tab) => {
  const fetchers = {
    projects: fetchParaProjects,
    areas: fetchParaAreas,
    resources: fetchParaResources,
    archives: fetchParaArchives,
  };
  const fetcher = fetchers[tab];
  if (!fetcher) throw new Error(`Unknown PARA tab: ${tab}`);
  return fetcher();
};
