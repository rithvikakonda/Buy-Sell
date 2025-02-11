import React, { useState } from 'react'

import './Navbar.css'

import { Link,useNavigate } from 'react-router-dom';

import cartImage from './cart.png'
// import './n.css'
// 
const Navbar = () => {

  const [menu,SetMenu] = useState("");
  const navigate = useNavigate(); // To navigate programmatically

   // Logout function
   const handleLogout = () => {
    localStorage.removeItem('token'); // Remove only the token
    localStorage.removeItem('userEmail'); 
    // localStorage.clear(); // Clear all data from localStorage
    navigate('/'); // Redirect to home page
  };

  return (
    // <div>Navbar</div>
    <div className = 'navbar'>
      <div className='nav-logo'>
        {/* <img src={logo} alt=""/> */}
        <p>     Buy-Sell</p>
      </div>
      <ul className = 'nav-menu'>
      <li onClick={()=>{SetMenu("home")}}
          onMouseLeave={() => SetMenu("")}><Link style={{ textDecoration:'none'}} to='/'>HOME</Link></li> 
        <li onClick={()=>{SetMenu("search")}}
          onMouseLeave={() => SetMenu("")}><Link  style={{ textDecoration:'none'}} to='/search'>SEARCH</Link>  </li>
        <li onClick={()=>{SetMenu("orders")}}
          onMouseLeave={() => SetMenu("")}><Link  style={{ textDecoration:'none'}} to='/orders'>ORDERS</Link></li>
        <li onClick={()=>{SetMenu("deliver")}}
          onMouseLeave={() => SetMenu("")}><Link  style={{ textDecoration:'none'}} to='/deliver'>DELIVER</Link></li> 
      
         <li onClick={()=>{SetMenu("support")}}
          onMouseLeave={() => SetMenu("")}><Link  style={{ textDecoration:'none'}} to='/support'>SUPPORT</Link></li>
       

      </ul>
      <div className='nav-profile-cart'>
        <Link  style={{ textDecoration:'none'}} to='/profile'><button>PROFILE</button></Link>
        <Link  style={{ textDecoration:'none'}} to='/cart'>
        {/* <button>Cart</button> */}
        <img src={cartImage} alt='cart' className='cart-icon' />
        </Link>
        <button className='logout' onClick={handleLogout}>LOGOUT</button>
        
      </div>
    </div>
    
    // </>

  )
}



export default Navbar

