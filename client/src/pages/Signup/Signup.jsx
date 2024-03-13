import React, { useEffect, useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [secondName, setSecondName] = useState('')
    const {signup, error, isLoading} = useSignup()
    const [displayedError, setDisplayedError] = useState(null);
    const [passwordRequirementsMet, setPasswordRequirementsMet] = useState({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
    });

    useEffect(() => {
      // Check password requirements whenever password changes
      checkPasswordRequirements(password);
    }, [password]);

    const checkPasswordRequirements = (password) => {
      const minLength = 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
  
      setPasswordRequirementsMet({
        length: password.length >= minLength,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        number: hasNumber,
        specialChar: hasSpecialChar,
      });
    };

    const validateName = (name) => {
      // Reguláris kifejezés: csak betűk, szóközök, kötőjelek
      const nameRegex = /^[a-zA-ZáéíóúüőűÁÉÍÓÚÜŐŰ-]+$/;
      return nameRegex.test(name);
    };

    const renderRequirementStatus = (isMet) => {
      return isMet ? <span style={{ color: 'green' }}>✔</span> : <span style={{ color: 'red' }}>✘</span>;
    };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateName(firstName) || !validateName(secondName)){
      setDisplayedError("A nevedben nem lehetnek számok")
      return;
    }
    if (password === confirmPassword){
      setDisplayedError(null)
      await signup(email, firstName, secondName, password )
    } else {
      setDisplayedError("A jelszavak nem egyeznek")
    }
  }

  return (
    <form className='signup' onSubmit={handleSubmit}>
      <h3>Regisztráció</h3>

      <label>Email:</label>
      <input 
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Keresztnév:</label>
      <input 
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
      />

      <label>Vezetéknév:</label>
      <input 
        type="text"
        onChange={(e) => setSecondName(e.target.value)}
        value={secondName}
      />

      <label>Jelszó:</label>
      <input 
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <label>Jelszó újra:</label>
      <input 
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
      />
      <div className='password-requirements'>
        <p>Jelszónak tartalmaznia kell:</p>
        <ul>
          <li>
            Legalább 8 karaktert: {renderRequirementStatus(passwordRequirementsMet.length)}
          </li>
          <li>
            Kis- és nagybetűket: {renderRequirementStatus(passwordRequirementsMet.lowercase && passwordRequirementsMet.uppercase)}
          </li>
          <li>
            Legalább egy Számot: {renderRequirementStatus(passwordRequirementsMet.number)}
          </li>
          <li>
            Legalább egy speciális karaktert: {renderRequirementStatus(passwordRequirementsMet.specialChar)}
          </li>
        </ul>
      </div>
      <button disabled={isLoading}>Regisztráció</button>
      <p >A weboldal regisztrációjával elfogadod az <a className='aszf' target='_blank' href="https://webshippy.com/wp-content/uploads/webshop-ingyenes-ASZF-minta.pdf">ÁSZF feltételeit</a></p>
      {displayedError && <div className='error'>{displayedError}</div>}
      {!displayedError && error && <div className='error'>{error}</div>}
    </form>
  )
}

export default Signup