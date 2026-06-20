import { motion } from 'framer-motion';
import VisualChatLogo from './VisualChatLogo';

const SUGGESTED_PROMPTS = [
  {
    icon: '📊',
    title: 'Bubble Sort',
    prompt: 'Explain bubble sort',
    desc: 'Visualize step-by-step sorting',
  },
  {
    icon: '🌌',
    title: 'Black Hole Formation',
    prompt: 'Explain blackhole formation?',
    desc: 'How stars collapse into singularities',
  },
  {
    icon: '⚡',
    title: 'Neural Networks',
    prompt: 'Explain how neural networks learn',
    desc: 'Weights, layers, and backpropagation',
  },
  {
    icon: '🔗',
    title: 'Binary Search',
    prompt: 'Explain binary search algorithm',
    desc: 'Efficient lookup in sorted arrays',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function WelcomeScreen({ onPromptClick }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '48px 24px 32px',
        gap: 0,
        maxWidth: 768,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Logo */}
      <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
        <VisualChatLogo size={72} />
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={itemVariants}
        style={{
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 500,
          margin: 0,
          marginBottom: 14,
          background: 'linear-gradient(90deg, #e3e3e3 0%, #8ab4f8 50%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        Visual Chat
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        style={{
          fontSize: 15,
          color: '#9aa0a6',
          margin: '0 0 40px',
          maxWidth: 480,
          lineHeight: 1.7,
          textAlign: 'center',
        }}
      >
        Ask any technical question and get a visual explanation
        with live animated illustrations
      </motion.p>

      {/* Prompt cards — Gemini-style 2×2 grid */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          width: '100%',
          maxWidth: 600,
        }}
      >
        {SUGGESTED_PROMPTS.map((item) => (
          <motion.button
            key={item.title}
            onClick={() => onPromptClick(item.prompt)}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            style={{
              background: '#1e1f20',
              border: '1px solid #2d2e30',
              borderRadius: 16,
              padding: '16px 18px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s ease, border-color 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minHeight: 90,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#28292a';
              e.currentTarget.style.borderColor = '#3d3e40';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1e1f20';
              e.currentTarget.style.borderColor = '#2d2e30';
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div
              style={{
                color: '#e3e3e3',
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                color: '#9aa0a6',
                fontSize: 11.5,
                lineHeight: 1.4,
              }}
            >
              {item.desc}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
