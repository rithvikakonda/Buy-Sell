
// ///////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Search/Searchbar'; // Import the SearchBar component
import CategoryFilter from '../Search/category'; // CategoryFilter for dropdown-based filtering
import './items.css'; // Add CSS for styling

const ItemsList = () => {
  const [items, setItems] = useState([]); // State to store all items
  const [filteredItems, setFilteredItems] = useState([]); // State to store filtered items
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories state
  const navigate = useNavigate(); // Navigation hook

  const constantCategories = [
    'Electronics',
    'Clothing',
     'Apparel',
    'Food',
    'Groceries',
    'Games',
    'Materials',
    'Sports',
    'Fitness',
    'Personal Care',
    'Books ',
    'Study Materials',
  ]; // Example categories

  // Fetch items from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse JSON response
        // Filter items based on availability before storing them in state
        const availableItems = data.filter((item) => item.isAvailable === true);

        setItems(availableItems);
        setFilteredItems(availableItems); 
        // setItems(data);
        // setFilteredItems(data); // Initially, display all items
      } catch (error) {
        console.error('Error fetching items:', error.message);
      }
    };

    fetchItems();
  }, []);

  // Apply search and category filters
  useEffect(() => {
    let filtered = items;
    // const token = localStorage.getItem('token');

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.category.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategories, items]);

  // Handle search query update
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle selected categories update
  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  // Handle item click to navigate to the details page
  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div className="items-container">
      {/* Integrate the SearchBar */}
      <SearchBar onSearch={handleSearch} />

      {/* Integrate the CategoryFilter */}
      <CategoryFilter
        constantCategories={constantCategories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />

      <div className="items-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="item-box"
              onClick={() => handleItemClick(item._id)}
            >
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              {item.seller ? (
                <p>Seller: {item.seller.firstName} {item.seller.lastName}</p>
              ) : (
                <p>Seller information not available.</p>
              )}
            </div>
          ))
        ) : (
          <p>No items found.</p> // Message when no items match the filters
        )}
      </div>
    </div>
  );
};

export default ItemsList;
