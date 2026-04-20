import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Home, UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
    const { cartCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-glass-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🍕</span>
                        <span className="text-xl font-bold font-[var(--font-display)] gradient-text group-hover:opacity-80 transition-opacity">
                            Pizzaburg
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" icon={<Home size={18} />} label="Home" active={isActive('/')} />
                        <NavLink to="/menu" icon={<UtensilsCrossed size={18} />} label="Menu" active={isActive('/menu')} />

                    </div>

                    {/* Cart Button */}
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-primary)]/30"
                    >
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-scale-in">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-[var(--color-glass-border)] px-2 py-2 flex items-center justify-around z-50">
                <MobileNavLink to="/" icon={<Home size={20} />} label="Home" active={isActive('/')} />
                <MobileNavLink to="/menu" icon={<UtensilsCrossed size={20} />} label="Menu" active={isActive('/menu')} />
                <Link
                    to="/cart"
                    className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 -mt-6 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/40"
                >
                    <ShoppingCart size={22} />
                    <span className="text-[10px] font-medium">Cart</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[var(--color-secondary)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>

            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${active
            ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
            : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        {label}
    </Link>
);

const MobileNavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${active
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-text-muted)]'
            }`}
    >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
    </Link>
);

export default Navbar;
