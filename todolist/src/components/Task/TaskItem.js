import React, { useState } from 'react';
import CategoryBadge from '../Category/CategoryBadge';
import { TASK_STATUS } from '../../constants/enums';
import './TaskItem.css';

function TaskItem({ task, onToggleComplete, onAssignCategory }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDone = task.status === TASK_STATUS.DONE;

  return (
    <div
      className={`task-item ${isDone ? 'task-item--done' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`task-item__checkbox ${isDone ? 'task-item__checkbox--checked' : ''}`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={isDone ? '완료 취소' : '완료 처리'}
      >
        {isDone && (
          <svg className="task-item__checkmark" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="task-item__content">
        <span className={`task-item__title ${isDone ? 'task-item__title--done' : ''}`}>
          {task.title}
        </span>

        <div className="task-item__meta">
          {task.categories && task.categories.length > 0 && (
            <div className="task-item__categories">
              {task.categories.map((cat) => (
                <CategoryBadge key={cat.id} category={cat} />
              ))}
            </div>
          )}
          {task.dueDate && (
            <span className="task-item__due-date">
              📅 {new Date(task.dueDate).toLocaleDateString('ko-KR')}
            </span>
          )}
        </div>
      </div>

      <div className={`task-item__actions ${isHovered ? 'task-item__actions--visible' : ''}`}>
        {onAssignCategory && (
          <button
            className="task-item__action-btn"
            onClick={() => onAssignCategory(task)}
            aria-label="카테고리 할당"
            title="카테고리 분류"
          >
            🏷️
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
