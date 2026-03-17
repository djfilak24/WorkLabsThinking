import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WorkLabsLanding from './work-labs-landing'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkLabsLanding />
  </StrictMode>,
)
