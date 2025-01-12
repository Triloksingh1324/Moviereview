import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
    domain="dev-48d2s4a2n6vlmvv6.us.auth0.com"
    clientId="Mhd58oKBBhpXGXo8cikMAluVZsT48V7A"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
    </Auth0Provider>
  </StrictMode>,
)
