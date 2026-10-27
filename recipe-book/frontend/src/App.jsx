import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import RecipeFormPage from './pages/RecipeFormPage';
import './App.css';

function NotFound() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <span style={{ fontSize: '4rem', lineHeight: 1 }}>🗺️</span>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}
      >
        Page Not Found
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '320px' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#1d4ed8',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.95rem',
          padding: '0.7rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          marginTop: '0.5rem',
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes/new" element={<RecipeFormPage />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
