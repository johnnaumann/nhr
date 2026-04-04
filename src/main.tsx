import { styles as numberFlowStyles } from '@number-flow/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.tsx'

const numberFlowStyleId = 'number-flow-styles'
if (!document.getElementById(numberFlowStyleId)) {
  const el = document.createElement('style')
  el.id = numberFlowStyleId
  el.textContent = numberFlowStyles.join('')
  document.head.prepend(el)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider>
        <App />
        <Toaster richColors />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
