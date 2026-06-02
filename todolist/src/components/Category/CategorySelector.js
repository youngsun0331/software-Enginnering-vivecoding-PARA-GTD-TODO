import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import { PARA_TYPE, PARA_TYPE_LABEL, PARA_TYPE_COLOR, PARA_TYPE_ICON } from '../../constants/enums';
import { fetchCategories } from '../../api/categoryApi';
import './CategorySelector.css';

function CategorySelector({ isOpen, onClose, onConfirm, selectedIds = [] }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(new Set(selectedIds));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelected(new Set(selectedIds));
      loadCategories();
    }
  }, [isOpen, selectedIds]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('카테고리 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
    onClose();
  };

  // PARA 타입별 그룹핑
  const grouped = Object.values(PARA_TYPE).reduce((acc, type) => {
    acc[type] = categories.filter((c) => c.paraType === type);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏷️ 카테고리 선택">
      {loading ? (
        <div className="category-selector__loading">로딩 중...</div>
      ) : categories.length === 0 ? (
        <div className="category-selector__empty">
          <p>등록된 카테고리가 없습니다.</p>
          <p className="category-selector__hint">카테고리 관리 메뉴에서 먼저 추가해주세요.</p>
        </div>
      ) : (
        <div className="category-selector">
          {Object.entries(grouped).map(
            ([type, cats]) =>
              cats.length > 0 && (
                <div key={type} className="category-selector__group">
                  <div
                    className="category-selector__group-header"
                    style={{ '--group-color': PARA_TYPE_COLOR[type] }}
                  >
                    <span>{PARA_TYPE_ICON[type]}</span>
                    <span>{PARA_TYPE_LABEL[type]}</span>
                  </div>
                  {cats.map((cat) => (
                    <label
                      key={cat.id}
                      className={`category-selector__item ${
                        selected.has(cat.id) ? 'category-selector__item--selected' : ''
                      }`}
                      style={{ '--item-color': PARA_TYPE_COLOR[type] }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(cat.id)}
                        onChange={() => toggleSelect(cat.id)}
                        className="category-selector__checkbox"
                      />
                      <span className="category-selector__dot" />
                      <span className="category-selector__name">{cat.name}</span>
                    </label>
                  ))}
                </div>
              )
          )}
          <div className="category-selector__actions">
            <button className="category-selector__btn category-selector__btn--cancel" onClick={onClose}>
              취소
            </button>
            <button className="category-selector__btn category-selector__btn--confirm" onClick={handleConfirm}>
              확인 ({selected.size}개 선택)
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CategorySelector;
