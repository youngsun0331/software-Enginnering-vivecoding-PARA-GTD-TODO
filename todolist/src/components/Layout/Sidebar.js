import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PARA_TYPE_ICON } from '../../constants/enums';
import useAuthStore from '../../store/useAuthStore';
import { logout as logoutApi } from '../../api/authApi';
import './Sidebar.css';

function Sidebar() {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error('로그아웃 에러', e);
    } finally {
      clearUser();
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/inbox', label: 'Inbox', icon: '📥', id: 'nav-inbox' },
    { path: '/para/projects', label: 'Projects', icon: PARA_TYPE_ICON.PROJECT, id: 'nav-projects' },
    { path: '/para/areas', label: 'Areas', icon: PARA_TYPE_ICON.AREA, id: 'nav-areas' },
    { path: '/para/resources', label: 'Resources', icon: PARA_TYPE_ICON.RESOURCE, id: 'nav-resources' },
    { path: '/para/archives', label: 'Archives', icon: PARA_TYPE_ICON.ARCHIVE, id: 'nav-archives' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">✨</span>
        <h1 className="sidebar__title">GTD Todo</h1>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section">
          <span className="sidebar__section-label">메뉴</span>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              id={item.id}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar__section">
          <span className="sidebar__section-label">설정</span>
          <NavLink
            to="/categories"
            id="nav-categories"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon">🏷️</span>
            <span className="sidebar__link-label">카테고리 관리</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__username">{user?.name || '사용자'}</span>
            <button className="sidebar__logout" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
