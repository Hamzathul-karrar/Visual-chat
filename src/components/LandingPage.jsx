import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating particles background ─── */
function ParticlesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(138, 180, 248, 0.6), rgba(192, 132, 252, 0.3))',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${12 + Math.random() * 10}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            opacity: 0.15 + Math.random() * 0.25,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Feature data ─── */
const FEATURES = [
  {
    icon: '🎬',
    title: 'Live Animated Explanations',
    desc: 'AI generates self-contained React + Framer Motion animations for every concept in real time.',
    gradient: 'linear-gradient(135deg, #8ab4f8 0%, #c084fc 100%)',
  },
  {
    icon: '💬',
    title: 'Dual AI Response',
    desc: 'Each query returns both a markdown text explanation and an interactive animation, fetched in parallel.',
    gradient: 'linear-gradient(135deg, #81c995 0%, #8ab4f8 100%)',
  },
  {
    icon: '🔑',
    title: 'Multi-Provider APIs',
    desc: 'Works seamlessly with Gemini, Groq, and OpenRouter — configure separate providers for text & animation.',
    gradient: 'linear-gradient(135deg, #f8c85b 0%, #f28b82 100%)',
  },
  {
    icon: '📂',
    title: 'Persistent Chat History',
    desc: 'Sessions saved to localStorage with smart date grouping — Today, Yesterday, Previous 7 Days, Older.',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #a5b4fc 100%)',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Optimized for desktop and mobile with collapsible sidebar and adaptive animation scaling.',
    gradient: 'linear-gradient(135deg, #8ab4f8 0%, #81c995 100%)',
  },
  {
    icon: '🛡️',
    title: 'Error Boundaries',
    desc: 'Graceful fallback UI when AI-generated animations fail — the app never breaks.',
    gradient: 'linear-gradient(135deg, #f28b82 0%, #f8c85b 100%)',
  },
];

/* ─── How It Works steps ─── */
const STEPS = [
  {
    num: '01',
    title: 'Ask Anything',
    desc: 'Type a question about any concept — sorting algorithms, black holes, neural networks, TCP/IP...',
    icon: '💡',
  },
  {
    num: '02',
    title: 'Parallel AI Processing',
    desc: 'Two AI providers fire simultaneously — one for text, one for animation code generation.',
    icon: '⚡',
  },
  {
    num: '03',
    title: 'Live Animation Render',
    desc: 'JSX code is transpiled via Babel, evaluated safely, and rendered as a live Framer Motion component.',
    icon: '🎨',
  },
  {
    num: '04',
    title: 'Learn Visually',
    desc: 'Read the explanation and watch the animation — both appear in the same chat message instantly.',
    icon: '🚀',
  },
];

/* ─── Demo videos / images  ─── */
const DEMOS = [
  {
    title: 'Bubble Sort Visualization',
    desc: 'Watch sorting algorithms come alive with step-by-step animated bars',
    video: '/demos/animated_bubblesort_vid.mp4',
    tag: 'Algorithms',
  },
  {
    title: 'Black Hole Formation',
    desc: 'Explore cosmic phenomena with AI-generated visual explanations',
    video: '/demos/animated_blackhole_vid.mp4',
    tag: 'Astrophysics',
  },
  {
    title: 'Nuclear Physics',
    desc: 'Visualize complex atomic reactions',
    video: '/demos/animated_nuclear_vid.mp4',
    tag: 'Physics',
  },
];

/* ════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);

  const [activeDemo, setActiveDemo] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e3e3e3] overflow-x-hidden overflow-y-auto relative font-sans">
      <ParticlesBackground />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0f]/70 backdrop-blur-[20px] saturate-150 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16 relative">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Visual Chat" className="w-8 h-8 object-contain" />
            <span className="text-base font-medium tracking-normal text-[#e3e3e3]">Visual Chat</span>
          </div>
          <div className="hidden md:flex items-center gap-7">
            <a href="#demos" className="text-sm text-vc-muted hover:text-[#e3e3e3] font-medium transition-colors no-underline">Demos</a>
            <a href="#features" className="text-sm text-vc-muted hover:text-[#e3e3e3] font-medium transition-colors no-underline">Features</a>
            <a href="#how-it-works" className="text-sm text-vc-muted hover:text-[#e3e3e3] font-medium transition-colors no-underline">How It Works</a>
            <button
              className="bg-gradient-to-br from-vc-blue to-vc-purple text-[#0a0a0f] border-none px-5 py-2 rounded-full text-sm font-medium leading-[1.71] cursor-pointer transition-all hover:shadow-[0_4px_20px_rgba(138,180,248,0.35)]"
              onClick={() => navigate('/chat')}
            >
              Try Visual Chat
            </button>
          </div>
          {/* Mobile menu toggle & CTA */}
          <div className="flex md:hidden items-center gap-3">
            <button
              className="bg-gradient-to-br from-vc-blue to-vc-purple text-[#0a0a0f] border-none px-4 py-1.5 rounded-full text-sm font-medium leading-[1.71] cursor-pointer"
              onClick={() => navigate('/chat')}
            >
              Launch →
            </button>
            <button
              className="text-[#e3e3e3] p-1 bg-transparent border-none cursor-pointer flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#131314] border-b border-white/5 py-4 px-4 sm:px-6 flex flex-col gap-4 shadow-xl"
          >
            <a href="#demos" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-vc-primary hover:text-vc-bright font-medium transition-colors no-underline">Demos</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-vc-primary hover:text-vc-bright font-medium transition-colors no-underline">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-vc-primary hover:text-vc-bright font-medium transition-colors no-underline">How It Works</a>
            <div className="h-[1px] w-full bg-white/5 my-1" />
            <a href="https://github.com/Hamzathul-karrar/Visual-chat" target="_blank" rel="noopener noreferrer" className="text-base text-vc-muted hover:text-vc-primary font-medium transition-colors no-underline flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </motion.div>
        )}
      </nav>

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex flex-col items-center justify-center pt-[100px] px-4 sm:px-6 pb-12 md:pb-[60px] relative z-10 text-center"
      >
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(138,180,248,0.12)_0%,rgba(192,132,252,0.06)_40%,transparent_70%)] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(192,132,252,0.08),transparent_70%)] pointer-events-none" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-[800px] relative z-20"
        >

          <h1 className="font-[Space_Grotesk,Inter,ui-sans-serif,system-ui] text-[clamp(40px,8vw,96px)] font-normal leading-[1.1] md:leading-none m-0 mb-4 md:mb-6 tracking-[-1px] md:tracking-[-1.92px]">
            <span className="block text-vc-bright">Ask any question.</span>
            <span className="block bg-gradient-to-r from-vc-blue via-vc-purple to-vc-red bg-clip-text text-transparent">Watch it come alive.</span>
          </h1>

          <p className="text-base md:text-lg text-vc-muted leading-relaxed max-w-[580px] mx-auto mb-8 md:mb-10">
            Visual Chat transforms complex concepts into live, interactive & animated explanations
            powered by AI. From sorting algorithms to black holes, watch your learning
            spring to life with Framer Motion animations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center w-full sm:w-auto px-4 sm:px-0">
            <motion.button
              className="relative inline-flex items-center justify-center gap-2 bg-gradient-to-br from-vc-blue to-vc-purple text-[#0a0a0f] border-none px-7 py-3.5 rounded-full text-sm font-medium leading-[1.71] cursor-pointer overflow-hidden transition-shadow hover:shadow-[0_6px_30px_rgba(138,180,248,0.4)] group w-full sm:w-auto"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              Try Visual Chat
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
            <motion.a
              className="inline-flex items-center justify-center gap-2 bg-white/5 text-[#e3e3e3] border border-white/10 px-7 py-3.5 rounded-full text-sm font-medium leading-[1.71] cursor-pointer no-underline transition-colors hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
              href="https://github.com/Hamzathul-karrar/Visual-chat"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </motion.a>
          </div>
        </motion.div>
      </motion.section>

      {/* ── DEMOS ── */}
      <section id="demos" className="max-w-[1200px] mx-auto py-16 md:py-[100px] px-4 sm:px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-10 md:mb-[60px]">
            <span className="inline-block font-sans text-sm font-normal uppercase tracking-[0.28px] text-vc-blue bg-vc-blue/10 px-3.5 py-1.5 rounded-2xl mb-4">Demo Showcase</span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-normal leading-[1.2] m-0 mb-3.5 tracking-[-0.48px] text-vc-bright">See Visual Chat in action</h2>
            <p className="text-base font-normal text-vc-muted max-w-[520px] mx-auto leading-relaxed">
              Screen recordings of real interactions. Ask a question, get animated explanations instantly.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 max-w-[1000px] mx-auto">
            {/* Demo tabs */}
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {DEMOS.map((d, i) => (
                <button
                  key={d.title}
                  className={`relative flex-shrink-0 w-[85vw] sm:w-[280px] lg:w-auto snap-center border rounded-[14px] px-5 py-4 lg:py-[18px] text-left cursor-pointer transition-all overflow-hidden text-inherit font-inherit ${activeDemo === i ? 'bg-vc-blue/10 border-vc-blue/20' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                  onClick={() => setActiveDemo(i)}
                >
                  <span className="inline-block font-sans text-xs lg:text-sm font-normal uppercase tracking-[0.28px] text-vc-blue mb-1.5">{d.tag}</span>
                  <span className="block text-xl lg:text-2xl font-normal leading-[1.3] mb-1 text-vc-bright">{d.title}</span>
                  <span className="block text-sm lg:text-base font-normal text-vc-muted leading-relaxed line-clamp-2 lg:line-clamp-none">{d.desc}</span>
                  {activeDemo === i && (
                    <motion.div
                      className="absolute lg:left-0 lg:top-0 lg:bottom-0 lg:w-[3px] lg:h-full left-0 bottom-0 right-0 h-[3px] w-full bg-gradient-to-r lg:bg-gradient-to-b from-vc-blue to-vc-purple lg:rounded-r-[3px] rounded-t-[3px] lg:rounded-t-none"
                      layoutId="demoIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Demo display */}
            <div className="relative">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#131314] rounded-[14px] overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
              >
                {/* Top bar dots */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-vc-red" />
                    <span className="w-2.5 h-2.5 rounded-full bg-vc-yellow" />
                    <span className="w-2.5 h-2.5 rounded-full bg-vc-green" />
                  </div>
                  <span className="text-sm text-vc-faint font-sans">visual-chat.app</span>
                </div>
                <video
                  src={DEMOS[activeDemo].video}
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => setActiveDemo((p) => (p + 1) % DEMOS.length)}
                  className="w-full block"
                />
              </motion.div>
              <div className="absolute inset-[-20px] rounded-3xl bg-[radial-gradient(ellipse,rgba(138,180,248,0.06),transparent_70%)] pointer-events-none -z-10" aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-[1200px] mx-auto py-16 md:py-[100px] px-4 sm:px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-10 md:mb-[60px]">
            <span className="inline-block font-sans text-sm font-normal uppercase tracking-[0.28px] text-vc-blue bg-vc-blue/10 px-3.5 py-1.5 rounded-2xl mb-4">Features</span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-normal leading-[1.2] m-0 mb-3.5 tracking-[-0.48px] text-vc-bright">Everything you need for visual learning</h2>
            <p className="text-base font-normal text-vc-muted max-w-[520px] mx-auto leading-relaxed">
              Powered by multiple AI providers, real-time animation generation, and a beautifully crafted dark interface.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[18px] max-w-[1000px] mx-auto">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <motion.div
                className="relative bg-white/5 border border-white/5 rounded-[16px] md:rounded-[18px] p-5 md:px-6 md:py-7 overflow-hidden transition-colors hover:border-vc-blue/20 group"
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div
                  className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-lg md:text-xl mb-3 md:mb-[18px]"
                  style={{ background: f.gradient }}
                >
                  <span>{f.icon}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-normal leading-[1.3] m-0 mb-2 text-vc-bright">{f.title}</h3>
                <p className="text-sm md:text-base font-normal text-vc-muted leading-relaxed m-0">{f.desc}</p>
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" aria-hidden="true" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-[1200px] mx-auto py-16 md:py-[100px] px-4 sm:px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-10 md:mb-[60px]">
            <span className="inline-block font-sans text-sm font-normal uppercase tracking-[0.28px] text-vc-blue bg-vc-blue/10 px-3.5 py-1.5 rounded-2xl mb-4">How It Works</span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-normal leading-[1.2] m-0 mb-3.5 tracking-[-0.48px] text-vc-bright">From question to animation in seconds</h2>
            <p className="text-base font-normal text-vc-muted max-w-[520px] mx-auto leading-relaxed">
              A seamless pipeline that transforms your curiosity into visual knowledge.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1000px] mx-auto mb-10 md:mb-[60px]">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.12}>
              <div className="text-center relative">
                <div className="font-sans text-xs md:text-sm font-normal text-vc-blue tracking-[0.28px] mb-2 md:mb-3">{step.num}</div>
                {/* Line connector */}
                {i !== STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[50%] w-full h-[1px] bg-white/10" aria-hidden="true" />
                )}
                <div className="text-[28px] md:text-[32px] mb-2 md:mb-3.5 relative z-10 inline-block bg-[#0a0a0f] px-4">{step.icon}</div>
                <h3 className="text-xl md:text-2xl font-normal leading-[1.3] m-0 mb-2 text-vc-bright">{step.title}</h3>
                <p className="text-sm md:text-base font-normal text-vc-muted leading-relaxed m-0">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center pt-16 md:pt-[100px] px-4 sm:px-6 pb-20 md:pb-[120px] relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(138,180,248,0.08)_0%,rgba(192,132,252,0.04)_40%,transparent_70%)] pointer-events-none -z-10" aria-hidden="true" />
        <Reveal>
          <h2 className="text-[clamp(32px,6vw,56px)] font-normal leading-[1.2] md:leading-[1.1] m-0 mb-4 tracking-[-1px] md:tracking-[-1.12px] text-vc-bright">Ready to learn visually?</h2>
          <p className="text-base md:text-lg font-normal text-vc-muted max-w-[600px] mx-auto leading-relaxed mb-8 md:mb-10">
            Start asking questions and watch concepts come alive with AI-powered animations.
          </p>
          <motion.button
            className="relative inline-flex items-center gap-2 bg-gradient-to-br from-vc-blue to-vc-purple text-[#0a0a0f] border-none px-9 py-4 rounded-full text-base font-medium leading-[1.71] cursor-pointer overflow-hidden transition-shadow hover:shadow-[0_6px_30px_rgba(138,180,248,0.4)] group"
            onClick={() => navigate('/chat')}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            Get Started — It's Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#0a0a0f] py-8 z-10 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="https://github.com/Hamzathul-karrar/Visual-chat" target="_blank" rel="noopener noreferrer" className="text-sm text-vc-muted hover:text-[#e3e3e3] transition-colors no-underline font-medium">
              GitHub
            </a>
            <a href="https://github.com/Hamzathul-karrar" target="_blank" rel="noopener noreferrer" className="text-sm text-vc-muted hover:text-[#e3e3e3] transition-colors no-underline font-medium">
              About
            </a>
          </div>
          <p className="text-sm text-vc-faint m-0">
            Built by{' '}
            <a href="https://github.com/Hamzathul-karrar" target="_blank" rel="noopener noreferrer" className="text-vc-muted hover:text-[#e3e3e3] transition-colors no-underline">
              Hamzathul Karrar
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
