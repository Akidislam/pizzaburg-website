import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98, filter: 'blur(5px)' },
    in: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    out: { opacity: 0, y: -15, scale: 0.98, filter: 'blur(5px)' },
};

const pageTransition = {
    type: 'spring',
    stiffness: 260,
    damping: 20,
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="page-transition-wrapper min-h-screen"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
