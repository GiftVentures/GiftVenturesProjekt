import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContex';
import { UserdataContextProvider } from './context/UserdataContext';
import { TransparentNavbar } from './TransparentNavbar';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserdataContextProvider>
          <App /> 
      </UserdataContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);



