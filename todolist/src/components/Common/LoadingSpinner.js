import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'md', text = '로딩 중...' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="loading-spinner__circle" />
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
