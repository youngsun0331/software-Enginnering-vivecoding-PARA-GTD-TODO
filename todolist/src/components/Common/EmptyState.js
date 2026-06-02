import React from 'react';
import './EmptyState.css';

function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
    </div>
  );
}

export default EmptyState;
