import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123';

const AdminLoginPage = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [shaking, setShaking] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('admin_logged_in', 'true');
            navigate('/admin');
        } else {
            setError('Incorrect password. Please try again.');
            setShaking(true);
            setTimeout(() => setShaking(false), 600);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth: '400px' }}
            >
                {/* Card */}
                <motion.div
                    animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-2xl p-8 border border-[var(--color-glass-border)]"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(var(--color-primary-rgb, 255,90,31),0.4)',
                            }}
                        >
                            <ShieldCheck size={30} color="white" />
                        </div>
                    </div>

                    <h1
                        className="text-center font-bold mb-1 gradient-text"
                        style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}
                    >
                        Admin Access
                    </h1>
                    <p
                        className="text-center mb-8"
                        style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}
                    >
                        Enter the admin password to continue
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Password Field */}
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-dim)',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Lock size={16} />
                            </div>
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="Password"
                                autoComplete="current-password"
                                style={{
                                    width: '100%',
                                    padding: '12px 44px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: error
                                        ? '1.5px solid #ff4d4d'
                                        : '1.5px solid var(--color-glass-border)',
                                    borderRadius: '10px',
                                    color: 'var(--color-text)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    if (!error) e.target.style.borderColor = 'var(--color-primary)';
                                }}
                                onBlur={(e) => {
                                    if (!error) e.target.style.borderColor = 'var(--color-glass-border)';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-dim)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 0,
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    color: '#ff4d4d',
                                    fontSize: '0.8rem',
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                }}
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                letterSpacing: '0.5px',
                                transition: 'box-shadow 0.2s',
                                boxShadow: '0 4px 15px rgba(255,90,31,0.3)',
                            }}
                        >
                            Access Dashboard
                        </motion.button>
                    </form>
                </motion.div>

                <p
                    className="text-center mt-4"
                    style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}
                >
                    This area is restricted to authorized personnel only.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
