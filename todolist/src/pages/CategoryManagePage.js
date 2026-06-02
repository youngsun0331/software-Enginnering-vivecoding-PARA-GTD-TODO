import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import CategoryBadge from '../components/Category/CategoryBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import useCategories from '../hooks/useCategories';
import { PARA_TYPE, PARA_TYPE_LABEL, PARA_TYPE_ICON, PARA_TYPE_COLOR } from '../constants/enums';
import './CategoryManagePage.css';

function CategoryManagePage() {
  const { categories, loading, error, loadCategories, addCategory, removeCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState(PARA_TYPE.PROJECT);
  const [adding, setAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      await addCategory(trimmed, newType);
      setNewName('');
    } catch (err) {
      // error는 훅에서 처리
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeCategory(id);
      setDeleteConfirm(null);
    } catch (err) {
      // error는 훅에서 처리
    }
  };

  // PARA 타입별 그룹핑
  const grouped = Object.values(PARA_TYPE).reduce((acc, type) => {
    acc[type] = categories.filter((c) => c.paraType === type);
    return acc;
  }, {});

  return (
    <div className="category-manage-page" id="category-manage-page">
      <Header
        icon="🏷️"
        title="카테고리 관리"
        description="PARA 시스템의 카테고리를 관리합니다"
      />

      {/* 카테고리 추가 폼 */}
      <form className="category-add-form" onSubmit={handleAdd} id="category-add-form">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 카테고리 이름..."
          className="category-add-form__input"
          disabled={adding}
          id="category-name-input"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="category-add-form__select"
          id="category-type-select"
        >
          {Object.values(PARA_TYPE).map((type) => (
            <option key={type} value={type}>
              {PARA_TYPE_ICON[type]} {PARA_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="category-add-form__submit"
          disabled={!newName.trim() || adding}
          id="category-add-submit"
        >
          {adding ? '추가 중...' : '추가'}
        </button>
      </form>

      {error && (
        <div className="category-manage-page__error">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="카테고리를 불러오는 중..." />
      ) : categories.length === 0 ? (
        <EmptyState
          icon="🏷️"
          title="카테고리가 없습니다"
          description="위 폼에서 새 카테고리를 추가해보세요"
        />
      ) : (
        <div className="category-groups">
          {Object.entries(grouped).map(
            ([type, cats]) =>
              cats.length > 0 && (
                <div key={type} className="category-group">
                  <div
                    className="category-group__header"
                    style={{ '--group-color': PARA_TYPE_COLOR[type] }}
                  >
                    <span className="category-group__icon">{PARA_TYPE_ICON[type]}</span>
                    <span className="category-group__label">{PARA_TYPE_LABEL[type]}</span>
                    <span className="category-group__count">{cats.length}</span>
                  </div>
                  <div className="category-group__items">
                    {cats.map((cat) => (
                      <div key={cat.id} className="category-group__item">
                        <CategoryBadge category={cat} size="md" />
                        <div className="category-group__item-actions">
                          {deleteConfirm === cat.id ? (
                            <div className="category-group__confirm">
                              <span className="category-group__confirm-text">삭제?</span>
                              <button
                                className="category-group__confirm-yes"
                                onClick={() => handleDelete(cat.id)}
                              >
                                확인
                              </button>
                              <button
                                className="category-group__confirm-no"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <button
                              className="category-group__delete"
                              onClick={() => setDeleteConfirm(cat.id)}
                              aria-label={`${cat.name} 카테고리 삭제`}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryManagePage;
