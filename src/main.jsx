import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import 'lenis/dist/lenis.css'
import './styles/variables.css'
import './styles/global.css'
import App from './App.jsx'

// Register @gsap/react plugin once at app bootstrap — required before any
// component calls useGSAP(). Must be at module level, not inside a component.
gsap.registerPlugin(useGSAP)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
