import React from 'react';
import { PARA_TYPE_COLOR } from '../../constants/enums';
import './CategoryBadge.css';

function CategoryBadge({ category, size = 'sm', onRemove }) {
  const color = PARA_TYPE_COLOR[category.paraType] || '#6B7280';

  return (
    <span
      className={`category-badge category-badge--${size}`}
      style={{
        '--badge-color': color,
        '--badge-bg': `${color}1a`,
      }}
    >
      <span className="category-badge__dot" />
      <span className="category-badge__name">{category.name}</span>
      {onRemove && (
        <button
          className="category-badge__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(category.id);
          }}
          aria-label={`${category.name} 카테고리 제거`}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default CategoryBadge;
