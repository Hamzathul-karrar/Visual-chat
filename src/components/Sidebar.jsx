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

export default function Sidebar({ sessions, activeSessionId, onNewChat, onLoadSession, onDeleteSession, mobileOpen, onCloseMobile }) {
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
      setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 2000);
    }
  }

  const sidebarWidth = collapsed ? 56 : 260;

  return (
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
                      className={`flex items-center gap-[6px] px-[10px] py-2 rounded-lg cursor-pointer transition-colors duration-150 relative mb-[1px] border-l-2 ${isActive ? 'bg-vc-hover border-vc-blue' : isHovered ? 'bg-[#222324] border-transparent' : 'bg-transparent border-transparent'}`}
                    >
                      {/* Chat icon */}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#8ab4f8' : '#9aa0a6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>

                      {/* Title */}
                      <span className={`text-[13px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap leading-[1.4] ${isActive ? 'text-vc-primary' : 'text-vc-secondary'}`}>
                        {session.title}
                      </span>

                      {/* Delete button */}
                      {isHovered && (
                        <button
                          onClick={(e) => handleDelete(e, session.id)}
                          title={isConfirming ? 'Click again to confirm' : 'Delete chat'}
                          className={`border-none cursor-pointer p-[2px_4px] rounded-[5px] flex items-center shrink-0 transition-all duration-150 ${isConfirming ? 'text-vc-red' : 'text-vc-muted hover:text-vc-red'}`}
                          style={{ background: isConfirming ? 'rgba(242,139,130,0.15)' : 'transparent' }}
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
