import { motion } from 'framer-motion';
import { Pizza } from 'lucide-react';

const Loader = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-darker)]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                    <Pizza size={64} className="text-[var(--color-primary)]" />
                </motion.div>
                <motion.h2
                    className="text-2xl font-black font-[var(--font-display)] gradient-text"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                    Pizzaburg
                </motion.h2>
            </div>
        </motion.div>
    );
};

export default Loader;
