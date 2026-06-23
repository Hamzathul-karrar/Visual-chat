import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROVIDER_OPTIONS, DEFAULT_MODELS } from '../hooks/useApiConfig';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.18 } },
};

/* ── Reusable small components ── */

function VisibilityToggle({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-vc-faint hover:text-vc-muted transition-colors"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
      title={visible ? 'Hide key' : 'Show key'}
    >
      {visible ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

/** Shared input styles */
const inputStyle = {
  background: 'rgba(19,19,20,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function focusBorder(e) {
  e.target.style.borderColor = 'rgba(138,180,248,0.4)';
}
function blurBorder(e) {
  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
}

/** A single task section: provider + model + api key */
function TaskSection({ title, icon, draft, onFieldChange, keyVisible, onToggleKey, disabled }) {
  return (
    <section style={{ opacity: disabled ? 0.4 : 1, transition: 'opacity 0.25s ease' }}>
      <h3 className="text-xs font-medium text-vc-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        {icon}
        {title}
        {disabled && (
          <span className="ml-1 text-[11px] text-vc-blue normal-case tracking-normal" style={{ fontWeight: 400 }}>
            (same as text)
          </span>
        )}
      </h3>

      {/* Provider + Model row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[12px] text-vc-faint mb-1 block">Provider</label>
          <select
            value={draft.provider}
            onChange={(e) => onFieldChange('provider', e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-[13px] text-vc-primary appearance-none"
            style={{
              ...inputStyle,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa0a6' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '32px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              pointerEvents: disabled ? 'none' : 'auto',
            }}
            onFocus={focusBorder}
            onBlur={blurBorder}
            disabled={disabled}
          >
            {PROVIDER_OPTIONS.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#1e1f20' }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[12px] text-vc-faint mb-1 block">Model</label>
          <input
            type="text"
            value={draft.model}
            onChange={(e) => onFieldChange('model', e.target.value)}
            placeholder="e.g. gemini-2.5-flash"
            className="w-full rounded-xl px-3 py-2.5 text-[13px] text-vc-primary"
            style={{
              ...inputStyle,
              cursor: disabled ? 'not-allowed' : 'text',
              pointerEvents: disabled ? 'none' : 'auto',
            }}
            onFocus={focusBorder}
            onBlur={blurBorder}
            disabled={disabled}
          />
        </div>
      </div>

      {/* API Key row */}
      <div>
        <label className="text-[12px] text-vc-faint mb-1 block">API Key</label>
        <div className="relative">
          <input
            type={keyVisible ? 'text' : 'password'}
            value={draft.apiKey}
            onChange={(e) => onFieldChange('apiKey', e.target.value)}
            placeholder={`Enter ${PROVIDER_OPTIONS.find((p) => p.id === draft.provider)?.label || ''} API key`}
            className="w-full rounded-xl px-3.5 py-2.5 text-[13px] text-vc-primary pr-10"
            style={{
              ...inputStyle,
              cursor: disabled ? 'not-allowed' : 'text',
              pointerEvents: disabled ? 'none' : 'auto',
            }}
            onFocus={focusBorder}
            onBlur={blurBorder}
            disabled={disabled}
          />
          {!disabled && <VisibilityToggle visible={keyVisible} onClick={onToggleKey} />}
        </div>
      </div>
    </section>
  );
}

/* ── Main Modal ── */

export default function ApiKeyModal({ isOpen, onClose, config, updateConfig }) {
  const [draft, setDraft] = useState({
    text: { provider: 'groq', model: '', apiKey: '' },
    animation: { provider: 'gemini', model: '', apiKey: '' },
    useSameKey: false,
  });

  const [keyVisibility, setKeyVisibility] = useState({ text: false, animation: false });
  const [saved, setSaved] = useState(false);

  // Sync draft from config whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setDraft({
        text: { ...config.text },
        animation: { ...config.animation },
        useSameKey: config.useSameKey ?? false,
      });
      setKeyVisibility({ text: false, animation: false });
      setSaved(false);
    }
  }, [isOpen, config]);

  function handleFieldChange(task, field, value) {
    setDraft((d) => {
      const updated = { ...d, [task]: { ...d[task], [field]: value } };
      // When provider changes, auto-fill default model
      if (field === 'provider') {
        updated[task].model = DEFAULT_MODELS[value] || '';
      }
      return updated;
    });
  }

  function handleUseSameKeyToggle() {
    setDraft((d) => ({ ...d, useSameKey: !d.useSameKey }));
  }

  function handleSave() {
    const toSave = { ...draft };
    // When "use same" is checked, copy text config into animation
    if (toSave.useSameKey) {
      toSave.animation = { ...toSave.text };
    }
    updateConfig(toSave);
    setSaved(true);
    setTimeout(() => onClose(), 600);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(30,31,32,0.97) 0%, rgba(26,26,27,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 pt-5 pb-1">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138,180,248,0.15), rgba(192,132,252,0.15))',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8ab4f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-vc-heading">API Configuration</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-vc-faint hover:text-vc-muted hover:bg-vc-hover transition-all"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-6 pb-6 pt-3 flex flex-col gap-5">
              {/* ── Text Output Section ── */}
              <TaskSection
                title="Text Output"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                }
                draft={draft.text}
                onFieldChange={(field, value) => handleFieldChange('text', field, value)}
                keyVisible={keyVisibility.text}
                onToggleKey={() => setKeyVisibility((v) => ({ ...v, text: !v.text }))}
                keyDisabled={false}
              />

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

              {/* ── Animation Output Section ── */}
              <TaskSection
                title="Animation Output"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                }
                draft={draft.useSameKey ? draft.text : draft.animation}
                onFieldChange={(field, value) => handleFieldChange('animation', field, value)}
                keyVisible={keyVisibility.animation}
                onToggleKey={() => setKeyVisibility((v) => ({ ...v, animation: !v.animation }))}
                disabled={draft.useSameKey}
              />

              {/* ── "Use same API key" checkbox ── */}
              <label
                className="flex items-center gap-3 cursor-pointer select-none group"
                style={{ marginTop: -4 }}
              >
                <div
                  className="relative flex items-center justify-center w-[18px] h-[18px] rounded-md transition-all duration-200"
                  style={{
                    background: draft.useSameKey
                      ? 'linear-gradient(135deg, #8ab4f8, #c084fc)'
                      : 'rgba(19,19,20,0.6)',
                    border: draft.useSameKey
                      ? '1px solid rgba(138,180,248,0.5)'
                      : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={draft.useSameKey}
                    onChange={handleUseSameKeyToggle}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {draft.useSameKey && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#131314"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </div>
                <span className="text-[13px] text-vc-secondary group-hover:text-vc-primary transition-colors">
                  Use same API key for both
                </span>
              </label>

              {/* ── Save Button ── */}
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl py-2.5 text-[14px] font-medium transition-all duration-200 mt-1"
                style={{
                  background: saved
                    ? 'linear-gradient(135deg, rgba(129,201,149,0.25), rgba(52,211,153,0.15))'
                    : 'linear-gradient(135deg, rgba(138,180,248,0.2), rgba(192,132,252,0.15))',
                  border: saved
                    ? '1px solid rgba(129,201,149,0.3)'
                    : '1px solid rgba(138,180,248,0.2)',
                  color: saved ? '#81c995' : '#8ab4f8',
                  cursor: 'pointer',
                }}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
