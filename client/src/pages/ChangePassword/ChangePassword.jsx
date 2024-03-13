import React, { useEffect, useState } from 'react'
import { useAuthContext } from "../../hooks/useAuthContext";
import './ChangePassword.css'

const ChangePassword = () => {
    const { user } = useAuthContext();
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [displayedMessage, setDisplayedMessage] = useState(null);
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
  
      const renderRequirementStatus = (isMet) => {
        return isMet ? <span style={{ color: 'green' }}>✔</span> : <span style={{ color: 'red' }}>✘</span>;
      };

      const handleSubmit = async (e) => {
        e.preventDefault()
        if (password === confirmPassword){
            setDisplayedMessage(null)
            try {
                const response = await fetch("http://localhost:3500/api/user/update", {
                  method: "POST", // Assuming you are sending data as a POST request
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify({
                    password
                  }),
                });
            
                const json = await response.json();
             
            
                if (response.ok) {
                  setDisplayedMessage("Sikeres jelszó frissítés")
                } else {
                    console.error(`Error updating user: ${response.statusText}`);
                  setDisplayedMessage(json)
                }
              } catch (error) {
                console.error('Error updating user:', error);
                // Handle error, maybe show an error message
              }
          } else {
            setDisplayedMessage("A jelszavak nem egyeznek")
          }
      }

  return (
    <form className='passwordChange' onSubmit={handleSubmit}>
        <label> Új jelszó:</label>
      <input 
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <label>Új jelszó megerősítése:</label>
      <input 
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
      />
      <div className='password-requirements'>
        <p>Jelszónak tartalmaznia kell:</p>
        <ul>
          <li>
            Legalább 8 karakter: {renderRequirementStatus(passwordRequirementsMet.length)}
          </li>
          <li>
            Kis- és nagybetűket: {renderRequirementStatus(passwordRequirementsMet.lowercase && passwordRequirementsMet.uppercase)}
          </li>
          <li>
            Számot: {renderRequirementStatus(passwordRequirementsMet.number)}
          </li>
          <li>
            Legalább egy speciális karaktert: {renderRequirementStatus(passwordRequirementsMet.specialChar)}
          </li>
        </ul>
      </div>
      <button type='submit'>Sign Up</button>
      {displayedMessage && <div className={displayedMessage === "Sikeres jelszó frissítés" ? 'success' : 'error'}>{displayedMessage}</div>}
    </form>
  )
}

export default ChangePassword