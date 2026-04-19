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
    const { orders, updateOrderStatus } = useCart();
    const [filter, setFilter] = useState('all');

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
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={28} className="text-[var(--color-primary)]" />
                        <h1 className="text-3xl sm:text-4xl font-black">
                            Admin <span className="gradient-text">Panel</span>
                        </h1>
                    </div>
                    <p className="text-[var(--color-text-muted)]">
                        Manage orders and track their status in real-time
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <StatsCard
                        label="Total Orders"
                        count={statusCounts.all}
                        icon={<Package size={20} />}
                        color="text-white"
                        bg="bg-white/5"
                    />
                    <StatsCard
                        label="Pending"
                        count={statusCounts.Pending}
                        icon={<Clock size={20} />}
                        color="text-[var(--color-pending)]"
                        bg="bg-[var(--color-pending)]/10"
                    />
                    <StatsCard
                        label="Preparing"
                        count={statusCounts.Preparing}
                        icon={<ChefHat size={20} />}
                        color="text-[var(--color-preparing)]"
                        bg="bg-[var(--color-preparing)]/10"
                    />
                    <StatsCard
                        label="Completed"
                        count={statusCounts.Done}
                        icon={<CheckCircle size={20} />}
                        color="text-[var(--color-done)]"
                        bg="bg-[var(--color-done)]/10"
                    />
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
                        <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-[var(--color-text-muted)]">
                            Orders will appear here when customers place them
                        </p>
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
            </motion.div>
        </div>
    );
};

const StatsCard = ({ label, count, icon, color, bg }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`glass-card p-4 ${bg} border-none`}>
        <div className={`${color} mb-2`}>{icon}</div>
        <p className="text-2xl font-black text-white">{count}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
    </motion.div>
);

export default AdminPage;
