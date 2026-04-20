import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import {
    Shield,
    Clock,
    ChefHat,
    CheckCircle,
    Package,
    Phone,
    Hash,
    DollarSign,
    LayoutList,
    PlusCircle,
    Utensils,
    TrendingUp,
    Wallet,
    LogOut,
    BarChart2,
    ShoppingBag,
    CalendarDays,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

/* ── Animation variants ─────────────────────────────────────── */
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

/* ── Helpers ─────────────────────────────────────────────────── */
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Map item id prefix → category name
const CATEGORY_MAP = {
    b: '🍔 Burgers',
    p: '🍕 Pizza',
    s: '🍱 Set Menu',
    d: '🥤 Drinks',
    m: '🆕 Added',
};

const PIE_COLORS = ['#ff5a1f', '#f59e0b', '#10b981', '#3b82f6', '#a855f7'];

function buildLast7Days(orders) {
    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const label = DAY_LABELS[d.getDay()];
        const dateStr = d.toLocaleDateString();
        const sales = orders
            .filter((o) => {
                const od = new Date(o.timestamp || new Date(o.time)).toLocaleDateString();
                return od === dateStr;
            })
            .reduce((sum, o) => sum + o.total, 0);
        result.push({ day: label, sales });
    }
    return result;
}

function buildCategoryData(orders) {
    const map = {};
    orders.forEach((order) => {
        order.items.forEach((item) => {
            const prefix = item.id?.[0] ?? 'm';
            const cat = CATEGORY_MAP[prefix] ?? '🍽️ Other';
            map[cat] = (map[cat] ?? 0) + item.price * item.quantity;
        });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
}

/* ── Custom Tooltip for BarChart ─────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: 'rgba(18,18,30,0.96)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.85rem',
            }}
        >
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</p>
            <p style={{ color: '#ff5a1f', fontWeight: 700 }}>৳{payload[0].value.toLocaleString()}</p>
        </div>
    );
};

/* ── Custom Tooltip for PieChart ─────────────────────────────── */
const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: 'rgba(18,18,30,0.96)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.85rem',
            }}
        >
            <p style={{ color: 'white', fontWeight: 600 }}>{payload[0].name}</p>
            <p style={{ color: payload[0].payload.fill ?? '#ff5a1f', fontWeight: 700 }}>
                ৳{payload[0].value.toLocaleString()}
            </p>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                */
/* ══════════════════════════════════════════════════════════════ */
const AdminPage = () => {
    const { orders, updateOrderStatus, addMenuItem, categories } = useCart();
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('analytics');
    const navigate = useNavigate();

    /* ── Form state for add-menu ─────────────── */
    const [newItem, setNewItem] = useState({
        name: '', price: '', description: '', image: '',
        category: categories?.[0]?.id || 'burger',
    });

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price || !newItem.category) return;
        const item = {
            id: 'm_' + Date.now(),
            name: newItem.name,
            price: Number(newItem.price),
            description: newItem.description || 'Delicious new item',
            image: newItem.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        };
        addMenuItem(newItem.category, item);
        setNewItem({ name: '', price: '', description: '', image: '', category: categories?.[0]?.id || 'burger' });
        alert('Menu item added successfully!');
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_logged_in');
        navigate('/admin-login');
    };

    /* ── Analytics calculations ──────────────── */
    const analytics = useMemo(() => {
        const now = new Date();
        const todayStr = now.toLocaleDateString();

        // Week boundary (last 7 days)
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 6);
        weekAgo.setHours(0, 0, 0, 0);

        let todaySales = 0, weeklySales = 0, totalRevenue = 0;

        orders.forEach((o) => {
            const ts = o.timestamp ? new Date(o.timestamp) : new Date(o.time);
            totalRevenue += o.total;
            if (ts.toLocaleDateString() === todayStr) todaySales += o.total;
            if (ts >= weekAgo) weeklySales += o.total;
        });

        const dailyProfit = todaySales * 0.3;
        const barData = buildLast7Days(orders);
        const pieData = buildCategoryData(orders);

        return { todaySales, weeklySales, totalRevenue, dailyProfit, barData, pieData };
    }, [orders]);

    /* ── Order helpers ───────────────────────── */
    const filteredOrders = filter === 'all'
        ? [...orders].reverse()
        : [...orders].filter((o) => o.status === filter).reverse();

    const statusCounts = {
        all: orders.length,
        Pending: orders.filter((o) => o.status === 'Pending').length,
        Preparing: orders.filter((o) => o.status === 'Preparing').length,
        Done: orders.filter((o) => o.status === 'Done').length,
    };

    const statusConfig = {
        Pending: {
            color: 'bg-[var(--color-pending)]/15 text-[var(--color-pending)] border-[var(--color-pending)]/30',
            icon: <Clock size={14} />,
        },
        Preparing: {
            color: 'bg-[var(--color-preparing)]/15 text-[var(--color-preparing)] border-[var(--color-preparing)]/30',
            icon: <ChefHat size={14} />,
        },
        Done: {
            color: 'bg-[var(--color-done)]/15 text-[var(--color-done)] border-[var(--color-done)]/30',
            icon: <CheckCircle size={14} />,
        },
    };

    /* ── Tab definitions ─────────────────────── */
    const TABS = [
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
        { id: 'orders', label: 'Orders', icon: <Package size={16} /> },
        { id: 'menu', label: 'Menu', icon: <Utensils size={16} /> },
    ];

    /* ══════════════ RENDER ══════════════ */
    return (
        <div className="min-h-screen pt-24 pb-24 md:pb-8 px-4">
            <motion.div
                className="max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* ── Header ── */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Shield size={28} className="text-[var(--color-primary)]" />
                                <h1 className="text-3xl sm:text-4xl font-black">
                                    Admin <span className="gradient-text">Panel</span>
                                </h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">
                                Analytics, orders & menu management
                            </p>
                        </div>
                        {/* mobile logout */}
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-all duration-200 text-sm font-medium ml-4"
                        >
                            <LogOut size={15} /> Logout
                        </motion.button>
                    </div>

                    {/* Tabs + desktop logout */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1 glass p-1.5 rounded-2xl flex-1 md:flex-none">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === t.id
                                            ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                                            : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {t.icon}{t.label}
                                </button>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-all duration-200 text-sm font-medium"
                        >
                            <LogOut size={16} /> Logout
                        </motion.button>
                    </div>
                </motion.div>

                {/* ══ ANALYTICS TAB ══ */}
                {activeTab === 'analytics' && (
                    <>
                        {/* KPI Cards */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        >
                            <KPICard
                                label="Today's Sales"
                                value={`৳${analytics.todaySales.toLocaleString()}`}
                                sub={`Est. profit ৳${analytics.dailyProfit.toFixed(0)}`}
                                icon={<Wallet size={22} />}
                                gradient="from-[#ff5a1f] to-[#f59e0b]"
                            />
                            <KPICard
                                label="Weekly Sales"
                                value={`৳${analytics.weeklySales.toLocaleString()}`}
                                sub="Last 7 days"
                                icon={<CalendarDays size={22} />}
                                gradient="from-[#8b5cf6] to-[#3b82f6]"
                            />
                            <KPICard
                                label="Total Orders"
                                value={orders.length}
                                sub={`${statusCounts.Done} completed`}
                                icon={<ShoppingBag size={22} />}
                                gradient="from-[#10b981] to-[#059669]"
                            />
                            <KPICard
                                label="Total Revenue"
                                value={`৳${analytics.totalRevenue.toLocaleString()}`}
                                sub="All time"
                                icon={<TrendingUp size={22} />}
                                gradient="from-[#f59e0b] to-[#ef4444]"
                            />
                        </motion.div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Bar Chart — last 7 days */}
                            <motion.div
                                variants={itemVariants}
                                className="lg:col-span-2 glass-card p-6"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart2 size={20} className="text-[var(--color-primary)]" />
                                    <h2 className="font-bold text-white text-lg">Sales — Last 7 Days</h2>
                                </div>
                                {analytics.barData.every((d) => d.sales === 0) ? (
                                    <EmptyChart message="No sales data yet" />
                                ) : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={analytics.barData} barCategoryGap="35%">
                                            <defs>
                                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ff5a1f" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="rgba(255,255,255,0.06)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(v) => `৳${v}`}
                                                width={60}
                                            />
                                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                            <Bar dataKey="sales" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </motion.div>

                            {/* Pie Chart — category-wise */}
                            <motion.div
                                variants={itemVariants}
                                className="glass-card p-6"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <DollarSign size={20} className="text-[var(--color-secondary)]" />
                                    <h2 className="font-bold text-white text-lg">Revenue by Category</h2>
                                </div>
                                {analytics.pieData.length === 0 ? (
                                    <EmptyChart message="No orders yet" />
                                ) : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie
                                                data={analytics.pieData}
                                                cx="50%"
                                                cy="45%"
                                                innerRadius={55}
                                                outerRadius={90}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {analytics.pieData.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Legend
                                                iconType="circle"
                                                iconSize={8}
                                                formatter={(value) => (
                                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </motion.div>
                        </div>

                        {/* Mini order status overview */}
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Pending', count: statusCounts.Pending, icon: <Clock size={18} />, color: 'var(--color-pending)' },
                                { label: 'Preparing', count: statusCounts.Preparing, icon: <ChefHat size={18} />, color: 'var(--color-preparing)' },
                                { label: 'Completed', count: statusCounts.Done, icon: <CheckCircle size={18} />, color: 'var(--color-done)' },
                            ].map((s) => (
                                <motion.div
                                    key={s.label}
                                    whileHover={{ scale: 1.03 }}
                                    className="glass-card p-4 flex items-center gap-4"
                                    style={{ borderLeft: `3px solid ${s.color}` }}
                                >
                                    <span style={{ color: s.color }}>{s.icon}</span>
                                    <div>
                                        <p className="text-2xl font-black text-white">{s.count}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}

                {/* ══ ORDERS TAB ══ */}
                {activeTab === 'orders' && (
                    <>
                        {/* Filters */}
                        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6 flex-wrap">
                            <LayoutList size={18} className="text-[var(--color-text-muted)]" />
                            {['all', 'Pending', 'Preparing', 'Done'].map((f) => (
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === f
                                            ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                                            : 'glass text-[var(--color-text-muted)] hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {f === 'all' ? 'All' : f} ({statusCounts[f]})
                                </motion.button>
                            ))}
                        </motion.div>

                        {filteredOrders.length === 0 ? (
                            <motion.div variants={itemVariants} className="text-center py-20">
                                <span className="text-6xl block mb-4">📋</span>
                                <h3 className="text-xl font-bold text-white mb-2">No orders matched</h3>
                            </motion.div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <motion.div variants={itemVariants} className="hidden lg:block glass-card overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    {['Token', 'Phone', 'Items', 'Total', 'Time', 'Status', 'Actions'].map((h) => (
                                                        <th key={h} className={`px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((order) => (
                                                    <tr key={order.token} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-[var(--color-primary)]">{order.token}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{order.phone}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-xs flex flex-wrap gap-1">
                                                                {order.items.map((item) => (
                                                                    <span key={item.id} className="text-xs bg-white/5 rounded-md px-2 py-1 text-[var(--color-text-muted)]">
                                                                        {item.name} ×{item.quantity}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-[var(--color-secondary)]">৳{order.total}</td>
                                                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">{order.time}</td>
                                                        <td className="px-6 py-4">
                                                            <motion.span layout className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[order.status]?.color}`}>
                                                                {statusConfig[order.status]?.icon}
                                                                {order.status}
                                                            </motion.span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-end gap-1">
                                                                {['Pending', 'Preparing', 'Done'].map((status) => (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                        key={status}
                                                                        onClick={() => updateOrderStatus(order.token, status)}
                                                                        disabled={order.status === status}
                                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${order.status === status
                                                                                ? 'bg-white/5 text-[var(--color-text-dim)] cursor-not-allowed'
                                                                                : 'hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {status}
                                                                    </motion.button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>

                                {/* Mobile Cards */}
                                <div className="lg:hidden space-y-4">
                                    {filteredOrders.map((order) => (
                                        <motion.div variants={itemVariants} key={order.token} className="glass-card p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-lg text-[var(--color-primary)]">{order.token}</span>
                                                <motion.span layout className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[order.status]?.color}`}>
                                                    {statusConfig[order.status]?.icon}{order.status}
                                                </motion.span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                                <div className="flex items-center gap-2 text-[var(--color-text-muted)]"><Phone size={14} />{order.phone}</div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-muted)]"><Clock size={14} />{order.time}</div>
                                                <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold"><DollarSign size={14} />৳{order.total}</div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-muted)]"><Hash size={14} />{order.items.reduce((s, i) => s + i.quantity, 0)} items</div>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {order.items.map((item) => (
                                                    <span key={item.id} className="text-xs bg-white/5 rounded-md px-2 py-1 text-[var(--color-text-muted)]">
                                                        {item.name} ×{item.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {['Pending', 'Preparing', 'Done'].map((status) => (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        key={status}
                                                        onClick={() => updateOrderStatus(order.token, status)}
                                                        disabled={order.status === status}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${order.status === status
                                                                ? `${statusConfig[status]?.color} border`
                                                                : 'bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10 hover:text-white'
                                                            }`}
                                                    >
                                                        {status}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* ══ MENU TAB ══ */}
                {activeTab === 'menu' && (
                    <motion.div variants={itemVariants} className="max-w-2xl mx-auto glass-card p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <PlusCircle className="text-[var(--color-secondary)]" size={24} />
                            <h2 className="text-2xl font-bold">Add New Menu Item</h2>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Item Name</label>
                                <input required type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                                    placeholder="e.g. Spicy Chicken Burger" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Price (৳)</label>
                                    <input required type="number" min="0" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                                        placeholder="e.g. 250" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Category</label>
                                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50">
                                        {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.emoji} {c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Description</label>
                                <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 h-24 resize-none"
                                    placeholder="Short tasty description..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Image URL (Optional)</label>
                                <input type="url" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                                    placeholder="https://..." />
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                                className="w-full py-4 mt-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg hover:bg-[var(--color-primary-dark)] transition-colors inline-flex items-center justify-center gap-2">
                                <PlusCircle size={20} /> Add Item to Menu
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

/* ── Sub-components ──────────────────────────────────────────── */

const KPICard = ({ label, value, sub, icon, gradient }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        className="glass-card p-5 flex flex-col gap-3 overflow-hidden relative"
    >
        <div
            style={{
                position: 'absolute', inset: 0, opacity: 0.07,
                background: `linear-gradient(135deg, ${gradient.replace('from-[', '').replace('] to-[', ',').replace(']', '')})`,
            }}
        />
        <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white`}
            style={{ flexShrink: 0 }}
        >
            {icon}
        </div>
        <div>
            <p className="text-2xl font-black text-white leading-tight">{value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{label}</p>
            {sub && <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</p>}
        </div>
    </motion.div>
);

const EmptyChart = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-[240px] gap-3">
        <span className="text-5xl">📊</span>
        <p className="text-[var(--color-text-muted)] text-sm">{message}</p>
    </div>
);

export default AdminPage;
