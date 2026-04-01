import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CountdownProps {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className='w-full flex justify-center'>
          <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3
                 rounded-md border border-blue-200/60 dark:border-blue-800/50
                 bg-blue-50/50 dark:bg-blue-900/10
                 px-3 py-2 text-sm"
    >
      <Clock className="w-4 h-4 text-blue-600/80 dark:text-blue-400/80" />

      <span className="text-xs font-medium text-blue-800/80 dark:text-blue-300/80">
        Fermeture dans
      </span>

      <div className="flex items-center gap-1 font-mono">
        <MiniUnit value={timeLeft.days} /><small>J</small>
        <Colon />
        <MiniUnit value={timeLeft.hours} /><small>H</small>
        <Colon />
        <MiniUnit value={timeLeft.minutes} /><small>M</small>
        <Colon />
        <MiniUnit value={timeLeft.seconds} /><small>S</small>
      </div>
    </motion.div>
    </div>

  );
}

/* ======================= */

function MiniUnit({ value }: { value: number }) {
  const formatted = value.toString().padStart(2, '0');

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={formatted}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 4, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="min-w-[18px] text-center text-xs font-semibold text-blue-900/80 dark:text-blue-200/80 tabular-nums"
      >
        {formatted}
      </motion.span>
    </AnimatePresence>
  );
}

function Colon() {
  return (
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-xs font-semibold text-blue-700/70 dark:text-blue-400/70"
    >
      :
    </motion.span>
  );
}
