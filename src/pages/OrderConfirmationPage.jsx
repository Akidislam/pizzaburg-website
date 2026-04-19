import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    CheckCircle,
    Printer,
    Home,
    Clock,
    Phone,
    Hash,
    UtensilsCrossed,
} from 'lucide-react';

const OrderConfirmationPage = () => {
    const { lastOrder } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!lastOrder) {
            navigate('/menu');
        }
    }, [lastOrder, navigate]);

    if (!lastOrder) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen pt-24 pb-24 md:pb-8 px-4 flex items-center justify-center">
            <div className="max-w-lg w-full">
                {/* Success Animation */}
                <div className="text-center mb-8 opacity-0 animate-scale-in" style={{ animationFillMode: 'forwards' }}>
                    <div className="w-24 h-24 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow" style={{ '--tw-shadow-color': 'var(--color-accent)' }}>
                        <CheckCircle size={48} className="text-[var(--color-accent)]" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                        Order Placed! 🎉
                    </h1>
                    <p className="text-[var(--color-text-muted)]">
                        Your food is being prepared with love
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="glass-card p-6 mb-6 opacity-0 animate-fade-in-up delay-200" style={{ animationFillMode: 'forwards' }}>
                    {/* Token */}
                    <div className="text-center mb-6 pb-6 border-b border-white/10">
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Your Token Number</p>
                        <p className="text-4xl font-black gradient-text">{lastOrder.token}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <InfoItem
                            icon={<Phone size={16} />}
                            label="Phone"
                            value={lastOrder.phone}
                        />
                        <InfoItem
                            icon={<Clock size={16} />}
                            label="Time"
                            value={lastOrder.time}
                        />
                        <InfoItem
                            icon={<Hash size={16} />}
                            label="Items"
                            value={`${lastOrder.items.reduce((s, i) => s + i.quantity, 0)} items`}
                        />
                        <InfoItem
                            icon={<UtensilsCrossed size={16} />}
                            label="Status"
                            value="Pending"
                            valueColor="text-[var(--color-warning)]"
                        />
                    </div>

                    {/* Ordered Items */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                            Ordered Items
                        </h3>
                        <div className="space-y-2">
                            {lastOrder.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.name}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">
                                                ৳{item.price} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-white">
                                        ৳{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-lg font-bold text-white">Total</span>
                        <span className="text-2xl font-black gradient-text">৳{lastOrder.total}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-in-up delay-400 no-print" style={{ animationFillMode: 'forwards' }}>
                    <button
                        onClick={handlePrint}
                        className="flex-1 btn-secondary py-3 rounded-2xl text-base"
                    >
                        <Printer size={20} />
                        Print Receipt
                    </button>
                    <Link
                        to="/"
                        className="flex-1 btn-primary py-3 rounded-2xl text-base text-center"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value, valueColor = 'text-white' }) => (
    <div className="glass rounded-xl p-3">
        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs mb-1">
            {icon}
            {label}
        </div>
        <p className={`font-semibold text-sm ${valueColor}`}>{value}</p>
    </div>
);

export default OrderConfirmationPage;
