import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Observatory from './Observatory'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.startsWith('/observatory') ? <Observatory /> : <App />}
  </StrictMode>,
)
