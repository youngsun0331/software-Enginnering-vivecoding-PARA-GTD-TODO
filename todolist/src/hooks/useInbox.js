import { useState, useCallback } from 'react';
import { fetchInboxTasks, createInboxTask, toggleTaskComplete } from '../api/inboxApi';

function useInbox() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInboxTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || '인박스 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (title) => {
    setAdding(true);
    setError(null);
    try {
      const newTask = await createInboxTask(title);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.response?.data?.message || '할 일 추가에 실패했습니다.');
      throw err;
    } finally {
      setAdding(false);
    }
  }, []);

  const toggleComplete = useCallback(async (taskId) => {
    try {
      const updated = await toggleTaskComplete(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      );
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || '상태 변경에 실패했습니다.');
      throw err;
    }
  }, []);

  // 특정 태스크 로컬 업데이트 (카테고리 할당 후)
  const updateTask = useCallback((taskId, updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );
  }, []);

  return {
    tasks,
    loading,
    adding,
    error,
    loadTasks,
    addTask,
    toggleComplete,
    updateTask,
  };
}

export default useInbox;
