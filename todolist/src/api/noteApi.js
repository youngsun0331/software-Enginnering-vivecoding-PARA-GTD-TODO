import API from './axiosInstance';

// GET /api/v1/notes — 전체 노트 목록 조회
export const fetchNotes = async () => {
  const response = await API.get('/api/v1/notes');
  return response.data;
};

// POST /api/v1/notes — 노트 생성
export const createNote = async (title, content = '') => {
  const response = await API.post('/api/v1/notes', { title, content });
  return response.data;
};

// GET /api/v1/notes/{noteId} — 노트 단건 조회
export const fetchNoteById = async (noteId) => {
  const response = await API.get(`/api/v1/notes/${noteId}`);
  return response.data;
};

// PATCH /api/v1/notes/{noteId} — 노트 수정
export const updateNote = async (noteId, data) => {
  const response = await API.patch(`/api/v1/notes/${noteId}`, data);
  return response.data;
};

// DELETE /api/v1/notes/{noteId} — 노트 삭제
export const deleteNote = async (noteId) => {
  await API.delete(`/api/v1/notes/${noteId}`);
};
