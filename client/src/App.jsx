import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import NotFound from './pages/NotFound.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { UserContext } from "./context/UserContext.jsx";

const App = () => {

  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={user ? <Navigate to={'/'} /> : <Register />} />
      <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
      <Route path='/email-verify' element={<EmailVerify />} />
      <Route path='/reset-password' element={<ResetPassword />} />

      {/* Not Found Page  */}

      <Route path='*' element={<NotFound />} />
    </Routes>



  )
}

export default App
