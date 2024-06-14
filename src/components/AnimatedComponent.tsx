import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedComponentProps {
  x?: number;
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
}

const AnimatedComponent: React.FC<React.PropsWithChildren<AnimatedComponentProps>> = ({ children, x = 0, y = 0, opacity = 1, duration = 0.5, delay = 0 }) => {
  return (
    <motion.div initial={{ x, y, opacity }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ duration, delay, ease: "linear" }}>
      {children}
    </motion.div>
  );
};

export default AnimatedComponent;
