import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowLeft, Phone, Loader2, Trash2 } from 'lucide-react';

const CartPage = () => {
    const { cart, cartTotal, clearCart, placeOrder } = useCart();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (!phone.trim()) {
            setError('Please enter your phone number');
            return;
        }
        if (phone.trim().length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setError('');
        setLoading(true);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        placeOrder(phone.trim());
        setLoading(false);
        navigate('/order-confirmation');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-24 md:pb-8 px-4 flex items-center justify-center">
                <div className="text-center opacity-0 animate-scale-in" style={{ animationFillMode: 'forwards' }}>
                    <span className="text-7xl block mb-6">🛒</span>
                    <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
                    <p className="text-[var(--color-text-muted)] mb-8 max-w-sm mx-auto">
                        Looks like you haven't added any items yet. Browse our delicious menu!
                    </p>
                    <Link to="/menu" className="btn-primary text-lg px-8 py-3 rounded-2xl">
                        <ShoppingBag size={20} />
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24 md:pb-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                    <div>
                        <Link
                            to="/menu"
                            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Menu
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-black">
                            Your <span className="gradient-text">Cart</span>
                        </h1>
                    </div>
                    <button
                        onClick={clearCart}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all duration-200 text-sm font-medium"
                    >
                        <Trash2 size={16} />
                        Clear All
                    </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-8">
                    {cart.map((item, index) => (
                        <CartItem key={item.id} item={item} index={index} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="glass-card p-6 opacity-0 animate-fade-in-up delay-300" style={{ animationFillMode: 'forwards' }}>
                    {/* Summary */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-[var(--color-text-muted)]">
                            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                            <span>৳{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-text-muted)]">
                            <span>Tax</span>
                            <span>৳0</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span className="gradient-text">৳{cartTotal}</span>
                        </div>
                    </div>

                    {/* Phone Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                            />
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setError('');
                                }}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] text-white placeholder-[var(--color-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            />
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-[var(--color-danger)] animate-fade-in">{error}</p>
                        )}
                    </div>

                    {/* Place Order Button */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full btn-primary text-lg py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                Processing Order...
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={22} />
                                Place Order — ৳{cartTotal}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
