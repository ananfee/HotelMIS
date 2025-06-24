import React from 'react';
import './Header.css';
import { ReactComponent as ProfileIcon } from '../icons/profile.svg';
import { Link } from 'react-router-dom';

const MenuIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0" width="20" height="2" fill="#230608"/>
    <rect y="7" width="20" height="2" fill="#230608"/>
    <rect y="14" width="20" height="2" fill="#230608"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="6" r="4" stroke="#230608" strokeWidth="1.5"/>
    <path d="M2 18C2 14 6 12 10 12C14 12 18 14 18 18" stroke="#230608" strokeWidth="1.5"/>
  </svg>
);

const Header = () => {
  return (
    <header className="header">
      <div className="logo">ELEVATE</div>
      <nav className="nav">
        <Link to="/rooms">Номера</Link>
        <Link to="/bookings">Бронирования</Link>
        <Link to="/guests">Проживающие</Link>
        <Link to="/archive">Архив</Link>
      </nav>
      <div className="user-controls">
        <button className="menu-btn" aria-label="Меню">
          <MenuIcon />
        </button>
        <div className="user-icon" aria-label="Пользователь">
          <ProfileIcon />
        </div>
      </div>
    </header>
  );
};

export default Header; 