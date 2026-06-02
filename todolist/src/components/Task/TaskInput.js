import React, { useState } from 'react';
import './TaskInput.css';

function TaskInput({ onSubmit, placeholder = '새 할 일을 입력하세요...', loading = false }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <form className="task-input" onSubmit={handleSubmit} id="task-input-form">
      <div className="task-input__icon">✏️</div>
      <input
        type="text"
        className="task-input__field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        id="task-input-field"
        autoComplete="off"
      />
      <button
        type="submit"
        className="task-input__submit"
        disabled={!value.trim() || loading}
        id="task-input-submit"
      >
        {loading ? '...' : '추가'}
      </button>
    </form>
  );
}

export default TaskInput;
