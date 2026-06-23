
# Visual Chat

**AI-Powered Visual Learning — Ask any question, get animated explanations**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40-FF0066?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Visual Chat is an AI-powered chatbot that goes beyond text — it generates **live, animated visualizations** for technical concepts in real time. Ask about sorting algorithms, network protocols, data structures, or any concept, and watch it come alive with smooth Framer Motion animations.

</div>

---

## ✨ Features

- **🎬 Live Animated Explanations** — AI generates self-contained React + Framer Motion animations for every concept
- **💬 Dual AI Response** — Each query returns both a text explanation and an interactive animation, fetched in parallel
- **🔑 Multi-Provider API Support** — Works with **Gemini**, **Groq**, and **OpenRouter** APIs
- **⚙️ Independent Provider Config** — Configure separate providers and models for text and animation tasks
- **📂 Chat History** — Persistent session management stored in localStorage with date grouping (Today, Yesterday, Previous 7 Days, Older)
- **📱 Fully Responsive** — Optimized for desktop and mobile with collapsible sidebar and adaptive scaling
- **🌙 Dark Mode UI** — Gemini-inspired dark theme with Google Sans typography
- **⚡ Real-Time Status** — Live status indicator showing API readiness, loading state, or missing keys
- **🔄 Animation Regeneration** — Retry animation generation without resending the text query
- **🛡️ Error Boundaries** — Graceful fallback UI when AI-generated animations fail to render
- **🎯 Suggested Prompts** — Welcome screen with curated starter prompts for quick exploration

---

## 🎥 Demos

Here are a few examples of what Visual Chat can explain and generate in real time:

**Bubble Sort Visualization**  
<video src="https://github.com/Hamzathul-karrar/Visual-chat/raw/main/public/demos/animated_bubblesort_vid.mp4" controls="controls" width="100%"></video>

**Black Hole Formation**  
<video src="https://github.com/Hamzathul-karrar/Visual-chat/raw/main/public/demos/animated_blackhole_vid.mp4" controls="controls" width="100%"></video>

**Nuclear Physics**  
<video src="https://github.com/Hamzathul-karrar/Visual-chat/raw/main/public/demos/animated_nuclear_vid.mp4" controls="controls" width="100%"></video>

---

## 🖼️ How It Works

```
User Question
     │
     ├──────────────────┐
     ▼                  ▼
 Text Provider      Animation Provider
 (e.g. Groq)        (e.g. Gemini)
     │                  │
     ▼                  ▼
 Markdown Text      JSX Animation Code
     │                  │
     │                  ├─ Clean LLM output
     │                  ├─ Babel JSX → JS transform
     │                  ├─ new Function() evaluation
     │                  └─ ResizeObserver scaling
     │                  │
     ▼                  ▼
┌──────────────────────────┐
│     Chat Message UI      │
│  ┌─────────────────────┐ │
│  │   Markdown Text     │ │
│  ├─────────────────────┤ │
│  │   Live Animation    │ │
│  │   (Framer Motion)   │ │
│  └─────────────────────┘ │
└──────────────────────────┘
```

1. The user sends a question
2. Two parallel API calls fire — one for a **text explanation**, one for **animation code**
3. Text is rendered as Markdown; animation code is cleaned, transpiled via Babel, and rendered as a live React component
4. Both appear independently as soon as they resolve (whichever finishes first shows up first)

---

## 🛠️ Tech Stack

| Layer              | Technology                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| **Framework**      | [React 19](https://react.dev) with functional components & hooks           |
| **Build Tool**     | [Vite 8](https://vite.dev) for fast dev/build                              |
| **Animations**     | [Framer Motion 12](https://www.framer.com/motion/) for all UI & generated animations |
| **Styling**        | [Tailwind CSS 3](https://tailwindcss.com) with custom Gemini-inspired theme |
| **Markdown**       | [react-markdown](https://github.com/remarkjs/react-markdown) for text rendering |
| **JSX Transform**  | [@babel/standalone](https://babeljs.io/docs/babel-standalone) for in-browser JSX compilation |
| **Error Handling** | [react-error-boundary](https://github.com/bvaughn/react-error-boundary)   |
| **AI Providers**   | Google Gemini API, Groq API, OpenRouter API                                |

---

## 📁 Project Structure

```
Visual-chat/
├── public/
│   ├── favicon.svg          # Browser favicon
│   ├── icons.svg            # SVG icon sprite
│   └── logo.png             # App logo
│
├── src/
│   ├── api/
│   │   └── gemini.js         # Multi-provider API layer (Gemini, Groq, OpenRouter)
│   │
│   ├── assets/
│   │   └── logo.png          # Logo used in components
│   │
│   ├── components/
│   │   ├── AnimationErrorBoundary.jsx  # Error boundary for failed animations
│   │   ├── AnimationRenderer.jsx       # LLM code → live React component pipeline
│   │   ├── ApiKeyModal.jsx             # Settings modal for API configuration
│   │   ├── ChatContainer.jsx           # Main layout orchestrator
│   │   ├── ChatInput.jsx               # Auto-resizing textarea with send button
│   │   ├── ChatMessage.jsx             # Message bubble with markdown + animation
│   │   ├── Sidebar.jsx                 # Collapsible sidebar with chat history
│   │   ├── VisualChatLogo.jsx          # Reusable logo component
│   │   └── WelcomeScreen.jsx           # Landing screen with suggested prompts
│   │
│   ├── hooks/
│   │   ├── useApiConfig.js   # Multi-provider API key management (localStorage)
│   │   ├── useChat.js        # Chat state, message handling, parallel API calls
│   │   └── useChatHistory.js # Session persistence & management (localStorage)
│   │
│   ├── prompts/
│   │   └── systemPrompts.js  # System prompts for text & animation generation
│   │
│   ├── App.jsx               # Root component
│   ├── index.css             # Global styles, resets, scrollbar, typography
│   └── main.jsx              # React DOM entry point
│
├── .env                      
├── .gitignore
├── eslint.config.js
├── index.html                # HTML shell with SEO meta tags
├── package.json
├── postcss.config.cjs
├── tailwind.config.js        # Custom Gemini-inspired design tokens
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- At least one API key from a supported provider:
  - [Google Gemini](https://aistudio.google.com/apikey)
  - [Groq](https://console.groq.com/keys)
  - [OpenRouter](https://openrouter.ai/keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hamzathul-karrar/Visual-chat.git
cd Visual-chat

# Install dependencies
npm install
```

### Configuration

#### In-App Settings 
1. Start the app and click the **🔑 key icon** in the top-right corner
2. Configure your providers, models, and API keys for text and animation tasks
3. Keys are saved to `localStorage` and persist across sessions


### Running the App

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview    # Preview the production build
```

---

## ⚙️ API Configuration

Visual Chat supports **independent provider configuration** for its two AI tasks:

| Task            | Purpose                              | Default Provider | Default Model                |
| --------------- | ------------------------------------ | ---------------- | ---------------------------- |
| **Text Output** | Generates the markdown explanation   | Groq             | `llama-3.3-70b-versatile`    |
| **Animation**   | Generates Framer Motion animation code | Gemini           | `gemini-2.5-flash`           |

### Supported Providers

| Provider       | API Endpoint                                     | Auth Method    |
| -------------- | ------------------------------------------------ | -------------- |
| **Gemini**     | `generativelanguage.googleapis.com/v1beta`        | Query param    |
| **Groq**       | `api.groq.com/openai/v1/chat/completions`         | Bearer token   |
| **OpenRouter** | `openrouter.ai/api/v1/chat/completions`           | Bearer token   |

### "Use Same API Key" Option

Enable the **"Use same API key for both"** checkbox in settings to use one provider/model/key for both text and animation tasks — useful if you only have one API key.

---

## 🧩 Component Documentation

### `ChatContainer`
The root layout component. Orchestrates the sidebar, header (with API status indicator), message area, input bar, and API settings modal. Manages session switching and message persistence.

### `ChatMessage`
Renders individual chat messages. User messages appear as pill-shaped bubbles; assistant messages render markdown text and live animations side by side. Includes loading skeletons for both text and animation.

### `AnimationRenderer`
The core animation pipeline:
1. **Cleans** raw LLM output (strips markdown fences, fixes syntax errors)
2. **Transpiles** JSX → `React.createElement` calls using Babel standalone
3. **Evaluates** the code via `new Function()` with `motion` and `React` in scope
4. **Scales** the 800×500 animation canvas to fit any viewport using `ResizeObserver`

### `AnimationErrorBoundary`
Wraps `AnimationRenderer` in a `react-error-boundary`. If AI-generated code crashes, it shows a styled error fallback instead of breaking the app.

### `ApiKeyModal`
Full-featured settings modal with:
- Independent provider/model/API key fields for text and animation tasks
- Visibility toggle for API key fields
- "Use same API key" checkbox
- Auto-fill default model when switching providers
- Animated open/close with spring transitions

### `Sidebar`
Collapsible sidebar with:
- Chat session history grouped by date
- New chat button
- Delete with confirmation modal
- Collapse/expand toggle (desktop)
- Slide-in overlay (mobile)

### `WelcomeScreen`
Landing screen shown when no messages exist. Displays the Visual Chat branding and clickable prompt suggestion cards.

### `ChatInput`
Auto-expanding textarea with gradient send button. Supports `Enter` to send and `Shift+Enter` for newlines.

---

## 🪝 Custom Hooks

### `useChat(initialMessages, apiConfig)`
Manages the message array and API interactions:
- Fires **parallel** API calls for text and animation
- Updates messages independently as each call resolves
- Supports animation regeneration for individual messages
- Detects null animation responses (`(motion, React) => null`)

### `useChatHistory()`
Manages multiple chat sessions persisted to `localStorage`:
- Auto-creates sessions on first message
- Derives titles from the first user message
- Groups sessions by date (Today, Yesterday, Previous 7 Days, Older)
- Caps at 20 stored sessions

### `useApiConfig()`
Manages API provider configuration:
- Stores provider, model, and API key per task (text/animation)
- Persists to `localStorage` under `vc-api-config`
- Supports "use same key" mode
- Provides `getTextConfig` and `getAnimationConfig` memos

---

## 🎨 Design System

The app uses a custom **Gemini-inspired dark theme** defined in `tailwind.config.js`:

| Token              | Value       | Usage                   |
| ------------------ | ----------- | ----------------------- |
| `vc-bg`            | `#131314`   | Main background         |
| `vc-sidebar`       | `#1a1a1b`   | Sidebar background      |
| `vc-surface`       | `#1e1f20`   | Cards, inputs           |
| `vc-hover`         | `#28292a`   | Hover states            |
| `vc-line`          | `#2d2e30`   | Borders, dividers       |
| `vc-primary`       | `#e3e3e3`   | Primary text            |
| `vc-secondary`     | `#bdc1c6`   | Secondary text          |
| `vc-muted`         | `#9aa0a6`   | Muted text              |
| `vc-blue`          | `#8ab4f8`   | Accent blue             |
| `vc-purple`        | `#c084fc`   | Accent purple           |
| `vc-green`         | `#81c995`   | Status: ready           |
| `vc-yellow`        | `#f8c85b`   | Status: loading         |
| `vc-red`           | `#f28b82`   | Status: error           |

**Typography:** Google Sans (primary), Google Sans Mono (code)

---

## 🔐 Security Notes

- API keys entered in-app are stored in **localStorage** — they never leave the browser except when calling the respective provider APIs directly.
- Animation code is evaluated using `new Function()` in a controlled scope — only `motion` and `React` are accessible to generated code.

---

## 📜 Available Scripts

| Script            | Command              | Description                        |
| ----------------- | -------------------- | ---------------------------------- |
| **dev**           | `npm run dev`        | Start Vite dev server              |
| **build**         | `npm run build`      | Build for production               |
| **preview**       | `npm run preview`    | Preview production build locally   |
| **lint**          | `npm run lint`       | Run ESLint                         |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ by [Hamzathul Karrar](https://github.com/Hamzathul-karrar)**

</div>
