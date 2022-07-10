import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext';

import Login from './Login';
import PageMain from './PageMain';
import Signup from './Register';
import PrivateRoute from './PrivateRoute';
import LoggedInRoute from './LoggedInRoute';
import ForgotPassword from './ForgotPassword';
import ContactUs from './ContactUs';
import Profile_Orders from './Profile_Orders';
import Profile_Info from './Profile_Info';
import Header from './Header';
import Footer from './Footer';
import ShoppingCart from './ShoppingCart';
import Admin from './Admin';
import AdminRoute from './AdminRoute';

export default function App() {
  return (
      <>
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<PageMain />}></Route>
              <Route path="/orders" element={<PrivateRoute><Profile_Orders /></PrivateRoute>}></Route>
              <Route path="/profile-info" element={<PrivateRoute><Profile_Info /></PrivateRoute>}></Route>
              <Route path="/shopping-cart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>}></Route>
              <Route path="/signup" element={<LoggedInRoute><Signup /></LoggedInRoute>}></Route>
              <Route path="/login" element={<LoggedInRoute><Login /></LoggedInRoute>}></Route>
              <Route path="/add-product" element={<AdminRoute><Admin /></AdminRoute>}></Route>
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/communication' element={<ContactUs />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </Router>
      </>
  )
}