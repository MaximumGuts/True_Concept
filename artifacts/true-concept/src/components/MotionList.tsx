import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.8 },
  },
};

interface BaseProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function MotionList({ children, className, style }: BaseProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, className, style }: BaseProps) {
  return (
    <motion.div variants={itemVariants} className={className} style={style}>
      {children}
    </motion.div>
  );
}

interface FadeInProps extends BaseProps {
  delay?: number;
}

export function FadeIn({ children, delay = 0, className, style }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
