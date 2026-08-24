import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Observatory from './Observatory'
import { withBase } from './lib/format'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.startsWith(withBase('observatory')) ? <Observatory /> : <App />}
  </StrictMode>,
)
