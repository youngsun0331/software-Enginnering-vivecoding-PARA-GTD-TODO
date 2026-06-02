import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import TaskItem from '../components/Task/TaskItem';
import CategoryBadge from '../components/Category/CategoryBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import usePara from '../hooks/usePara';
import { toggleTaskComplete } from '../api/inboxApi';
import { PARA_TYPE_LABEL, PARA_TYPE_ICON, PARA_TYPE_COLOR } from '../constants/enums';
import './ParaPage.css';

const TABS = [
  { key: 'projects', label: 'Projects', icon: '🚀' },
  { key: 'areas', label: 'Areas', icon: '🎯' },
  { key: 'resources', label: 'Resources', icon: '📚' },
  { key: 'archives', label: 'Archives', icon: '🗄️' },
];

function ParaPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { paraData, loading, error, loadParaView } = usePara();
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const currentTab = tab || 'projects';

  useEffect(() => {
    loadParaView(currentTab);
  }, [currentTab, loadParaView]);

  const handleTabChange = (tabKey) => {
    navigate(`/para/${tabKey}`);
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // 기본 모두 확장
  useEffect(() => {
    if (paraData.length > 0) {
      setExpandedCategories(new Set(paraData.map((c) => c.id)));
    }
  }, [paraData]);

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskComplete(taskId);
      loadParaView(currentTab); // 새로고침
    } catch (err) {
      console.error('완료 토글 실패:', err);
    }
  };

  const currentTabInfo = TABS.find((t) => t.key === currentTab) || TABS[0];
  const paraTypeKey = currentTab.slice(0, -1).toUpperCase(); // projects → PROJECT

  return (
    <div className="para-page" id="para-page">
      <Header
        icon={currentTabInfo.icon}
        title={currentTabInfo.label}
        description={`${PARA_TYPE_LABEL[paraTypeKey] || currentTabInfo.label} 카테고리별 항목 조회`}
      />

      <div className="para-page__tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`para-page__tab ${currentTab === t.key ? 'para-page__tab--active' : ''}`}
            onClick={() => handleTabChange(t.key)}
            id={`para-tab-${t.key}`}
          >
            <span className="para-page__tab-icon">{t.icon}</span>
            <span className="para-page__tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="para-page__error">
          <span>⚠️</span> {error}
          <button onClick={() => loadParaView(currentTab)} className="para-page__error-retry">
            다시 시도
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text={`${currentTabInfo.label} 데이터를 불러오는 중...`} />
      ) : paraData.length === 0 ? (
        <EmptyState
          icon={currentTabInfo.icon}
          title={`${currentTabInfo.label}에 항목이 없습니다`}
          description="Inbox에서 할 일을 추가하고 카테고리를 할당해보세요"
        />
      ) : (
        <div className="para-page__categories">
          {paraData.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const totalItems =
              (category.tasks?.length || 0) +
              (category.notes?.length || 0) +
              (category.projects?.length || 0);

            return (
              <div key={category.id} className="para-category">
                <button
                  className="para-category__header"
                  onClick={() => toggleExpand(category.id)}
                  style={{ '--cat-color': PARA_TYPE_COLOR[category.paraType] }}
                >
                  <span className={`para-category__arrow ${isExpanded ? 'para-category__arrow--expanded' : ''}`}>
                    ▶
                  </span>
                  <span className="para-category__icon">
                    {PARA_TYPE_ICON[category.paraType]}
                  </span>
                  <span className="para-category__name">{category.name}</span>
                  <span className="para-category__count">{totalItems}</span>
                </button>

                {isExpanded && (
                  <div className="para-category__content">
                    {/* Tasks */}
                    {category.tasks && category.tasks.length > 0 && (
                      <div className="para-category__section">
                        <div className="para-category__section-label">📋 할 일</div>
                        {category.tasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleComplete}
                          />
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {category.notes && category.notes.length > 0 && (
                      <div className="para-category__section">
                        <div className="para-category__section-label">📝 노트</div>
                        {category.notes.map((note) => (
                          <div key={note.id} className="para-note-item">
                            <span className="para-note-item__icon">📝</span>
                            <div className="para-note-item__content">
                              <span className="para-note-item__title">{note.title}</span>
                              {note.content && (
                                <p className="para-note-item__preview">
                                  {note.content.substring(0, 100)}
                                  {note.content.length > 100 ? '...' : ''}
                                </p>
                              )}
                              {note.categories && note.categories.length > 0 && (
                                <div className="para-note-item__categories">
                                  {note.categories.map((cat) => (
                                    <CategoryBadge key={cat.id} category={cat} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {category.projects && category.projects.length > 0 && (
                      <div className="para-category__section">
                        <div className="para-category__section-label">🚀 프로젝트</div>
                        {category.projects.map((project) => (
                          <div key={project.id} className="para-project-item">
                            <span className="para-project-item__icon">🚀</span>
                            <div className="para-project-item__content">
                              <div className="para-project-item__header">
                                <span className="para-project-item__title">{project.title}</span>
                                <span
                                  className={`para-project-item__status para-project-item__status--${project.status?.toLowerCase()}`}
                                >
                                  {project.status}
                                </span>
                              </div>
                              {project.description && (
                                <p className="para-project-item__description">{project.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {totalItems === 0 && (
                      <div className="para-category__empty">이 카테고리에 항목이 없습니다</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ParaPage;
