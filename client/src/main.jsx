import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext'  // Adjust path as needed
import { UserProvider } from './UserContext.jsx'

const fontSize = localStorage.getItem('settings_fontSize') || 'medium';
let size;
if (fontSize === 'small') size = '14px';
else if (fontSize === 'large') size = '20px';
else size = '16px';
document.documentElement.style.setProperty('--font-size-base', size);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
)
