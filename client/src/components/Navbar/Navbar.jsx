import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { jwtDecode } from 'jwt-decode'
import './Navbar.css'

const Navbar = () => {
  const {logout} = useLogout()
  const { user } = useAuthContext()
  const [isAdmin, setAdmin] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() =>{
    if (user){
      const decodedToken=jwtDecode(user.token)
      setAdmin(decodedToken.isAdmin)
      console.log(isAdmin);
    }
  },[user])


  const handleMouseEnter = (e) => {
    e.preventDefault()
    setDropdownVisible(true);
  };


  const handleMouseLeave = (e) => {
    e.preventDefault()
    setDropdownVisible(false);
  };


  const handleClick = () => {
    logout()
    setDropdownVisible(false);
  }

  return (
    <header id='header' className='header'>
      <div className='container'>
        <Link to={"/"} style={{ textDecoration: 'none' }} className="logo-container">
          <h1 id='main'>GiftVentures</h1> 
          <img src={require("../../IMG/gvlg.png")} alt="Logo" className="logo" />
        </Link>
        <nav>
        <Link to={"/"}>
          <h1>Főoldal</h1>
        </Link>
        <Link to={"/programs"}>
          <h1>Programok</h1>
        </Link>
        <Link to={"/about "}>
          <h1>Rólunk</h1>
        </Link>
          {user && (
            <>
              <div className='profile'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
                <img src={require("../../IMG/user.png")} alt="aa" />
                <i class={isDropdownVisible? 'arrow up' : 'arrow down'}></i>
                {isDropdownVisible && (
                <div className='dropdown-menu' 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                  <div>
                    <div className='user-links'>
                      <Link to='/profile'>Profil</Link>
                      <Link>Mentett Programjaim</Link>
                    </div>
                    {isAdmin ? (
                      <div className='admin-links'>
                        <p>Admin eszközök</p>
                        <Link to='/addprogram'>Program felvétele</Link>
                        <Link>Programok szerkesztése</Link>
                      </div>
                    ) : (null)}
                  </div>
                  <button id='signout' onClick={handleClick}>Kijelentkezés</button>
                </div>
              )}
              </div>
            </>
          )}
          {!user && (
          <div className='signupContainer'>
            <Link to= "/signup"><button className='register'>Regisztráció</button></Link>
            <Link to="/login" className='login'>vagy bejelentkezés</Link>
          </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar