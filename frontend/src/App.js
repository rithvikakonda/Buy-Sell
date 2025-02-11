
import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


import { BrowserRouter,Routes,Route,useLocation} from 'react-router-dom';

import Home from './Pages/Home.jsx';
import Search from './Pages/Search.jsx';
import Cart from './Pages/Cart.jsx';
import Orders from './Pages/Orders.jsx';
import Profile from './Pages/Profile.jsx';
import Deliver from './Pages/Deliver.jsx';
import LoginSignup from './Pages/LoginSignup.jsx';
import ProtectedRoute from './Components/ProtectedRoute.js';
import ItemDetails from './Components/Items/singleitem.jsx';
import AddItemPage from './Components/Items/additem.jsx';
import Support from './Pages/Support.jsx';

// import Example from './Components/Navbar/ex.jsx'
function App() {
  const location = useLocation();
  const shouldShowNavbar = !['/', '/login-signup'].includes(location.pathname);

  // const shouldShowNavbar = location.pathname !== ('/login-signup' ) ; // Replace with your route

  return (
   <div >
    {/* <BrowserRouter> */}
    {/* <Navbar/> */}
    {shouldShowNavbar && <Navbar />}
    <Routes>
      {/* <Route path='/' element={<Start/>}/> */}
      <Route path='/' element={<Home/>}/>
      <Route path='/search' element={<ProtectedRoute><Search/> </ProtectedRoute>}/>
      <Route path="/orders" element={ <ProtectedRoute> <Orders /> </ProtectedRoute>}/>
      <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>}/>
      <Route path="/deliver" element={ <ProtectedRoute> <Deliver/> </ProtectedRoute> }/>
      <Route path="/cart" element={  <ProtectedRoute> <Cart/> </ProtectedRoute>} />
      <Route path="/add-item" element={  <ProtectedRoute> <AddItemPage /></ProtectedRoute>} /> 
      {/* <Route path="/items" element={<ItemsList />} /> */}
      <Route path="/items/:id" element={<ProtectedRoute> <ItemDetails /></ProtectedRoute>} />

     
      <Route path = '/login-signup'element={<LoginSignup/>}/>
       <Route path = '/support'element={<ProtectedRoute> <Support/></ProtectedRoute>}/>



      
    </Routes>
    
    {/* </BrowserRouter> */}
  
   

   </div>
  );
}

export default App;
