import { motion } from 'framer-motion';

const SUGGESTED_PROMPTS = [
  {
    icon: '📊',
    title: 'Bubble Sort',
    prompt: 'Explain bubble sort',
  },
  {
    icon: '🔐',
    title: 'JWT Authentication',
    prompt: 'How does JWT auth work?',
  },
  {
    icon: '🌳',
    title: 'Binary Search Tree',
    prompt: 'What is a binary search tree?',
  },
  {
    icon: '⚡',
    title: 'JS Promises',
    prompt: 'Explain how promises work in JS',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
        padding: '40px 20px',
        gap: 32,
      }}
    >
      {/* Logo / Icon */}
      <motion.div
        variants={itemVariants}
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 0 40px rgba(129, 140, 248, 0.3)',
        }}
      >
        ✦
      </motion.div>

      {/* Title */}
      <motion.div
        variants={itemVariants}
        style={{ textAlign: 'center' }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 700,
            margin: 0,
            marginBottom: 12,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #818cf8 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
          }}
        >
          Visual Chat
        </h1>
        <p
          style={{
            fontSize: 16,
            color: '#64748b',
            margin: 0,
            maxWidth: 440,
            lineHeight: 1.6,
          }}
        >
          Ask any technical question and get a visual explanation
          with live animated illustrations
        </p>
      </motion.div>

      {/* Suggested prompts */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          width: '100%',
          maxWidth: 520,
        }}
      >
        {SUGGESTED_PROMPTS.map((item) => (
          <motion.button
            key={item.title}
            onClick={() => onPromptClick(item.prompt)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 14,
              padding: '18px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(129, 140, 248, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
            <div>
              <div
                style={{
                  color: '#e2e8f0',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  color: '#64748b',
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                {item.prompt}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Hint */}
      <motion.p
        variants={itemVariants}
        style={{
          color: '#475569',
          fontSize: 13,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          borderRadius: 6,
          background: 'rgba(255, 255, 255, 0.06)',
          fontSize: 10,
          color: '#64748b',
        }}>↵</span>
        Press Enter to send
      </motion.p>
    </motion.div>
  );
}
