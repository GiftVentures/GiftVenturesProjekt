import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin'
import './ResetPasswordPage.css'


const ResetPasswordPage = () => {
  const { userId, token } = useParams();
  const [loading, setLoading] = useState(true);
  const {loginWithLink, error, isLoading} = useLogin()

  const [thisError, setThisError] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:3500/api/user/resetPassword/${userId}/${token}`);
        if (response.ok) {
            await loginWithLink(userId, token)
        } else {
          setThisError('A link érvénytelen vagy lejárt.');
        }
      } catch (error) {
        console.error('Hiba történt:', error);
        setThisError('Valami hiba történt a kérés során.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [userId, token]);

  if (loading) return <div>Folyamatban...</div>;
  if (error) return <div>Hiba: {error}</div>;
  if (thisError) return <div>Hiba: {thisError}</div>;

};

export default ResetPasswordPage;
