import { useState, useCallback } from 'react';
import { fetchParaByTab, assignTaskCategories } from '../api/paraApi';

function usePara() {
  const [paraData, setParaData] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadParaView = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    setActiveTab(tab);
    try {
      const data = await fetchParaByTab(tab);
      setParaData(data);
    } catch (err) {
      setError(err.response?.data?.message || `${tab} 데이터를 불러오지 못했습니다.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignCategories = useCallback(async (taskId, categoryIds) => {
    setError(null);
    try {
      const updated = await assignTaskCategories(taskId, categoryIds);
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || '카테고리 할당에 실패했습니다.');
      throw err;
    }
  }, []);

  return {
    paraData,
    activeTab,
    loading,
    error,
    loadParaView,
    assignCategories,
  };
}

export default usePara;
