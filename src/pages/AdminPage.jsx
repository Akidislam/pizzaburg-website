import { useState } from 'react';
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
    Wallet
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const AdminPage = () => {
    const { orders, updateOrderStatus, addMenuItem, categories } = useCart();
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('orders');

    // Add Item Form State
    const [newItem, setNewItem] = useState({
        name: '', price: '', description: '', image: '', category: categories?.[0]?.id || 'burger'
    });

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price || !newItem.category) return;
        const item = {
            id: 'm_' + Date.now(),
            name: newItem.name,
            price: Number(newItem.price),
            description: newItem.description || 'Delicious new item',
            image: newItem.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
        };
        addMenuItem(newItem.category, item);
        setNewItem({ name: '', price: '', description: '', image: '', category: categories?.[0]?.id || 'burger' });
        alert('Menu item added successfully!');
    };

    const filteredOrders =
        filter === 'all'
            ? [...orders].reverse()
            : [...orders].filter((o) => o.status === filter).reverse();

    const statusCounts = {
        all: orders.length,
        Pending: orders.filter((o) => o.status === 'Pending').length,
        Preparing: orders.filter((o) => o.status === 'Preparing').length,
        Done: orders.filter((o) => o.status === 'Done').length,
    };

    // Calculate Daily Sales and Profit
    const todayStr = new Date().toLocaleDateString();
    const todaysOrders = orders.filter(o => {
        const orderDate = new Date(o.timestamp || new Date(o.time)).toLocaleDateString();
        return orderDate === todayStr && o.status === 'Done';
    });
    const dailySales = todaysOrders.reduce((sum, o) => sum + o.total, 0);
    const dailyProfit = dailySales * 0.3; // Estimated 30% profit

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

    return (
        <div className="min-h-screen pt-24 pb-24 md:pb-8 px-4">
            <motion.div
                className="max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield size={28} className="text-[var(--color-primary)]" />
                            <h1 className="text-3xl sm:text-4xl font-black">
                                Admin <span className="gradient-text">Panel</span>
                            </h1>
                        </div>
                        <p className="text-[var(--color-text-muted)]">
                            Manage orders, view sales analytics, and update menu
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 glass p-1.5 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'orders' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'}`}
                        >
                            <Package size={16} />
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'menu' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'}`}
                        >
                            <Utensils size={16} />
                            Menu
                        </button>
                    </div>
                </motion.div>

                {activeTab === 'orders' ? (
                    <>
                        {/* Stats Cards */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 mb-8">
                            <StatsCard className="md:col-span-2" label="Today's Sales" count={`৳${dailySales}`} icon={<Wallet size={20} />} color="text-white" bg="bg-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/10" />
                            <StatsCard className="md:col-span-2" label="Est. Profit (30%)" count={`৳${dailyProfit.toFixed(0)}`} icon={<TrendingUp size={20} />} color="text-[var(--color-secondary)]" bg="bg-[var(--color-secondary)]/15 shadow-lg shadow-[var(--color-secondary)]/10" />
                            <StatsCard className="md:col-span-1" label="Pending" count={statusCounts.Pending} icon={<Clock size={20} />} color="text-[var(--color-pending)]" bg="bg-[var(--color-pending)]/10" />
                            <StatsCard className="md:col-span-1" label="Completed" count={statusCounts.Done} icon={<CheckCircle size={20} />} color="text-[var(--color-done)]" bg="bg-[var(--color-done)]/10" />
                        </motion.div>

                        {/* Filters */}
                        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6 flex-wrap">
                            <LayoutList size={18} className="text-[var(--color-text-muted)]" />
                            {['all', 'Pending', 'Preparing', 'Done'].map((f) => (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
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

                        {/* Orders */}
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
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Token
                                                    </th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Phone
                                                    </th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Items
                                                    </th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Total
                                                    </th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Time
                                                    </th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="text-right px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((order) => (
                                                    <tr
                                                        key={order.token}
                                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-[var(--color-primary)]">
                                                                {order.token}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">
                                                            {order.phone}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-xs">
                                                                {order.items.map((item) => (
                                                                    <span
                                                                        key={item.id}
                                                                        className="inline-block text-xs bg-white/5 rounded-md px-2 py-1 mr-1 mb-1 text-[var(--color-text-muted)]"
                                                                    >
                                                                        {item.name} ×{item.quantity}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-[var(--color-secondary)]">
                                                            ৳{order.total}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                                                            {order.time}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <motion.span
                                                                layout
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[order.status]?.color}`}
                                                            >
                                                                {statusConfig[order.status]?.icon}
                                                                {order.status}
                                                            </motion.span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-end gap-1">
                                                                {['Pending', 'Preparing', 'Done'].map((status) => (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        key={status}
                                                                        onClick={() =>
                                                                            updateOrderStatus(order.token, status)
                                                                        }
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
                                        <motion.div
                                            variants={itemVariants}
                                            key={order.token}
                                            className="glass-card p-4"
                                        >
                                            {/* Top Row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-lg text-[var(--color-primary)]">
                                                    {order.token}
                                                </span>
                                                <motion.span
                                                    layout
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[order.status]?.color}`}
                                                >
                                                    {statusConfig[order.status]?.icon}
                                                    {order.status}
                                                </motion.span>
                                            </div>

                                            {/* Info */}
                                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                                                    <Phone size={14} />
                                                    {order.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                                                    <Clock size={14} />
                                                    {order.time}
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold">
                                                    <DollarSign size={14} />৳{order.total}
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                                                    <Hash size={14} />
                                                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {order.items.map((item) => (
                                                    <span
                                                        key={item.id}
                                                        className="text-xs bg-white/5 rounded-md px-2 py-1 text-[var(--color-text-muted)]"
                                                    >
                                                        {item.name} ×{item.quantity}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Status Buttons */}
                                            <div className="flex items-center gap-2">
                                                {['Pending', 'Preparing', 'Done'].map((status) => (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
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
                ) : (
                    /* Add Menu Item Tab */
                    <motion.div variants={itemVariants} className="max-w-2xl mx-auto glass-card p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <PlusCircle className="text-[var(--color-secondary)]" size={24} />
                            <h2 className="text-2xl font-bold">Add New Menu Item</h2>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Item Name</label>
                                <input required type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" placeholder="e.g. Spicy Chicken Burger" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Price (৳)</label>
                                    <input required type="number" min="0" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" placeholder="e.g. 250" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Category</label>
                                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50">
                                        {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.emoji} {c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Description</label>
                                <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 h-24 resize-none" placeholder="Short tasty description..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Image URL (Optional)</label>
                                <input type="url" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border-none text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" placeholder="https://..." />
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 mt-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg hover:bg-[var(--color-primary-dark)] transition-colors inline-flex items-center justify-center gap-2">
                                <PlusCircle size={20} /> Add Item to Menu
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

const StatsCard = ({ label, count, icon, color, bg, className = '' }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`glass-card p-4 ${bg} border-none flex flex-col justify-center ${className}`}>
        <div className={`${color} mb-2`}>{icon}</div>
        <p className="text-2xl font-black text-white">{count}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
    </motion.div>
);

export default AdminPage;
