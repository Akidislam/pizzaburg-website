import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pizza, Flame, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const HomePage = () => {
    const { orders, menu } = useCart();

    const popularItems = useMemo(() => {
        const itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!itemCounts[item.id]) itemCounts[item.id] = 0;
                itemCounts[item.id] += item.quantity;
            });
        });

        const sortedIds = Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([id]) => id);

        const allItems = Object.values(menu).flat();

        let topItems = sortedIds.map(id => allItems.find(item => item.id === id)).filter(Boolean);

        // Fallback to first few items if no orders yet
        if (topItems.length === 0) {
            topItems = allItems.slice(0, 3);
        }

        return topItems.slice(0, 3);
    }, [orders, menu]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop"
                        alt="Pizza background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-darker)]/80 via-[var(--color-darker)]/70 to-[var(--color-darker)]" />
                </div>

                {/* Decorative Elements */}
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-20 left-10 text-6xl opacity-20 hidden md:block">🍕</motion.div>
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute top-40 right-16 text-5xl opacity-15 hidden md:block">🍔</motion.div>
                <motion.div animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }} className="absolute bottom-40 left-20 text-4xl opacity-10 hidden md:block">🥤</motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-32 right-10 text-5xl opacity-15 hidden md:block">🍟</motion.div>

                {/* Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="relative z-10 text-center px-4 max-w-4xl mx-auto"
                >
                    <motion.div variants={itemVariants}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-[var(--color-secondary)] mb-6">
                            <Flame size={16} className="text-[var(--color-primary)]" />
                            Fresh & Hot — Crafted with Love
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                        <span className="gradient-text">Pizza</span>
                        <span className="text-white">burg</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8">
                        Where juicy burgers meet crispy pizzas. Handcrafted with premium ingredients,
                        served hot and fresh — every single time.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/menu"
                                className="btn-primary text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-2"
                            >
                                Start Order
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/menu"
                                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass text-white font-semibold hover:bg-white/10 transition-all duration-300"
                            >
                                <Pizza size={20} />
                                View Menu
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-8 mt-16">
                        <StatCard icon={<Star size={20} />} value="4.9" label="Rating" />
                        <StatCard icon={<Clock size={20} />} value="15m" label="Avg. Delivery" />
                        <StatCard icon={<Flame size={20} />} value="50+" label="Menu Items" />
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-1.5 h-3 rounded-full bg-white/50"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Popular Items Section */}
            <section className="py-20 px-4 bg-black/20">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="max-w-6xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            <span className="gradient-text">Most Popular</span> Choices
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                            Loved by our customers. Try our top ordered items!
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {popularItems.map((item, index) => (
                            <motion.div key={item.id} variants={itemVariants}>
                                <FoodCard item={item} index={index} isPopular={true} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="max-w-6xl mx-auto"
                >
                    <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-center mb-4">
                        Why <span className="gradient-text">Pizzaburg</span>?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-center text-[var(--color-text-muted)] mb-12 max-w-xl mx-auto">
                        We don't just serve food. We serve an experience.
                    </motion.p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            emoji="🔥"
                            title="Fresh Ingredients"
                            description="Premium quality, locally sourced ingredients. Every bite tastes like heaven."
                        />
                        <FeatureCard
                            emoji="⚡"
                            title="Lightning Fast"
                            description="Average prep time of just 15 minutes. Your hunger doesn't wait, neither do we."
                        />
                        <FeatureCard
                            emoji="💎"
                            title="Best Prices"
                            description="Premium food at affordable prices. Quality that doesn't break the bank."
                        />
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="max-w-4xl mx-auto text-center glass-card p-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
                    <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to <span className="gradient-text">Order</span>?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
                        Browse our delicious menu, pick your favorites, and get your food hot and fresh.
                        No login required!
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                            <Link
                                to="/menu"
                                className="btn-primary text-lg px-10 py-4 rounded-2xl flex items-center gap-2"
                            >
                                Browse Menu
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, value, label }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="glass-card p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1 text-[var(--color-secondary)]">
            {icon}
            <span className="text-2xl sm:text-3xl font-black text-white">{value}</span>
        </div>
        <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">{label}</span>
    </motion.div>
);

const FeatureCard = ({ emoji, title, description }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05, y: -10 }}
        className="glass-card p-8 text-center"
    >
        <span className="text-4xl mb-4 block">{emoji}</span>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default HomePage;
