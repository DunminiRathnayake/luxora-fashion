import { motion } from "framer-motion";

const SuspenseLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-neutral-100 z-[9999] overflow-hidden">
      <motion.div
        className="h-full bg-black"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default SuspenseLoader;
