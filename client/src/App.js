import {BrowserRouter, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuthContext } from './hooks/useAuthContext'
import { useEffect, useState } from 'react';
import { TransparentNavbar } from './TransparentNavbar';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Navbar from './components/Navbar/Navbar';
import Main from './pages/Main/Main';
import Profile from './pages/Profile/Profile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import About from './pages/About/About';
import AddProgram from './pages/AdminPages/AddProgram/AddProgram';
import Error404 from './pages/Error/Error404';
import Programs from './pages/Programs/Programs';
import Program from './pages/Program/Program';
import ResetPasswordPage from './components/ResetPasswordPage/ResetPasswordPage';



function App() {
  const { user } = useAuthContext()
  const [isAdmin, setAdmin] = useState(false)

  useEffect(() =>{
    if (user){
      const decodedToken=jwtDecode(user.token)
      setAdmin(decodedToken.isAdmin)
      console.log(isAdmin);
    }
  },[user])

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <TransparentNavbar />
          <Routes>
            <Route path="/" element={<Main />}/>
            <Route path="*" element={<Error404 />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/programs" element={<Programs />}/>
            <Route path="/programs/:programId" element={<Program />}/>
            
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />}/>
            <Route path="/passwordChange" element={user ? <ChangePassword /> : <Navigate to="/login" /> }/>
            <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage /> } />
              
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login /> }/>
            <Route path="/signup" element={user ? <Navigate to="/profile" /> : <Signup /> }/>

            <Route path="/addprogram" element={isAdmin ? <AddProgram /> : <Navigate to="/" /> }/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
