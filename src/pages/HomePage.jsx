import { Link } from 'react-router-dom';
import { ArrowRight, Pizza, Flame, Star, Clock } from 'lucide-react';

const HomePage = () => {
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
                <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🍕</div>
                <div className="absolute top-40 right-16 text-5xl opacity-15 animate-float delay-200">🍔</div>
                <div className="absolute bottom-40 left-20 text-4xl opacity-10 animate-float delay-400">🥤</div>
                <div className="absolute bottom-32 right-10 text-5xl opacity-15 animate-float delay-300">🍟</div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="opacity-0 animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-[var(--color-secondary)] mb-6">
                            <Flame size={16} className="text-[var(--color-primary)]" />
                            Fresh & Hot — Crafted with Love
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 opacity-0 animate-fade-in-up delay-100 leading-tight">
                        <span className="gradient-text">Pizza</span>
                        <span className="text-white">burg</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up delay-200">
                        Where juicy burgers meet crispy pizzas. Handcrafted with premium ingredients,
                        served hot and fresh — every single time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
                        <Link
                            to="/menu"
                            className="btn-primary text-lg px-8 py-4 rounded-2xl animate-pulse-glow"
                        >
                            Start Order
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/menu"
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl glass text-white font-semibold hover:bg-white/10 transition-all duration-300"
                        >
                            <Pizza size={20} />
                            View Menu
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 opacity-0 animate-fade-in-up delay-500">
                        <StatCard icon={<Star size={20} />} value="4.9" label="Rating" />
                        <StatCard icon={<Clock size={20} />} value="15m" label="Avg. Delivery" />
                        <StatCard icon={<Flame size={20} />} value="50+" label="Menu Items" />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
                        <div className="w-1.5 h-3 rounded-full bg-white/50 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 opacity-0 animate-fade-in-up">
                        Why <span className="gradient-text">Pizzaburg</span>?
                    </h2>
                    <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-xl mx-auto opacity-0 animate-fade-in-up delay-100">
                        We don't just serve food. We serve an experience.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            emoji="🔥"
                            title="Fresh Ingredients"
                            description="Premium quality, locally sourced ingredients. Every bite tastes like heaven."
                            delay={0}
                        />
                        <FeatureCard
                            emoji="⚡"
                            title="Lightning Fast"
                            description="Average prep time of just 15 minutes. Your hunger doesn't wait, neither do we."
                            delay={1}
                        />
                        <FeatureCard
                            emoji="💎"
                            title="Best Prices"
                            description="Premium food at affordable prices. Quality that doesn't break the bank."
                            delay={2}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center glass-card p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to <span className="gradient-text">Order</span>?
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
                        Browse our delicious menu, pick your favorites, and get your food hot and fresh.
                        No login required!
                    </p>
                    <Link
                        to="/menu"
                        className="btn-primary text-lg px-10 py-4 rounded-2xl inline-flex"
                    >
                        Browse Menu
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, value, label }) => (
    <div className="glass-card p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1 text-[var(--color-secondary)]">
            {icon}
            <span className="text-2xl sm:text-3xl font-black text-white">{value}</span>
        </div>
        <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">{label}</span>
    </div>
);

const FeatureCard = ({ emoji, title, description, delay }) => (
    <div
        className="glass-card p-8 text-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${delay * 0.15 + 0.3}s`, animationFillMode: 'forwards' }}
    >
        <span className="text-4xl mb-4 block">{emoji}</span>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{description}</p>
    </div>
);

export default HomePage;
