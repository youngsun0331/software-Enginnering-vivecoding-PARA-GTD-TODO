import API from './axiosInstance';

// GET /api/v1/categories — 전체 카테고리 목록 조회
export const fetchCategories = async () => {
  const response = await API.get('/api/v1/categories');
  return response.data;
};

// GET /api/v1/categories/type/{paraType} — PARA 타입별 카테고리 조회
export const fetchCategoriesByType = async (paraType) => {
  const response = await API.get(`/api/v1/categories/type/${paraType}`);
  return response.data;
};

// POST /api/v1/categories — 카테고리 생성
export const createCategory = async (name, paraType) => {
  const response = await API.post('/api/v1/categories', { name, paraType });
  return response.data;
};

// DELETE /api/v1/categories/{categoryId} — 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  await API.delete(`/api/v1/categories/${categoryId}`);
};
