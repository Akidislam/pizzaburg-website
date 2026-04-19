import { useState } from 'react';
import menuData, { categories } from '../data/menuData';
import FoodCard from '../components/FoodCard';
import { Search, X } from 'lucide-react';

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('burger');
    const [searchQuery, setSearchQuery] = useState('');

    const currentItems = menuData[activeCategory] || [];

    const filteredItems = searchQuery
        ? Object.values(menuData)
            .flat()
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        : currentItems;

    return (
        <div className="min-h-screen pt-24 pb-24 md:pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 opacity-0 animate-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl font-black mb-3">
                        Our <span className="gradient-text">Menu</span>
                    </h1>
                    <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                        Handcrafted with love. Pick your favorites and start your feast.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-8 opacity-0 animate-fade-in-up delay-100">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                        />
                        <input
                            type="text"
                            placeholder="Search for food..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 rounded-2xl glass border-none text-white placeholder-[var(--color-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Tabs */}
                {!searchQuery && (
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap opacity-0 animate-fade-in-up delay-200">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${activeCategory === cat.id
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-105'
                                        : 'glass text-[var(--color-text-muted)] hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <span>{cat.emoji}</span>
                                <span className="hidden sm:inline">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Results Label */}
                {searchQuery && (
                    <div className="mb-6 text-center">
                        <p className="text-[var(--color-text-muted)]">
                            Found <span className="text-white font-bold">{filteredItems.length}</span> result
                            {filteredItems.length !== 1 ? 's' : ''} for "
                            <span className="text-[var(--color-secondary)]">{searchQuery}</span>"
                        </p>
                    </div>
                )}

                {/* Food Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                        <FoodCard key={item.id} item={item} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20 opacity-0 animate-fade-in">
                        <span className="text-6xl block mb-4">😕</span>
                        <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                        <p className="text-[var(--color-text-muted)]">
                            Try a different search term or browse our categories
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
