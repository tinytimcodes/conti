import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.jsx"

console.log("✅ main.jsx is running");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)