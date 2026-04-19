import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-[var(--color-darker)]">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
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
