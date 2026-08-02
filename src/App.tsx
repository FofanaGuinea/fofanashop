import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProduitsPage from '@/pages/ProduitsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/produits" replace />} />
          <Route path="/produits" element={<ProduitsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
