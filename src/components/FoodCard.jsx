import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item, index }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <div
            className="glass-card overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
        >
            {/* Image */}
            <div className="relative overflow-hidden group">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg">
                        ৳{item.price}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
                    {item.description}
                </p>

                <button
                    onClick={handleAdd}
                    className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${added
                            ? 'bg-[var(--color-accent)] text-white scale-95'
                            : 'btn-primary hover:shadow-lg hover:shadow-[var(--color-primary)]/30'
                        }`}
                >
                    {added ? (
                        <>
                            <Check size={18} />
                            Added!
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FoodCard;
