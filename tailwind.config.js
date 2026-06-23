/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Gemini-inspired dark palette — prefixed to avoid Tailwind conflicts
        vc: {
          bg:           '#131314',   // main background
          sidebar:      '#1a1a1b',   // sidebar background
          surface:      '#1e1f20',   // card / input surface
          hover:        '#28292a',   // hover surface
          line:         '#2d2e30',   // borders / dividers
          lineHover:    '#3d3e40',   // border hover
          primary:      '#e3e3e3',   // primary text
          secondary:    '#bdc1c6',   // secondary text
          muted:        '#9aa0a6',   // muted text / placeholders
          faint:        '#5f6368',   // faint text / timestamps
          heading:      '#e8eaed',   // headings
          bright:       '#f8f9fa',   // strong / bold text
          blue:         '#8ab4f8',   // accent blue
          blueLt:       '#aecbfa',   // light accent blue
          purple:       '#c084fc',   // accent purple
          indigo:       '#a5b4fc',   // indigo accent
          green:        '#81c995',   // status green
          yellow:       '#f8c85b',   // status yellow
          red:          '#f28b82',   // error text
          redLt:        '#fca5a5',   // light error text
          bubble:       '#2d2e30',   // user message bubble
        },
      },
      fontFamily: {
        sans: ["'Google Sans'", 'Inter', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
        mono: ["'Google Sans Mono'", "'JetBrains Mono'", 'monospace'],
      },
      borderRadius: {
        pill:    '28px',
        bubble:  '20px',
      },
      maxWidth: {
        'chat':        '1000px',
        'chat-input':  '750px',
        'welcome':     '768px',
        'prompts':     '600px',
        'welcomeSub':  '480px',
        'anim':        '700px',
      },
      boxShadow: {
        'glow-green':  '0 0 6px rgba(129,201,149,0.5)',
        'glow-yellow': '0 0 6px rgba(248,200,91,0.5)',
        'glow-red':    '0 0 6px rgba(242,139,130,0.5)',
        'focus-ring':  '0 0 0 1px rgba(138, 180, 248, 0.15)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.15' },
          '25%': { transform: 'translateY(-40px) translateX(20px) scale(1.2)', opacity: '0.35' },
          '50%': { transform: 'translateY(-20px) translateX(-15px) scale(0.9)', opacity: '0.2' },
          '75%': { transform: 'translateY(-50px) translateX(10px) scale(1.1)', opacity: '0.3' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float linear infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
