// TaskStatus — 할 일 상태
export const TASK_STATUS = {
  INBOX: 'INBOX',
  SOMEDAY: 'SOMEDAY',
  TODO: 'TODO',
  SCHEDULE: 'SCHEDULE',
  DONE: 'DONE',
};

export const TASK_STATUS_LABEL = {
  [TASK_STATUS.INBOX]: '인박스',
  [TASK_STATUS.SOMEDAY]: '언젠가/어쩌면',
  [TASK_STATUS.TODO]: '진행 전',
  [TASK_STATUS.SCHEDULE]: '예정됨',
  [TASK_STATUS.DONE]: '완료',
};

// ParaType — PARA 카테고리 대분류
export const PARA_TYPE = {
  PROJECT: 'PROJECT',
  AREA: 'AREA',
  RESOURCE: 'RESOURCE',
  ARCHIVE: 'ARCHIVE',
};

export const PARA_TYPE_LABEL = {
  [PARA_TYPE.PROJECT]: '프로젝트',
  [PARA_TYPE.AREA]: '영역',
  [PARA_TYPE.RESOURCE]: '자원',
  [PARA_TYPE.ARCHIVE]: '보관',
};

export const PARA_TYPE_COLOR = {
  [PARA_TYPE.PROJECT]: '#8B5CF6',
  [PARA_TYPE.AREA]: '#3B82F6',
  [PARA_TYPE.RESOURCE]: '#10B981',
  [PARA_TYPE.ARCHIVE]: '#6B7280',
};

export const PARA_TYPE_ICON = {
  [PARA_TYPE.PROJECT]: '🚀',
  [PARA_TYPE.AREA]: '🎯',
  [PARA_TYPE.RESOURCE]: '📚',
  [PARA_TYPE.ARCHIVE]: '🗄️',
};

// ProjectStatus — 프로젝트 상태
export const PROJECT_STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

export const PROJECT_STATUS_LABEL = {
  [PROJECT_STATUS.ACTIVE]: '활성',
  [PROJECT_STATUS.ARCHIVED]: '보관됨',
};
