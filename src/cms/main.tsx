/**
 * Studio 入口（admin.html 专用）
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import StudioApp from './StudioApp'

createRoot(document.getElementById('studio-root')!).render(
  <StrictMode>
    <StudioApp />
  </StrictMode>,
)
