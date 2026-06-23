import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualChatLogo from './VisualChatLogo';

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/** Confirmation modal for deleting a chat session */
function DeleteConfirmModal({ sessionTitle, onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#1e1f20',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '24px 28px 20px',
            maxWidth: 360,
            width: '90vw',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Warning icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(242,139,130,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f28b82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <span style={{ color: '#e3e3e3', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Delete chat?
            </span>
          </div>

          {/* Message */}
          <p style={{
            color: '#9aa0a6', fontSize: 13, lineHeight: 1.55,
            margin: '0 0 20px', padding: 0,
          }}>
            <span style={{ color: '#bdc1c6', fontWeight: 500 }}>"{sessionTitle}"</span>{' '}
            will be permanently deleted. This action cannot be undone.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: '#bdc1c6',
                fontSize: 13,
                fontWeight: 500,
                padding: '8px 18px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                background: 'rgba(242,139,130,0.15)',
                border: '1px solid rgba(242,139,130,0.25)',
                borderRadius: 10,
                color: '#f28b82',
                fontSize: 13,
                fontWeight: 600,
                padding: '8px 18px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(242,139,130,0.25)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(242,139,130,0.15)'; }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function groupByDate(sessions) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenDays = new Date(today);
  sevenDays.setDate(today.getDate() - 7);

  const groups = { Today: [], Yesterday: [], 'Previous 7 Days': [], Older: [] };

  sessions.forEach((s) => {
    const d = new Date(s.updatedAt);
    if (d.toDateString() === today.toDateString()) groups['Today'].push(s);
    else if (d.toDateString() === yesterday.toDateString()) groups['Yesterday'].push(s);
    else if (d >= sevenDays) groups['Previous 7 Days'].push(s);
    else groups['Older'].push(s);
  });

  return groups;
}

export default function Sidebar({ sessions, activeSessionId, onNewChat, onLoadSession, onDeleteSession, mobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [deleteModalSession, setDeleteModalSession] = useState(null);

  const grouped = groupByDate(sessions);
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

  function handleDeleteClick(e, session) {
    e.stopPropagation();
    setDeleteModalSession(session);
  }

  function confirmDelete() {
    if (deleteModalSession) {
      onDeleteSession(deleteModalSession.id);
      setDeleteModalSession(null);
    }
  }

  function cancelDelete() {
    setDeleteModalSession(null);
  }

  const sidebarWidth = collapsed ? 56 : 260;

  return (
    <>
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ height: '100dvh' }}
        className={`bg-vc-sidebar border-r border-vc-line flex flex-col shrink-0 overflow-hidden z-30 absolute md:relative transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top: collapse toggle + logo */}
        <div className={`flex items-center gap-[10px] shrink-0 min-h-[56px] ${collapsed ? 'px-3 py-[14px]' : 'px-4 py-[14px]'}`}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex bg-transparent border-none text-vc-muted cursor-pointer p-[6px] rounded-lg items-center justify-center shrink-0 transition-all duration-150 hover:bg-vc-hover hover:text-vc-primary"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button
            onClick={onCloseMobile}
            title="Close sidebar"
            className="md:hidden bg-transparent border-none text-vc-muted cursor-pointer p-[6px] rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 hover:bg-vc-hover hover:text-vc-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <VisualChatLogo size={24} />
                <span className="text-[15px] font-medium text-vc-primary whitespace-nowrap tracking-[-0.01em]">
                  Visual Chat
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Chat button */}
        <div className={`shrink-0 ${collapsed ? 'px-2 py-1' : 'px-3 py-1'}`}>
          <button
            onClick={onNewChat}
            title="New chat"
            className={`w-full bg-transparent border border-vc-line rounded-[10px] cursor-pointer flex items-center gap-[9px] text-vc-primary text-[13.5px] font-medium font-sans transition-all duration-150 hover:bg-vc-hover hover:border-vc-lineHover ${collapsed ? 'justify-center py-[9px] px-0' : 'justify-start py-[9px] px-[14px]'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="whitespace-nowrap">
                  New chat
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Chat history list */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-1 py-2' : 'px-2 py-2'}`}>
          <AnimatePresence>
            {!collapsed && sessions.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-vc-faint text-xs text-center px-2 py-6 leading-[1.6]">
                Your conversations will appear here
              </motion.p>
            )}
          </AnimatePresence>

          {!collapsed &&
            groupOrder.map((groupName) => {
              const items = grouped[groupName];
              if (!items || items.length === 0) return null;
              return (
                <div key={groupName} className="mb-2">
                  {/* Group label */}
                  <div className="text-[10.5px] font-semibold text-vc-faint uppercase tracking-[0.06em] px-2 pt-2 pb-1">
                    {groupName}
                  </div>

                  {/* Session items */}
                  {items.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const isHovered = hoveredId === session.id;

                    return (
                      <motion.div
                        key={session.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => onLoadSession(session.id)}
                        onMouseEnter={() => setHoveredId(session.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group flex items-center gap-[6px] px-[10px] py-2 rounded-lg cursor-pointer transition-colors duration-150 relative mb-[1px] border-l-2 ${isActive ? 'bg-vc-hover border-vc-blue' : isHovered ? 'bg-[#222324] border-transparent' : 'bg-transparent border-transparent'}`}
                      >
                        {/* Chat icon */}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#8ab4f8' : '#9aa0a6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>

                        {/* Title */}
                        <span className={`text-[13px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap leading-[1.4] ${isActive ? 'text-vc-primary' : 'text-vc-secondary'}`}>
                          {session.title}
                        </span>

                        {/* Delete button — always visible on mobile, hover-only on desktop */}
                        <button
                          onClick={(e) => handleDeleteClick(e, session)}
                          title="Delete chat"
                          className="border-none cursor-pointer p-[2px_4px] rounded-[5px] flex items-center shrink-0 transition-all duration-150 text-vc-muted hover:text-vc-red md:opacity-0 md:group-hover:opacity-100"
                          style={{ background: 'transparent' }}
                        >
                          <TrashIcon />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </motion.aside>

      {/* Delete confirmation modal */}
      {deleteModalSession && (
        <DeleteConfirmModal
          sessionTitle={deleteModalSession.title}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}
