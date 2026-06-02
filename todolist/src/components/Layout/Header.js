import React from 'react';
import './Header.css';

function Header({ title, icon, description, actions }) {
  return (
    <header className="page-header" id="page-header">
      <div className="page-header__left">
        {icon && <span className="page-header__icon">{icon}</span>}
        <div>
          <h1 className="page-header__title">{title}</h1>
          {description && <p className="page-header__description">{description}</p>}
        </div>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export default Header;
