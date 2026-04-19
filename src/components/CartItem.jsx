import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item, index }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div
            className="glass-card p-4 flex items-center gap-4 opacity-0 animate-slide-in-right"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
        >
            {/* Image */}
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{item.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">৳{item.price} each</p>
                <p className="text-[var(--color-secondary)] font-bold mt-1">
                    ৳{item.price * item.quantity}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-[var(--color-surface-lighter)] hover:bg-[var(--color-primary)] text-white flex items-center justify-center transition-all duration-200"
                >
                    <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[var(--color-surface-lighter)] hover:bg-[var(--color-accent)] text-white flex items-center justify-center transition-all duration-200"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Delete */}
            <button
                onClick={() => removeFromCart(item.id)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--color-danger)]/20 text-[var(--color-danger)] flex items-center justify-center transition-all duration-200"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

export default CartItem;
