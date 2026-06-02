import { useState, useCallback } from 'react';
import { fetchCategories, fetchCategoriesByType, createCategory, deleteCategory } from '../api/categoryApi';

function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || '카테고리 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByType = useCallback(async (paraType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesByType(paraType);
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || '카테고리 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (name, paraType) => {
    setError(null);
    try {
      const newCat = await createCategory(name, paraType);
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    } catch (err) {
      setError(err.response?.data?.message || '카테고리 생성에 실패했습니다.');
      throw err;
    }
  }, []);

  const removeCategory = useCallback(async (categoryId) => {
    setError(null);
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err) {
      setError(err.response?.data?.message || '카테고리 삭제에 실패했습니다.');
      throw err;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    loadCategories,
    loadByType,
    addCategory,
    removeCategory,
  };
}

export default useCategories;
