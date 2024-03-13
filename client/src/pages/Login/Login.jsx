import React, { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()
    const [forgotPassword, setForgotPassword] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password) 
    
  }

  if (forgotPassword) {
    return (
      <ForgotPassword />
    )
  }

  return (
    <form className='login' onSubmit={handleSubmit}>
      <h3>Bejelentkezés</h3>

      <label>Email:</label>
      <input 
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      
      
      <label>Jelszó:</label>
      <input 
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button disabled={isLoading}>Bejelentkezés</button>
      {error && <div className='error'>{error}</div>}
      <a className='forgotPassword' onClick={() => setForgotPassword(true)}>Elfelejtettem a jelszavam</a>
    </form>
  )
}

export default Login