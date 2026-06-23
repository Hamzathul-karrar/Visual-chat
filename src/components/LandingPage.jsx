import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

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
    <div className="lp-particles" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="lp-particle"
          style={{
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

  return (
    <div className="lp-root">
      <ParticlesBackground />

      {/* ── NAVBAR ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-nav-brand">
            <img src="/logo.png" alt="Visual Chat" className="lp-nav-logo" />
            <span className="lp-nav-title">Visual Chat</span>
          </div>
          <div className="lp-nav-links">
            <a href="#demos" className="lp-nav-link">Demos</a>
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how-it-works" className="lp-nav-link">How It Works</a>
            <button
              className="lp-nav-cta"
              onClick={() => navigate('/chat')}
            >
              Try Visual Chat
            </button>
          </div>
          {/* Mobile menu */}
          <button
            className="lp-nav-mobile-cta"
            onClick={() => navigate('/chat')}
          >
            Launch →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="lp-hero"
      >
        <div className="lp-hero-glow" aria-hidden="true" />
        <div className="lp-hero-glow-2" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lp-hero-content"
        >


          <h1 className="lp-hero-title">
            <span className="lp-hero-title-line">Ask any question.</span>
            <span className="lp-hero-title-gradient">Watch it come alive.</span>
          </h1>

          <p className="lp-hero-subtitle">
            Visual Chat transforms complex concepts into live, interactive & animated explanations
            powered by AI. From sorting algorithms to black holes, watch your learning
            spring to life with Framer Motion animations.
          </p>

          <div className="lp-hero-actions">
            <motion.button
              className="lp-btn-primary"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="lp-btn-glow" />
              Try Visual Chat
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
            <motion.a
              className="lp-btn-secondary"
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
      <section id="demos" className="lp-section">
        <Reveal>
          <div className="lp-section-header">
            <span className="lp-section-tag">Demo Showcase</span>
            <h2 className="lp-section-title">See Visual Chat in action</h2>
            <p className="lp-section-subtitle">
              Screen recordings of real interactions. Ask a question, get animated explanations instantly.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="lp-demo-showcase">
            {/* Demo tabs */}
            <div className="lp-demo-tabs">
              {DEMOS.map((d, i) => (
                <button
                  key={d.title}
                  className={`lp-demo-tab ${activeDemo === i ? 'active' : ''}`}
                  onClick={() => setActiveDemo(i)}
                >
                  <span className="lp-demo-tab-tag">{d.tag}</span>
                  <span className="lp-demo-tab-title">{d.title}</span>
                  <span className="lp-demo-tab-desc">{d.desc}</span>
                  {activeDemo === i && (
                    <motion.div
                      className="lp-demo-tab-indicator"
                      layoutId="demoIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Demo display */}
            <div className="lp-demo-display">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lp-demo-frame"
              >
                {/* Top bar dots */}
                <div className="lp-demo-topbar">
                  <div className="lp-demo-dots">
                    <span className="lp-dot lp-dot-red" />
                    <span className="lp-dot lp-dot-yellow" />
                    <span className="lp-dot lp-dot-green" />
                  </div>
                  <span className="lp-demo-url">visual-chat.app</span>
                </div>
                <video
                  src={DEMOS[activeDemo].video}
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => setActiveDemo((p) => (p + 1) % DEMOS.length)}
                  className="lp-demo-media"
                />
              </motion.div>
              <div className="lp-demo-display-glow" aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </section>



      {/* ── FEATURES ── */}
      <section id="features" className="lp-section">
        <Reveal>
          <div className="lp-section-header">
            <span className="lp-section-tag">Features</span>
            <h2 className="lp-section-title">Everything you need for visual learning</h2>
            <p className="lp-section-subtitle">
              Powered by multiple AI providers, real-time animation generation, and a beautifully crafted dark interface.
            </p>
          </div>
        </Reveal>

        <div className="lp-features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <motion.div
                className="lp-feature-card"
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div
                  className="lp-feature-icon"
                  style={{ background: f.gradient }}
                >
                  <span>{f.icon}</span>
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
                <div className="lp-feature-shine" aria-hidden="true" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>



      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="lp-section">
        <Reveal>
          <div className="lp-section-header">
            <span className="lp-section-tag">How It Works</span>
            <h2 className="lp-section-title">From question to animation in seconds</h2>
            <p className="lp-section-subtitle">
              A seamless pipeline that transforms your curiosity into visual knowledge.
            </p>
          </div>
        </Reveal>

        <div className="lp-steps">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.12}>
              <div className="lp-step">
                <div className="lp-step-number">{step.num}</div>
                <div className="lp-step-line" aria-hidden="true" />
                <div className="lp-step-icon">{step.icon}</div>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-desc">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" aria-hidden="true" />
        <Reveal>
          <h2 className="lp-cta-title">Ready to learn visually?</h2>
          <p className="lp-cta-subtitle">
            Start asking questions and watch concepts come alive with AI-powered animations.
          </p>
          <motion.button
            className="lp-btn-primary lp-btn-lg"
            onClick={() => navigate('/chat')}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="lp-btn-glow" />
            Get Started — It's Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-links">
            <a href="https://github.com/Hamzathul-karrar/Visual-chat" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://github.com/Hamzathul-karrar" target="_blank" rel="noopener noreferrer">
              About
            </a>
          </div>
          <p className="lp-footer-copy">
            Built by{' '}
            <a href="https://github.com/Hamzathul-karrar" target="_blank" rel="noopener noreferrer">
              Hamzathul Karrar
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
