import React from 'react';
import '../../../styles/components/sections/dashboard/DashboardSidebar.css';

const DashboardSidebar = ({ activeSection, onSectionChange }) => {
  const handleClick = (section, e) => {
    e.preventDefault();
    onSectionChange(section);
  };

  return (
    <aside className="sidebar">
      <h3>Dashboard Menu</h3>
      <ul>
        {['profile', 'textbooks', 'purchases', 'settings'].map((section) => (
          <li key={section}>
            <a
              href={`#${section}`}
              className={activeSection === section ? 'active' : ''}
              onClick={(e) => handleClick(section, e)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
