import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminPage from './pages/AdminPage';
import PageTransition from './components/PageTransition';
import Loader from './components/Loader';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/order-confirmation" element={<PageTransition><OrderConfirmationPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <Router>
        <AnimatePresence mode="wait">
          {loading && <Loader key="loader" />}
        </AnimatePresence>

        <div className="min-h-screen bg-[var(--color-darker)]">
          <Navbar />
          <main>
            <AppRoutes />
          </main>

          {/* Footer */}
          <footer className="border-t border-[var(--color-glass-border)] py-6 px-4 text-center text-sm text-[var(--color-text-dim)] no-print md:block hidden">
            <p>
              © {new Date().getFullYear()}{' '}
              <span className="gradient-text font-semibold">Pizzaburg</span>. Fresh food,
              served fast.
            </p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
