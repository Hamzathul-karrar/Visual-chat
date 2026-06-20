import { useState } from 'react';
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

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

export default function Sidebar({ sessions, activeSessionId, onNewChat, onLoadSession, onDeleteSession }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const grouped = groupByDate(sessions);
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

  function handleDelete(e, id) {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      onDeleteSession(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      // Auto-cancel confirm after 2s
      setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 2000);
    }
  }

  const sidebarWidth = collapsed ? 56 : 260;

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        background: '#1a1a1b',
        borderRight: '1px solid #2d2e30',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Top section: collapse toggle + logo */}
      <div
        style={{
          padding: collapsed ? '14px 12px' : '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          minHeight: 56,
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9aa0a6',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#28292a';
            e.currentTarget.style.color = '#e3e3e3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#9aa0a6';
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {/* Logo + name — hidden when collapsed */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}
            >
              <VisualChatLogo size={24} />
              <span style={{
                fontSize: 15,
                fontWeight: 500,
                color: '#e3e3e3',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}>
                Visual Chat
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Chat button */}
      <div style={{ padding: collapsed ? '4px 8px' : '4px 12px', flexShrink: 0 }}>
        <button
          onClick={onNewChat}
          title="New chat"
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid #2d2e30',
            borderRadius: 10,
            padding: collapsed ? '9px 0' : '9px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 9,
            color: '#e3e3e3',
            fontSize: 13.5,
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'background 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#28292a';
            e.currentTarget.style.borderColor = '#3d3e40';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#2d2e30';
          }}
        >
          {/* Plus icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{ whiteSpace: 'nowrap' }}
              >
                New chat
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Chat history list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '8px 4px' : '8px 8px',
        }}
      >
        <AnimatePresence>
          {!collapsed && sessions.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: '#5f6368',
                fontSize: 12,
                textAlign: 'center',
                padding: '24px 8px',
                lineHeight: 1.6,
              }}
            >
              Your conversations will appear here
            </motion.p>
          )}
        </AnimatePresence>

        {!collapsed &&
          groupOrder.map((groupName) => {
            const items = grouped[groupName];
            if (!items || items.length === 0) return null;
            return (
              <div key={groupName} style={{ marginBottom: 8 }}>
                {/* Group label */}
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: '#5f6368',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '8px 8px 4px',
                  }}
                >
                  {groupName}
                </div>

                {/* Session items */}
                {items.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const isHovered = hoveredId === session.id;
                  const isConfirming = confirmDeleteId === session.id;

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
                      onMouseLeave={() => { setHoveredId(null); setConfirmDeleteId(null); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: isActive ? '#28292a' : isHovered ? '#222324' : 'transparent',
                        borderLeft: isActive ? '2px solid #8ab4f8' : '2px solid transparent',
                        transition: 'background 0.15s ease',
                        position: 'relative',
                        marginBottom: 1,
                      }}
                    >
                      {/* Chat icon */}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke={isActive ? '#8ab4f8' : '#9aa0a6'} strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0 }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>

                      {/* Title */}
                      <span
                        style={{
                          fontSize: 13,
                          color: isActive ? '#e3e3e3' : '#bdc1c6',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.4,
                        }}
                      >
                        {session.title}
                      </span>

                      {/* Delete button — shown on hover */}
                      {isHovered && (
                        <button
                          onClick={(e) => handleDelete(e, session.id)}
                          title={isConfirming ? 'Click again to confirm' : 'Delete chat'}
                          style={{
                            background: isConfirming ? 'rgba(242,139,130,0.15)' : 'transparent',
                            border: 'none',
                            color: isConfirming ? '#f28b82' : '#9aa0a6',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            borderRadius: 5,
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isConfirming) e.currentTarget.style.color = '#f28b82';
                          }}
                          onMouseLeave={(e) => {
                            if (!isConfirming) e.currentTarget.style.color = '#9aa0a6';
                          }}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </motion.aside>
  );
}
