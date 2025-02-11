import React, { useState } from "react";
import { FaSearch } from 'react-icons/fa'; // Importing the search icon from React Icons

import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search for items..."
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-button" onClick={handleSearch}>
      <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
