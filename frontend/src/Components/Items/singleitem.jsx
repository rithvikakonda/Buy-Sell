


import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './itemDetails.css';

const ItemDetails = () => {
  const { id } = useParams(); // Get item ID from URL
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState(''); // For feedback message
  const navigate = useNavigate(); // Navig
  // Fetch item details from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Unauthorized access. Redirecting to login...');
      navigate('/login-signup'); // Redirect if not logged in
      return;
    }
  //   fetch(`http://localhost:5000/api/items/${id}`)
  //     .then((response) => response.json())
  //     .then((data) => setItem(data))
  //     .catch((error) => console.error('Error fetching item:', error));
  // }, [id]);
  // Fetch item details from the backend
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }

        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
        setMessage('Error loading item details.');
      }
    };

    fetchItemDetails();
  }, [id, navigate]);


  // Add item to cart function
  const addToCart = async () => {
    const userEmail = localStorage.getItem('userEmail'); 
    // Get logged-in user's email
    const token = localStorage.getItem('token');
    console.log(userEmail);
    if (!userEmail || !token) {
      setMessage('Please log in to add items to your cart.');
      return;
    }
     // Check if the item's seller is the logged-in user
    if (item.seller && item.seller.email === userEmail) {
      setMessage('You cannot add your own item to the cart.');
      return;
    }


    try {
      const response = await fetch(`http://localhost:5000/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, itemId: id }),
      });

      const result = await response.json();

      if (response.ok) {
         // Update item's availability in the backend
      await fetch(`http://localhost:5000/api/items/${id}/updateAvailability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: false }),
      });
        setMessage('Item added to cart successfully!');
      } else {
        setMessage(result.message || 'Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setMessage('An error occurred while adding the item to the cart.');
    }
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ab_body">
    <div className="item-details">
      <h1>{item.name}</h1>
      <p>Price: ₹{item.price}</p>
      <p>Description: {item.description}</p>
      <p>Category: {item.category}</p>
      <p>Seller Details:</p>
      {item.seller ? (
        <ul>
          <li>Name: {item.seller.firstName} {item.seller.lastName}</li>
          <li>Email: {item.seller.email}</li>
          <li>Contact: {item.seller.contactNumber}</li>
        </ul>
      ) : (
        <p>Seller information not available.</p>
      )}
      <button onClick={addToCart}>Add to Cart</button>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default ItemDetails;
