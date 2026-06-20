import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OverlandTeaser from './overland-teaser'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OverlandTeaser />
  </StrictMode>,
)
