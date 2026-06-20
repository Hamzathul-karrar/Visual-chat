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
  }
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
      className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 pt-8 sm:pt-12 pb-8 gap-0 max-w-welcome mx-auto w-full"
    >
      {/* Logo */}
      <motion.div variants={itemVariants} className="mb-6">
        <VisualChatLogo size={72} />
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="text-[clamp(26px,4vw,38px)] font-medium m-0 mb-[14px] text-center leading-[1.2] tracking-[-0.02em]"
        style={{
          background: 'linear-gradient(90deg, #e3e3e3 0%, #8ab4f8 50%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Visual Chat
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-[15px] text-vc-muted m-[0_0_60px] max-w-welcomeSub leading-[1.7] text-center"
      >
        Ask any technical question and get a visual explanation
        with live animated illustrations
      </motion.p>

      {/* Prompt cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] w-full max-w-prompts px-2 sm:px-0"
      >
        {SUGGESTED_PROMPTS.map((item) => (
          <motion.button
            key={item.title}
            onClick={() => onPromptClick(item.prompt)}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            className="bg-vc-surface border border-vc-line rounded-2xl px-[18px] py-4 cursor-pointer text-left transition-colors duration-200 flex flex-col gap-[6px] min-h-[90px] mb-20 hover:bg-vc-hover hover:border-vc-lineHover"
          >
            <span className="text-[20px]">{item.icon}</span>
            <div className="text-vc-primary text-[13px] font-medium leading-[1.4]">
              {item.title}
            </div>
            <div className="text-vc-muted text-[11.5px] leading-[1.4]">
              {item.desc}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
