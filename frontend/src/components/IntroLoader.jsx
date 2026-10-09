import { motion } from 'framer-motion';
import './IntroLoader.css';

const BAR_HEIGHTS = [28, 52, 80, 110, 80, 52, 28];

export default function IntroLoader() {
  return (
    <motion.div
      className="intro"
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      <div className="intro-bars">
        {BAR_HEIGHTS.map((h, i) => (
          <motion.span
            key={i}
            className="intro-bar"
            style={{ height: h }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <motion.h1
        className="intro-wordmark display"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.6, ease: 'easeOut' }}
      >
        Cymor Tune
      </motion.h1>
      <motion.p
        className="intro-tagline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        by Legendary Smiley Cymor
      </motion.p>
    </motion.div>
  );
}
