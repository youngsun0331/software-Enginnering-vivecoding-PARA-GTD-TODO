import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import TaskInput from '../components/Task/TaskInput';
import TaskList from '../components/Task/TaskList';
import CategorySelector from '../components/Category/CategorySelector';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import useInbox from '../hooks/useInbox';
import { assignTaskCategories } from '../api/paraApi';
import { TASK_STATUS } from '../constants/enums';
import './InboxPage.css';

function InboxPage() {
  const { tasks, loading, adding, error, loadTasks, addTask, toggleComplete, updateTask } = useInbox();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAssignCategory = (task) => {
    setSelectedTask(task);
    setSelectorOpen(true);
  };

  const handleCategoryConfirm = async (categoryIds) => {
    if (!selectedTask) return;
    try {
      const updated = await assignTaskCategories(selectedTask.id, categoryIds);
      updateTask(selectedTask.id, updated);
    } catch (err) {
      console.error('카테고리 할당 실패:', err);
    }
    setSelectedTask(null);
  };

  // 필터링된 태스크
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return t.status !== TASK_STATUS.DONE;
    if (filter === 'done') return t.status === TASK_STATUS.DONE;
    return true;
  });

  const activeCount = tasks.filter((t) => t.status !== TASK_STATUS.DONE).length;
  const doneCount = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;

  return (
    <div className="inbox-page" id="inbox-page">
      <Header
        icon="📥"
        title="Inbox"
        description="머릿속 모든 것을 여기에 수집하세요"
        actions={
          <div className="inbox-page__stats">
            <span className="inbox-page__stat">
              <span className="inbox-page__stat-count">{activeCount}</span>
              <span className="inbox-page__stat-label">진행 중</span>
            </span>
            <span className="inbox-page__stat inbox-page__stat--done">
              <span className="inbox-page__stat-count">{doneCount}</span>
              <span className="inbox-page__stat-label">완료</span>
            </span>
          </div>
        }
      />

      <TaskInput onSubmit={addTask} loading={adding} />

      {error && (
        <div className="inbox-page__error">
          <span>⚠️</span> {error}
          <button className="inbox-page__error-retry" onClick={loadTasks}>다시 시도</button>
        </div>
      )}

      <div className="inbox-page__filters">
        <button
          className={`inbox-page__filter ${filter === 'all' ? 'inbox-page__filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체 ({tasks.length})
        </button>
        <button
          className={`inbox-page__filter ${filter === 'active' ? 'inbox-page__filter--active' : ''}`}
          onClick={() => setFilter('active')}
        >
          진행 중 ({activeCount})
        </button>
        <button
          className={`inbox-page__filter ${filter === 'done' ? 'inbox-page__filter--active' : ''}`}
          onClick={() => setFilter('done')}
        >
          완료 ({doneCount})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="인박스를 불러오는 중..." />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleComplete}
          onAssignCategory={handleAssignCategory}
          emptyIcon="📥"
          emptyTitle="인박스가 비어 있습니다"
          emptyDescription="위 입력란에 새 할 일을 추가해보세요!"
        />
      )}

      <CategorySelector
        isOpen={selectorOpen}
        onClose={() => {
          setSelectorOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleCategoryConfirm}
        selectedIds={selectedTask?.categories?.map((c) => c.id) || []}
      />
    </div>
  );
}

export default InboxPage;
