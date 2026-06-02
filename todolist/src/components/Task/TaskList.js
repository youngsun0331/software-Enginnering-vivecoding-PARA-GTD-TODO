import React from 'react';
import TaskItem from './TaskItem';
import EmptyState from '../Common/EmptyState';

function TaskList({ tasks, onToggleComplete, onAssignCategory, emptyIcon, emptyTitle, emptyDescription }) {
  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon || '📭'}
        title={emptyTitle || '할 일이 없습니다'}
        description={emptyDescription || '새 할 일을 추가해보세요'}
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onAssignCategory={onAssignCategory}
        />
      ))}
    </div>
  );
}

export default TaskList;
