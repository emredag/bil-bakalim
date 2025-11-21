import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // in milliseconds
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedNumber({
  value,
  duration = 2000,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(value);
      return;
    }

    const steps = 60; // 60 fps
    const increment = value / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <motion.span
      className={`tabular-nums ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {count.toLocaleString('tr-TR')}
      {suffix}
    </motion.span>
  );
}
