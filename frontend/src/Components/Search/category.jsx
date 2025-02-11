
import React from 'react';
import "./category.css";

const CategoryFilter = ({ constantCategories, selectedCategories, onCategoryChange }) => {
  const handleCategorySelect = (category) => {
    const lowerCaseCategory = category.toLowerCase();
    if (selectedCategories.some((c) => c.toLowerCase() === lowerCaseCategory)) {
      // Remove category if already selected
      onCategoryChange(selectedCategories.filter((c) => c.toLowerCase() !== lowerCaseCategory));
    } else {
      // Add category if not selected
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const isCategorySelected = (category) => {
    return selectedCategories.some((selected) => selected.toLowerCase() === category.toLowerCase());
  };

  return (
    <div className="category-container">
      <div className="category-list">
        {constantCategories.map((category) => (
          <button
            key={category}
            className={isCategorySelected(category) ? "category-selected" : "category-unselected"}
            onClick={() => handleCategorySelect(category)}
          >
            {category} {isCategorySelected(category) && <span className="remove-x">×</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
