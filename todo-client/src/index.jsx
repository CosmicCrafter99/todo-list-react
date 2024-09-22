import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import './app/styles/index.css';
import App from './app/App';
import reportWebVitals from './shared/config/reportWebVitals';
import { AuthProvider } from './features/auth/model/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider maxSnack={3}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
