import React, { useState } from 'react';
import Input from '../ui/Input';


const SearchBar = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const term = searchTerm.trim();
      if (term && onSearch) {
        onSearch(term);
      }
    }
  };

  return (
    <div className="search-bar">
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleSearch}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        focused={isSearchFocused}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;