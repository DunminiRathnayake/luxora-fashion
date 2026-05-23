import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom premium ease-out cubic
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.5,
      ease: [0.7, 0, 0.84, 0], // Custom premium ease-in cubic
    },
  },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
