import React from 'react';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import './Search.css';

function Search({ value, onChange, onSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Поиск..."
        className="search-input"
      />
      <SearchIcon className="search-icon" />
    </div>
  );
}

export default Search;

