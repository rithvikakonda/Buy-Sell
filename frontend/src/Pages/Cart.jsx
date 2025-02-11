
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Optional CSS for styling
import { Link } from 'react-router-dom';
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0); // State to store total price
  const [orderPlaced, setOrderPlaced] = useState(false); // State to track if the order was placed
  const navigate = useNavigate(); // Navigation hook

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      const userEmail = localStorage.getItem('userEmail'); 
      // Retrieve user email from localStorage
      const token = localStorage.getItem('token');
      if (!userEmail || !token) {
        setMessage('Please log in to view your cart.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const result = await response.json();

        if (response.ok) {
          setCartItems(result.cart);
          calculateTotal(result.cart); // Calculate total price
        } else {
          setMessage(result.message || 'Failed to fetch cart items.');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setMessage('An error occurred while fetching cart items.');
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price, 0); // Sum up the prices
    setTotalPrice(total);
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const userEmail = localStorage.getItem('userEmail'); 
    // Retrieve user email from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Unauthorized. Please log in again.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail, itemId }),
      });

      const result = await response.json();

      if (response.ok) {
        const updatedCart = cartItems.filter((item) => item._id !== itemId);
        // const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/items/${itemId}/updateAvailability`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ isAvailable: true }),
        });
  
        setCartItems(updatedCart);
        calculateTotal(updatedCart); // Recalculate total price after removing item
        setMessage(result.message);
        setTimeout(() => {
          setMessage('');
        }, 500);
      } else {
        setMessage(result.message || 'Failed to remove item from cart.');
        setTimeout(() => {
          setMessage('');
        }, 100);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setMessage('An error occurred while removing the item.');
      setTimeout(() => {
        setMessage('');
      }, 100);
    }
  };


  const placeOrder = async () => {
    const userEmail = localStorage.getItem('userEmail'); 
    // Retrieve user email from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Unauthorized. Please log in again.');
      return;
    }
    function storeOtpForUser(userId, itemId, otp) {
      const key = `otp_${userId}_${itemId}`; // Create a unique key per user and item
      localStorage.setItem(key, otp); // Store the OTP
    }
    // Check if the cart is empty
    if (cartItems.length === 0) {
      setMessage('Your cart is empty. Add items to your cart before placing an order.');

      setTimeout(() => {
        setMessage('');
      }, 1000);
      return; // Exit the function if the cart is empty
    }
  
    try {
      const response = await fetch(`http://localhost:5000/placeOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, items: cartItems }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        
        // console.log("entered here!!!!!!!");
        const userId = result.userId;
        // Store OTPs in localStorage
        if (result.otps && Array.isArray(result.otps)) {
          result.otps.forEach((item) => {
                console.log(`Storing OTP for user ${userId}, item ${item._id}`);
                const key = `otp_${userId}_${item._id}`; // Create a unique key per user and item
                localStorage.setItem(key, item.otp); 
                // storeOtpForUser(userId, item._id, item.otp); // Use the storeOtpForUser function
              });
          
        }
          
     
        // Clear cart from UI
        setCartItems([]);
        setTotalPrice(0);
  
        // Clear cart from database
        await fetch(`http://localhost:5000/cart/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email: userEmail }),
        });


// Display the success message
          setOrderPlaced(true);
          setMessage('Order placed successfully!!');

          // Wait for the message to be visible (800ms)
          setTimeout(() => {
            setMessage('');
            // Navigate to /orders after the message is cleared
            // navigate('/orders');
          }, 1000); // Message will be visible for 800ms

  
        setOrderPlaced(true);
        setMessage('Order placed successfully!!');
        // navigate('/orders');
     
      } else {
        console.log(result.message);
        setMessage(result.message || 'Failed to place the order.');
        setTimeout(() => {
          setMessage('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('An error occurred while placing the order.');
      setTimeout(() => {
        setMessage('');
      }, 1000);
    }
  };
  

  if (message) {
    return <p>{message}</p>;
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="empty-cart">
        <h2>YOUR CART IS EMPTY!.</h2>
        <Link to="/search">
          <button className="buy-button">Let's Buy</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            <h2>{item.name}</h2>
            <p>Price: ₹{item.price}</p>
            <p>{item.description}</p>
            <button onClick={() => removeFromCart(item._id)}>Remove from Cart</button>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <h3>TOTAL PRICE: ₹{totalPrice}</h3>
      </div>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default CartPage;
