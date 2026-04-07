import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f6fb;
    --surface: #ffffff;
    --surface2: #f0f3f8;
    --surface3: #e4e9f2;
    --border: rgba(100,116,139,0.15);
    --border-bright: rgba(56,189,248,0.4);
    --cyan: #0ea5e9;
    --cyan-dim: rgba(14,165,233,0.1);
    --cyan-glow: rgba(14,165,233,0.3);
    --green: #10b981;
    --orange: #f97316;
    --pink: #ec4899;
    --purple: #8b5cf6;
    --text: #1e293b;
    --text-dim: #94a3b8;
    --text-mid: #64748b;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 14px;
    --radius-sm: 8px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 82px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    gap: 4px;
    flex-shrink: 0;
    z-index: 10;
    box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  }
  .sidebar-logo {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-weight: 800; font-size: 16px;
    color: #fff;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px var(--cyan-glow);
  }
  .sidebar-btn {
    width: 64px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--text-dim);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 8px 4px;
    font-size: 9px;
    font-family: var(--font-body);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: all 0.2s;
    position: relative;
  }
  .sidebar-btn svg { width: 18px; height: 18px; stroke-width: 1.8; }
  .sidebar-btn:hover, .sidebar-btn.active {
    background: var(--cyan-dim);
    color: var(--cyan);
  }
  .sidebar-btn.active::before {
    content: '';
    position: absolute;
    left: -8px;
    width: 3px; height: 20px;
    background: var(--cyan);
    border-radius: 0 2px 2px 0;
  }
  .sidebar-badge {
    position: absolute; top: 6px; right: 8px;
    width: 7px; height: 7px;
    background: var(--pink);
    border-radius: 50%;
    border: 2px solid var(--surface);
  }

  /* MAIN LAYOUT */
  .main { flex: 1; display: flex; overflow: hidden; }

  /* LEFT PANEL */
  .left-panel {
    width: 300px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .panel-header {
    padding: 20px 16px 12px;
    border-bottom: 1px solid var(--border);
  }
  .panel-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
  }
  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
  }
  .search-bar input {
    background: none; border: none; outline: none;
    color: var(--text); font-family: var(--font-body);
    font-size: 13px; flex: 1;
  }
  .search-bar input::placeholder { color: var(--text-dim); }

  .filter-tabs {
    display: flex; gap: 4px; padding: 10px 16px;
    border-bottom: 1px solid var(--border);
  }
  .filter-tab {
    padding: 4px 10px;
    border-radius: 20px;
    border: none;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--text-dim);
  }
  .filter-tab.active {
    background: var(--cyan-dim);
    color: var(--cyan);
  }

  .conversation-list { flex: 1; overflow-y: auto; padding: 8px; }
  .conversation-list::-webkit-scrollbar { width: 4px; }
  .conversation-list::-webkit-scrollbar-track { background: transparent; }
  .conversation-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .conv-item {
    padding: 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
    margin-bottom: 2px;
  }
  .conv-item:hover { background: var(--surface2); }
  .conv-item.active { background: var(--surface2); border-color: var(--border-bright); }
  .conv-item-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .conv-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .conv-info { flex: 1; min-width: 0; }
  .conv-name {
    font-size: 13px; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .conv-time { font-size: 10px; color: var(--text-dim); flex-shrink: 0; }
  .conv-preview { font-size: 11px; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .conv-meta { display: flex; align-items: center; gap: 4px; margin-top: 4px; }
  .platform-badge {
    display: flex; align-items: center; gap: 3px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .score-badge {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    color: var(--green);
  }
  .unread-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--cyan);
    flex-shrink: 0;
  }

  /* CENTER PANEL */
  .center-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    min-width: 0;
  }

  .chat-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .chat-header-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700;
  }
  .chat-header-info { flex: 1; }
  .chat-header-name {
    font-family: var(--font-display);
    font-size: 15px; font-weight: 700; color: var(--text);
  }
  .chat-header-sub { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
  .online-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

  .header-actions { display: flex; gap: 6px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text-mid); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; transition: all 0.2s;
  }
  .icon-btn:hover { border-color: var(--cyan); color: var(--cyan); }

  .messages-area {
    flex: 1; overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .msg-row { display: flex; gap: 8px; max-width: 75%; }
  .msg-row.agent { align-self: flex-end; flex-direction: row-reverse; }
  .msg-row.user { align-self: flex-start; }

  .msg-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700;
    flex-shrink: 0; align-self: flex-end;
  }

  .msg-bubble-wrap { display: flex; flex-direction: column; gap: 3px; }
  .msg-bubble {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.5;
    position: relative;
  }
  .msg-row.user .msg-bubble {
    background: var(--surface);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text);
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .msg-row.agent .msg-bubble {
    background: linear-gradient(135deg, rgba(14,165,233,0.12), rgba(139,92,246,0.1));
    border: 1px solid rgba(14,165,233,0.25);
    border-bottom-right-radius: 4px;
    color: var(--text);
  }
  .msg-time { font-size: 10px; color: var(--text-dim); padding: 0 4px; }
  .msg-row.agent .msg-time { text-align: right; }
  .ai-tag {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 9px; color: var(--cyan);
    background: var(--cyan-dim);
    padding: 2px 6px; border-radius: 4px;
    margin-bottom: 4px;
    font-weight: 600; letter-spacing: 0.05em;
  }

  .typing-indicator {
    display: flex; gap: 4px; align-items: center;
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    width: fit-content;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .typing-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--text-dim);
    animation: typingBounce 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-4px); opacity: 1; }
  }

  /* AI SUGGESTION BAR */
  .ai-suggestion-bar {
    padding: 10px 16px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .ai-suggestion-label {
    font-size: 10px; color: var(--cyan);
    font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .ai-pill-row { display: flex; gap: 6px; overflow-x: auto; }
  .ai-pill-row::-webkit-scrollbar { display: none; }
  .ai-pill {
    padding: 6px 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 11px; color: var(--text-mid);
    cursor: pointer; white-space: nowrap;
    transition: all 0.2s; flex-shrink: 0;
  }
  .ai-pill:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }

  /* INPUT BAR */
  .input-bar {
    padding: 12px 16px;
    display: flex; gap: 8px; align-items: flex-end;
    background: var(--surface);
    border-top: 1px solid var(--border);
  }
  .input-wrap {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex; align-items: center; gap: 8px;
    transition: border-color 0.2s;
  }
  .input-wrap:focus-within { border-color: var(--cyan); }
  .input-wrap textarea {
    flex: 1; background: none; border: none; outline: none;
    color: var(--text); font-family: var(--font-body);
    font-size: 13px; resize: none; max-height: 80px;
    line-height: 1.5;
  }
  .input-wrap textarea::placeholder { color: var(--text-dim); }
  .send-btn {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border: none; color: #fff;
    cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
    font-weight: 700;
  }
  .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 14px var(--cyan-glow); }

  /* RIGHT PANEL */
  .right-panel {
    width: 300px;
    background: var(--surface);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-shrink: 0;
  }
  .right-panel::-webkit-scrollbar { width: 4px; }
  .right-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .right-section {
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }
  .right-section-title {
    font-family: var(--font-display);
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 6px;
  }

  .user-profile-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
  }
  .profile-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .profile-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700;
  }
  .profile-name { font-size: 14px; font-weight: 600; color: var(--text); }
  .profile-tier {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600;
    padding: 2px 8px; border-radius: 4px;
    margin-top: 2px;
  }

  .profile-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .stat-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px;
    text-align: center;
  }
  .stat-val { font-family: var(--font-display); font-size: 16px; font-weight: 700; }
  .stat-label { font-size: 9px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1px; }

  .intent-bar { margin-top: 12px; }
  .intent-label { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
  .intent-label span:last-child { color: var(--cyan); font-weight: 600; }
  .intent-track { height: 4px; background: var(--surface3); border-radius: 2px; }
  .intent-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

  /* BEHAVIOR SIGNALS */
  .signal-list { display: flex; flex-direction: column; gap: 6px; }
  .signal-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 11px;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
  .signal-icon { font-size: 14px; flex-shrink: 0; }
  .signal-text { flex: 1; color: var(--text-mid); }
  .signal-time { font-size: 9px; color: var(--text-dim); }

  /* MESSAGE STUDIO */
  .studio-panel {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px;
  }
  .studio-context { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
  .ctx-select {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 6px 10px;
    color: var(--text); font-family: var(--font-body);
    font-size: 11px; outline: none; cursor: pointer;
  }
  .ctx-select option { background: var(--surface); }
  .generate-btn {
    width: 100%; padding: 8px;
    background: linear-gradient(135deg, rgba(14,165,233,0.12), rgba(139,92,246,0.12));
    border: 1px solid rgba(14,165,233,0.3);
    border-radius: var(--radius-sm);
    color: var(--cyan); font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .generate-btn:hover { background: var(--cyan-dim); }
  .generated-msg {
    margin-top: 8px;
    padding: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 11px; color: var(--text-mid);
    line-height: 1.5;
    animation: fadeIn 0.5s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .use-msg-btn {
    margin-top: 6px; width: 100%; padding: 6px;
    background: var(--cyan);
    border: none; border-radius: var(--radius-sm);
    color: #fff; font-family: var(--font-body);
    font-size: 11px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .use-msg-btn:hover { opacity: 0.9; }

  /* ANALYTICS */
  .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .analytics-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px;
    text-align: center;
  }
  .analytics-val {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 800;
  }
  .analytics-label { font-size: 9px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  .analytics-delta { font-size: 10px; font-weight: 600; margin-top: 2px; }

  /* MINI SPARKLINE */
  .sparkline { display: flex; align-items: flex-end; gap: 2px; height: 28px; margin-top: 8px; }
  .spark-bar {
    flex: 1; border-radius: 2px;
    transition: height 1s ease;
    opacity: 0.7;
  }

  /* CONSENT PANEL */
  .consent-toggles { display: flex; flex-direction: column; gap: 8px; }
  .consent-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .consent-info { flex: 1; }
  .consent-name { font-size: 12px; font-weight: 500; color: var(--text); }
  .consent-desc { font-size: 10px; color: var(--text-dim); margin-top: 1px; }
  .toggle {
    width: 32px; height: 18px;
    border-radius: 9px;
    position: relative; cursor: pointer;
    transition: background 0.2s; flex-shrink: 0;
  }
  .toggle.on { background: var(--cyan); }
  .toggle.off { background: var(--surface3); border: 1px solid var(--border); }
  .toggle-knob {
    position: absolute;
    width: 12px; height: 12px;
    background: white; border-radius: 50%;
    top: 3px; transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .toggle.on .toggle-knob { left: 17px; }
  .toggle.off .toggle-knob { left: 3px; }

  /* BROADCAST MODAL */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(30,41,59,0.4);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    width: 500px;
    max-width: 90vw;
    max-height: 85vh;
    overflow-y: auto;
    padding: 24px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal-title {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 800;
    margin-bottom: 4px; color: var(--text);
  }
  .modal-sub { font-size: 13px; color: var(--text-dim); margin-bottom: 20px; }
  .modal-close {
    position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; cursor: pointer;
    color: var(--text-dim); font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { color: var(--text); border-color: var(--text-mid); }

  .audience-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .audience-chip {
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid var(--border);
    font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    background: transparent; color: var(--text-mid);
  }
  .audience-chip.selected {
    background: var(--cyan-dim);
    border-color: var(--cyan);
    color: var(--cyan);
  }

  .modal-label { font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .platform-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .platform-tile {
    flex: 1; padding: 10px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.2s;
    text-align: center; font-size: 11px;
    background: transparent; color: var(--text-mid);
    font-family: var(--font-body);
  }
  .platform-tile.selected { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }
  .platform-tile .pt-icon { font-size: 20px; display: block; margin-bottom: 4px; }

  .broadcast-textarea {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 12px; color: var(--text);
    font-family: var(--font-body); font-size: 13px;
    resize: none; outline: none; height: 80px;
    transition: border-color 0.2s; margin-bottom: 16px;
  }
  .broadcast-textarea:focus { border-color: var(--cyan); }

  .broadcast-footer { display: flex; align-items: center; justify-content: space-between; }
  .reach-count { font-size: 12px; color: var(--text-dim); }
  .reach-count span { color: var(--green); font-weight: 600; }
  .launch-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border: none; border-radius: var(--radius-sm);
    color: #fff; font-family: var(--font-display);
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .launch-btn:hover { transform: scale(1.02); box-shadow: 0 4px 16px var(--cyan-glow); }

  /* TOP NAV */
  .topnav {
    display: flex; align-items: center;
    padding: 0 20px;
    height: 52px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .topnav-brand {
    font-family: var(--font-display);
    font-size: 17px; font-weight: 800;
    background: linear-gradient(90deg, var(--cyan), var(--purple));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }
  .topnav-sep { width: 1px; height: 20px; background: var(--border); }
  .topnav-breadcrumb { font-size: 12px; color: var(--text-dim); }
  .topnav-right { margin-left: auto; display: flex; gap: 8px; align-items: center; }
  .broadcast-btn {
    padding: 7px 14px;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border: none; border-radius: 8px;
    color: #fff; font-family: var(--font-display);
    font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .broadcast-btn:hover { box-shadow: 0 4px 16px var(--cyan-glow); }

  .live-badge {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 10px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 20px;
    font-size: 10px; font-weight: 600; color: var(--green);
    letter-spacing: 0.05em;
  }
  .live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .spinning { animation: spin 1.5s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* SIDEBAR PAGE PANELS */
  .sidebar-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    overflow-y: auto;
    padding: 32px;
  }
  .sidebar-page-title {
    font-family: var(--font-display);
    font-size: 22px; font-weight: 800;
    color: var(--text); margin-bottom: 4px;
  }
  .sidebar-page-sub {
    font-size: 13px; color: var(--text-dim); margin-bottom: 28px;
  }
  .settings-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .settings-card-title {
    font-family: var(--font-display);
    font-size: 13px; font-weight: 700;
    color: var(--text); margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .settings-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .settings-row:last-child { border-bottom: none; }
  .settings-row-info { flex: 1; }
  .settings-row-label { font-size: 13px; font-weight: 500; color: var(--text); }
  .settings-row-desc { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
  .settings-input {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 7px 12px;
    color: var(--text); font-family: var(--font-body);
    font-size: 12px; outline: none; width: 180px;
  }
  .settings-input:focus { border-color: var(--cyan); }
  .settings-select {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 7px 12px;
    color: var(--text); font-family: var(--font-body);
    font-size: 12px; outline: none; cursor: pointer;
  }
  .save-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border: none; border-radius: var(--radius-sm);
    color: #fff; font-family: var(--font-display);
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; margin-top: 8px;
  }
  .save-btn:hover { box-shadow: 0 4px 14px var(--cyan-glow); }
  .profile-avatar-big {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 800; color: #fff;
    margin-bottom: 12px;
  }
  .profile-page-top {
    display: flex; flex-direction: column; align-items: center;
    padding: 28px; text-align: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .profile-page-name { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--text); }
  .profile-page-role { font-size: 12px; color: var(--text-dim); margin-top: 4px; }
  .danger-btn {
    padding: 8px 16px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: var(--radius-sm);
    color: #ef4444; font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .danger-btn:hover { background: rgba(239,68,68,0.15); }
`;

// ─── DATA ───────────────────────────────────────────────────────────────────

const CONVERSATIONS = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    platform: "whatsapp",
    platformIcon: "💬",
    platformColor: "#25d366",
    platformBg: "rgba(37,211,102,0.1)",
    preview: "Thanks! Is there a discount for the sneakers?",
    time: "2m",
    unread: true,
    score: 87,
    tier: "Gold",
    tierColor: "#d97706",
    tierBg: "rgba(251,191,36,0.12)",
    ltv: "₹24,800",
    orders: 12,
    intent: 87,
    intentLabel: "Purchase Intent",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    initials: "RM",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.12)",
    platform: "instagram",
    platformIcon: "📸",
    platformColor: "#e1306c",
    platformBg: "rgba(225,48,108,0.1)",
    preview: "Seen this jacket on your page. Available?",
    time: "8m",
    unread: true,
    score: 62,
    tier: "Silver",
    tierColor: "#64748b",
    tierBg: "rgba(148,163,184,0.12)",
    ltv: "₹9,200",
    orders: 5,
    intent: 62,
    intentLabel: "Browse Intent",
  },
  {
    id: 3,
    name: "Anita Krishnan",
    initials: "AK",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    platform: "sms",
    platformIcon: "✉️",
    platformColor: "#64748b",
    platformBg: "rgba(148,163,184,0.1)",
    preview: "Order #2847 — when does it arrive?",
    time: "22m",
    unread: false,
    score: 45,
    tier: "New",
    tierColor: "#8b5cf6",
    tierBg: "rgba(139,92,246,0.12)",
    ltv: "₹3,100",
    orders: 1,
    intent: 45,
    intentLabel: "Support Intent",
  },
  {
    id: 4,
    name: "Kiran Nair",
    initials: "KN",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    platform: "whatsapp",
    platformIcon: "💬",
    platformColor: "#25d366",
    platformBg: "rgba(37,211,102,0.1)",
    preview: "I abandoned my cart, any discount?",
    time: "1h",
    unread: false,
    score: 78,
    tier: "Gold",
    tierColor: "#d97706",
    tierBg: "rgba(251,191,36,0.12)",
    ltv: "₹18,400",
    orders: 9,
    intent: 78,
    intentLabel: "Re-Engage Intent",
  },
];

const MESSAGES_BY_ID = {
  1: [
    { id: 1, role: "user", text: "Hey! I saw the Air Max 270 on your site. Still in stock?", time: "10:21" },
    { id: 2, role: "agent", text: "Hi Priya! 👋 Yes, the Air Max 270 is available in sizes 5–9. You've been eyeing our sneakers for a while — great taste! 🔥", time: "10:21", ai: true },
    { id: 3, role: "user", text: "I want the white/coral in size 6. But ₹8,499 feels a bit steep 😅", time: "10:23" },
    { id: 4, role: "agent", text: "As a Gold member, you're eligible for our exclusive 12% loyalty discount! That brings it to ₹7,479 — plus free express delivery 🎁. Want me to reserve your size?", time: "10:23", ai: true },
    { id: 5, role: "user", text: "Thanks! Is there a discount for the sneakers?", time: "10:24" },
  ],
  2: [
    { id: 1, role: "user", text: "Seen this jacket on your IG page. Still available in L?", time: "09:55" },
    { id: 2, role: "agent", text: "Hey Rohan! 🙌 That's the Quilted Bomber in Olive — size L is available. Only 3 left in stock!", time: "09:55", ai: true },
    { id: 3, role: "user", text: "Seen this jacket on your page. Available?", time: "09:58" },
  ],
  3: [
    { id: 1, role: "user", text: "Order #2847 — when does it arrive?", time: "08:10" },
    { id: 2, role: "agent", text: "Hi Anita! 📦 Your order is out for delivery today and expected between 2–5 PM. Here's your live tracking: track.nexachat.io/2847", time: "08:11", ai: true },
  ],
  4: [
    { id: 1, role: "agent", text: "Hey Kiran! 👋 Noticed you left the Leather Derby Shoes in your cart. Just checking — need any help completing your order?", time: "Yesterday", ai: true },
    { id: 2, role: "user", text: "I abandoned my cart, any discount?", time: "07:40" },
    { id: 3, role: "agent", text: "Of course! Since you're a valued Gold member, here's a one-time 10% cart rescue code: KIRAN10 🎉 Valid for next 2 hours!", time: "07:40", ai: true },
  ],
};

const SIGNALS_BY_ID = {
  1: [
    { icon: "👟", text: "Viewed Air Max 270 — 3 times in 2 days", time: "2h ago" },
    { icon: "🛒", text: "Added to cart, didn't checkout", time: "5h ago" },
    { icon: "⭐", text: "Left 5★ review last month", time: "30d ago" },
    { icon: "🔄", text: "Opened last 3 WhatsApp messages", time: "3d ago" },
  ],
  2: [
    { icon: "📸", text: "Engaged with 5 posts this week", time: "1d ago" },
    { icon: "🔍", text: "Searched 'bomber jacket men'", time: "3h ago" },
    { icon: "💬", text: "First inquiry via Instagram DM", time: "Now" },
  ],
  3: [
    { icon: "📦", text: "Order #2847 shipped yesterday", time: "1d ago" },
    { icon: "📱", text: "SMS open rate: 95%", time: "Always" },
    { icon: "🆕", text: "First purchase — new customer", time: "2d ago" },
  ],
  4: [
    { icon: "🛒", text: "Cart abandoned 18 hours ago", time: "18h ago" },
    { icon: "💰", text: "Cart value: ₹4,299", time: "18h ago" },
    { icon: "👁️", text: "Returned to cart page twice", time: "10h ago" },
    { icon: "🏆", text: "Gold member since Jan 2023", time: "" },
  ],
};

const AI_SUGGESTIONS_BY_ID = {
  1: ["Offer loyalty discount", "Check size availability", "Share style guide", "Apply flash offer"],
  2: ["Confirm stock availability", "Suggest similar styles", "Share lookbook link", "Offer try-at-home"],
  3: ["Share tracking link", "Estimate delivery time", "Offer post-delivery review"],
  4: ["Send rescue coupon", "Highlight urgency", "Suggest bundle deal", "Offer EMI option"],
};

const GENERATED_MESSAGES = {
  "Cart Recovery": "Hey {name}! You left something behind — your {product} is almost gone! Use code SAVE10 for 10% off in the next 2 hours. Tap to complete: nexachat.io/cart",
  "Loyalty Reward": "Hi {name}! Your {tier} loyalty reward is ready — enjoy exclusive 15% off your next order + free shipping! Valid this weekend only.",
  "Back in Stock": "Great news, {name}! The {product} you wanted is back in stock. Sizes are filling up fast — grab yours now before it's gone!",
  "Reengagement": "We miss you, {name}! It's been a while. Here's a special 'welcome back' surprise just for you — 20% off storewide. Let's shop!",
  "Flash Sale": "Flash Sale LIVE! {name}, 40% off everything for the next 3 hours. Our top picks based on your style: running shoes & joggers. Shop now!",
};

// ─── SVG ICONS ───────────────────────────────────────────────────────────────

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCampaigns = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPrivacy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconProfile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }) {
  return (
    <div className={`toggle ${on ? "on" : "off"}`} onClick={onToggle}>
      <div className="toggle-knob" />
    </div>
  );
}

function SparkLine({ color }) {
  const vals = [30, 55, 40, 70, 60, 80, 65, 90, 75, 95];
  const max = 95;
  return (
    <div className="sparkline">
      {vals.map((v, i) => (
        <div key={i} className="spark-bar" style={{ height: `${(v / max) * 100}%`, background: color || "var(--cyan)" }} />
      ))}
    </div>
  );
}

function BroadcastModal({ onClose }) {
  const [selectedAudience, setSelectedAudience] = useState(["Cart Abandoned"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["whatsapp"]);
  const [template, setTemplate] = useState("Cart Recovery");
  const [launched, setLaunched] = useState(false);

  const audiences = ["All Customers", "Cart Abandoned", "Gold Members", "Inactive 30d", "New Users", "High LTV"];
  const platforms = [
    { id: "whatsapp", icon: "💬", label: "WhatsApp" },
    { id: "sms", icon: "✉️", label: "SMS" },
    { id: "instagram", icon: "📸", label: "Instagram" },
  ];
  const templates = Object.keys(GENERATED_MESSAGES);

  const toggleAudience = (a) => {
    setSelectedAudience(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };
  const togglePlatform = (p) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const reach = selectedAudience.length * 1240 + selectedPlatforms.length * 300;

  if (launched) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
        <div className="modal-title" style={{ textAlign: "center" }}>Campaign Launched!</div>
        <div className="modal-sub" style={{ textAlign: "center" }}>
          Your campaign is live across {selectedPlatforms.length} platform(s).<br />
          Estimated reach: <strong style={{ color: "var(--green)" }}>{reach.toLocaleString()} users</strong>
        </div>
        <div className="analytics-grid" style={{ marginTop: 16 }}>
          {[["Est. Reach", reach.toLocaleString(), "var(--cyan)"], ["Open Rate", "~74%", "var(--green)"], ["CTR", "~18%", "var(--orange)"], ["Conv.", "~6%", "var(--purple)"]].map(([l, v, c]) => (
            <div className="analytics-card" key={l}>
              <div className="analytics-val" style={{ color: c, fontSize: 18 }}>{v}</div>
              <div className="analytics-label">{l}</div>
            </div>
          ))}
        </div>
        <button className="launch-btn" style={{ marginTop: 20, width: "100%" }} onClick={onClose}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Smart Broadcast</div>
        <div className="modal-sub">Send AI-personalised messages to segmented audiences</div>

        <div className="modal-label">Target Audience</div>
        <div className="audience-chips">
          {audiences.map(a => (
            <div key={a} className={`audience-chip ${selectedAudience.includes(a) ? "selected" : ""}`} onClick={() => toggleAudience(a)}>{a}</div>
          ))}
        </div>

        <div className="modal-label">Platforms</div>
        <div className="platform-row">
          {platforms.map(p => (
            <button key={p.id} className={`platform-tile ${selectedPlatforms.includes(p.id) ? "selected" : ""}`} onClick={() => togglePlatform(p.id)}>
              <span className="pt-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="modal-label">Message Template</div>
        <select className="ctx-select" value={template} onChange={e => setTemplate(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
          {templates.map(t => <option key={t}>{t}</option>)}
        </select>

        <textarea className="broadcast-textarea" value={GENERATED_MESSAGES[template]} readOnly />

        <div className="broadcast-footer">
          <div className="reach-count">Est. reach: <span>{reach.toLocaleString()}</span> users</div>
          <button className="launch-btn" onClick={() => setLaunched(true)}>Launch Campaign</button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR PAGES ────────────────────────────────────────────────────────────

function ProfilePage() {
  const [name, setName] = useState("Nexachat Admin");
  const [email, setEmail] = useState("admin@nexachat.io");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="sidebar-page">
      <div className="sidebar-page-title">My Profile</div>
      <div className="sidebar-page-sub">Manage your personal information and account details</div>

      <div className="profile-page-top">
        <div className="profile-avatar-big">N</div>
        <div className="profile-page-name">{name}</div>
        <div className="profile-page-role">Admin · NexaChat Commerce</div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <span style={{ padding: "3px 10px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)", borderRadius: 20, fontSize: 11, color: "var(--cyan)", fontWeight: 600 }}>Pro Plan</span>
          <span style={{ padding: "3px 10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, fontSize: 11, color: "var(--green)", fontWeight: 600 }}>Verified</span>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Personal Information</div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Full Name</div>
            <div className="settings-row-desc">Your display name across the platform</div>
          </div>
          <input className="settings-input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Email Address</div>
            <div className="settings-row-desc">Used for login and notifications</div>
          </div>
          <input className="settings-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Phone Number</div>
            <div className="settings-row-desc">For 2FA and account recovery</div>
          </div>
          <input className="settings-input" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <button className="save-btn" onClick={handleSave}>{saved ? "Saved!" : "Save Changes"}</button>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Account Actions</div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Change Password</div>
            <div className="settings-row-desc">Update your account password</div>
          </div>
          <button className="save-btn" style={{ margin: 0, padding: "7px 14px", fontSize: 11 }}>Change</button>
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Two-Factor Authentication</div>
            <div className="settings-row-desc">Secure your account with 2FA</div>
          </div>
          <Toggle on={true} onToggle={() => {}} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label" style={{ color: "#ef4444" }}>Delete Account</div>
            <div className="settings-row-desc">Permanently remove your account and data</div>
          </div>
          <button className="danger-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}

function PrivacyPage({ consents, setConsents }) {
  return (
    <div className="sidebar-page">
      <div className="sidebar-page-title">Privacy & Consent</div>
      <div className="sidebar-page-sub">Control how your data is collected, stored, and used</div>

      <div className="settings-card">
        <div className="settings-card-title">Data & Messaging Consent</div>
        {[
          { id: "whatsapp", label: "WhatsApp Messages", desc: "Allow promotional & transactional WhatsApp messages" },
          { id: "sms", label: "SMS Notifications", desc: "Receive order updates and alerts via SMS" },
          { id: "email", label: "Email Marketing", desc: "Receive newsletters and offers via email" },
          { id: "profiling", label: "Behaviour Profiling", desc: "Allow AI-driven personalisation using your activity" },
        ].map(({ id, label, desc }) => (
          <div className="settings-row" key={id}>
            <div className="settings-row-info">
              <div className="settings-row-label">{label}</div>
              <div className="settings-row-desc">{desc}</div>
            </div>
            <Toggle on={consents[id]} onToggle={() => setConsents(prev => ({ ...prev, [id]: !prev[id] }))} />
          </div>
        ))}
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Data Retention</div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Conversation History</div>
            <div className="settings-row-desc">How long chat data is stored</div>
          </div>
          <select className="settings-select">
            <option>90 days</option>
            <option>180 days</option>
            <option>1 year</option>
            <option>Forever</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Analytics Data</div>
            <div className="settings-row-desc">Retention period for usage analytics</div>
          </div>
          <select className="settings-select">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Export My Data</div>
            <div className="settings-row-desc">Download all your data as a JSON file</div>
          </div>
          <button className="save-btn" style={{ margin: 0, padding: "7px 14px", fontSize: 11 }}>Export</button>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Compliance</div>
        <div style={{ fontSize: 12, color: "var(--text-mid)", lineHeight: 1.7, padding: "4px 0" }}>
          All data is handled per <strong>DPDP Act 2023</strong> and <strong>GDPR</strong>. Users can revoke consent at any time. Data is encrypted at rest and in transit using AES-256 and TLS 1.3.
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["GDPR Compliant", "DPDP Act 2023", "ISO 27001", "SOC 2 Type II"].map(b => (
            <span key={b} style={{ padding: "3px 10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, fontSize: 10, color: "var(--green)", fontWeight: 600 }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [notifSound, setNotifSound] = useState(true);
  const [autoReply, setAutoReply] = useState(true);
  const [aiAssist, setAiAssist] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="sidebar-page">
      <div className="sidebar-page-title">Settings</div>
      <div className="sidebar-page-sub">Configure your workspace preferences and integrations</div>

      <div className="settings-card">
        <div className="settings-card-title">General Preferences</div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Language</div>
            <div className="settings-row-desc">Interface display language</div>
          </div>
          <select className="settings-select">
            <option>English (India)</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Timezone</div>
            <div className="settings-row-desc">Used for scheduling and analytics</div>
          </div>
          <select className="settings-select">
            <option>IST (UTC+5:30)</option>
            <option>UTC</option>
            <option>PST (UTC-8)</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Dark Mode</div>
            <div className="settings-row-desc">Toggle dark/light theme</div>
          </div>
          <Toggle on={darkMode} onToggle={() => setDarkMode(p => !p)} />
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Notifications</div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Sound Alerts</div>
            <div className="settings-row-desc">Play a sound for new messages</div>
          </div>
          <Toggle on={notifSound} onToggle={() => setNotifSound(p => !p)} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Desktop Notifications</div>
            <div className="settings-row-desc">Show browser push notifications</div>
          </div>
          <Toggle on={true} onToggle={() => {}} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Email Summaries</div>
            <div className="settings-row-desc">Daily digest of activity</div>
          </div>
          <Toggle on={false} onToggle={() => {}} />
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">AI & Automation</div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">AI Message Assist</div>
            <div className="settings-row-desc">Show AI-generated reply suggestions</div>
          </div>
          <Toggle on={aiAssist} onToggle={() => setAiAssist(p => !p)} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Auto-Reply</div>
            <div className="settings-row-desc">Enable automatic responses outside business hours</div>
          </div>
          <Toggle on={autoReply} onToggle={() => setAutoReply(p => !p)} />
        </div>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">AI Confidence Threshold</div>
            <div className="settings-row-desc">Minimum score to show AI suggestions</div>
          </div>
          <select className="settings-select">
            <option>50%</option>
            <option>60%</option>
            <option>70%</option>
            <option>80%</option>
          </select>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Integrations</div>
        {[
          { name: "WhatsApp Business API", status: "Connected", color: "#10b981" },
          { name: "Instagram DM", status: "Connected", color: "#10b981" },
          { name: "Shopify", status: "Connected", color: "#10b981" },
          { name: "Razorpay", status: "Not Connected", color: "#f97316" },
        ].map(({ name, status, color }) => (
          <div className="settings-row" key={name}>
            <div className="settings-row-info">
              <div className="settings-row-label">{name}</div>
              <div className="settings-row-desc" style={{ color }}>{status}</div>
            </div>
            <button className="save-btn" style={{ margin: 0, padding: "6px 12px", fontSize: 11 }}>
              {status === "Connected" ? "Manage" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
        {saved ? "Settings Saved!" : "Save All Settings"}
      </button>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeConv, setActiveConv] = useState(1);
  const [filter, setFilter] = useState("All");
  const [messages, setMessages] = useState(MESSAGES_BY_ID);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [genTrigger, setGenTrigger] = useState("Cart Recovery");
  const [generatedMsg, setGeneratedMsg] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [consents, setConsents] = useState({ whatsapp: true, sms: true, email: false, profiling: true });
  const [sidebarTab, setSidebarTab] = useState("chat");
  const messagesEndRef = useRef(null);

  const conv = CONVERSATIONS.find(c => c.id === activeConv);
  const currentMessages = messages[activeConv] || [];
  const signals = SIGNALS_BY_ID[activeConv] || [];
  const suggestions = AI_SUGGESTIONS_BY_ID[activeConv] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), role: "agent", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), ai: false };
    setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }));
    setInputVal("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = { id: Date.now() + 1, role: "user", text: "Got it, thanks! Let me check that out.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), reply] }));
    }, 2000);
  };

  const useSuggestion = (s) => setInputVal(s);

  const generateMessage = () => {
    setGenerating(true);
    setGeneratedMsg(null);
    setTimeout(() => {
      const template = GENERATED_MESSAGES[genTrigger] || "";
      const personalized = template
        .replace("{name}", conv.name.split(" ")[0])
        .replace("{product}", "your favourited item")
        .replace("{tier}", conv.tier);
      setGeneratedMsg(personalized);
      setGenerating(false);
    }, 1400);
  };

  const filtered = filter === "All" ? CONVERSATIONS : CONVERSATIONS.filter(c => {
    if (filter === "WhatsApp") return c.platform === "whatsapp";
    if (filter === "Instagram") return c.platform === "instagram";
    if (filter === "SMS") return c.platform === "sms";
    if (filter === "Unread") return c.unread;
    return true;
  });

  const sidebarItems = [
    { id: "chat",      Icon: IconChat,      label: "Chat",     badge: true },
    { id: "analytics", Icon: IconAnalytics, label: "Analytics" },
    { id: "campaigns", Icon: IconCampaigns, label: "Campaigns" },
    { id: "profile",   Icon: IconProfile,   label: "Profile" },
    { id: "privacy",   Icon: IconPrivacy,   label: "Privacy" },
    { id: "settings",  Icon: IconSettings,  label: "Settings" },
  ];

  const isFullPage = ["profile", "privacy", "settings"].includes(sidebarTab);

  return (
    <>
      <style>{FONTS + CSS}</style>
      {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* TOP NAV */}
        <div className="topnav">
          <div className="topnav-brand">NexaChat</div>
          <div className="topnav-sep" />
          <div className="topnav-breadcrumb">Smart Commerce Messaging</div>
          <div className="topnav-right">
            <div className="live-badge"><div className="live-dot" /><span>LIVE</span></div>
            <button className="broadcast-btn" onClick={() => setShowBroadcast(true)}>
              Broadcast
            </button>
            <div className="icon-btn" title="Notifications" style={{ fontSize: 16 }}>🔔</div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff"
            }}>N</div>
          </div>
        </div>

        <div className="app">
          {/* SIDEBAR */}
          <div className="sidebar">
            {sidebarItems.map(({ id, Icon, label, badge }) => (
              <button
                key={id}
                className={`sidebar-btn ${sidebarTab === id ? "active" : ""}`}
                onClick={() => setSidebarTab(id)}
                title={label}
              >
                <Icon />
                <span>{label}</span>
                {badge && <div className="sidebar-badge" />}
              </button>
            ))}
          </div>

          {/* MAIN */}
          <div className="main">

            {/* FULL-PAGE SIDEBAR VIEWS */}
            {sidebarTab === "profile" && <ProfilePage />}
            {sidebarTab === "privacy" && <PrivacyPage consents={consents} setConsents={setConsents} />}
            {sidebarTab === "settings" && <SettingsPage />}

            {/* CHAT VIEW */}
            {!isFullPage && (
              <>
                {/* LEFT: CONVERSATIONS */}
                <div className="left-panel">
                  <div className="panel-header">
                    <div className="panel-title">Inbox</div>
                    <div className="search-bar">
                      <span style={{ color: "var(--text-dim)", fontSize: 13 }}>🔍</span>
                      <input placeholder="Search conversations..." />
                    </div>
                  </div>
                  <div className="filter-tabs">
                    {["All", "Unread", "WhatsApp", "Instagram", "SMS"].map(f => (
                      <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                  </div>
                  <div className="conversation-list">
                    {filtered.map(c => (
                      <div
                        key={c.id}
                        className={`conv-item ${activeConv === c.id ? "active" : ""}`}
                        onClick={() => setActiveConv(c.id)}
                      >
                        <div className="conv-item-top">
                          <div className="conv-avatar" style={{ background: c.bg, color: c.color }}>{c.initials}</div>
                          <div className="conv-info">
                            <div className="conv-name">{c.name}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                            <div className="conv-time">{c.time}</div>
                            {c.unread && <div className="unread-dot" />}
                          </div>
                        </div>
                        <div className="conv-preview">{c.preview}</div>
                        <div className="conv-meta">
                          <div className="platform-badge" style={{ background: c.platformBg, color: c.platformColor }}>
                            {c.platformIcon} {c.platform}
                          </div>
                          <div className="score-badge">AI {c.score}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CENTER: CHAT */}
                <div className="center-panel">
                  <div className="chat-header">
                    <div className="chat-header-avatar" style={{ background: conv.bg, color: conv.color }}>
                      {conv.initials}
                    </div>
                    <div className="chat-header-info">
                      <div className="chat-header-name">{conv.name}</div>
                      <div className="chat-header-sub">
                        <div className="online-dot" />
                        Active now &nbsp;·&nbsp;
                        <span className="platform-badge" style={{ background: conv.platformBg, color: conv.platformColor, padding: "1px 5px" }}>
                          {conv.platformIcon} {conv.platform}
                        </span>
                        &nbsp;·&nbsp;
                        <span style={{ color: "var(--cyan)" }}>Intent: {conv.intent}%</span>
                      </div>
                    </div>
                    <div className="header-actions">
                      <div className="icon-btn">📞</div>
                      <div className="icon-btn">🔍</div>
                      <div className="icon-btn">⋯</div>
                    </div>
                  </div>

                  <div className="messages-area">
                    <div style={{
                      textAlign: "center", fontSize: 10, color: "var(--text-dim)",
                      padding: "4px 12px", background: "var(--surface)",
                      border: "1px solid var(--border)", borderRadius: 20,
                      width: "fit-content", margin: "0 auto",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                    }}>Today</div>

                    {currentMessages.map(msg => (
                      <div key={msg.id} className={`msg-row ${msg.role}`}>
                        <div className="msg-avatar" style={{
                          background: msg.role === "user" ? conv.bg : "rgba(14,165,233,0.12)",
                          color: msg.role === "user" ? conv.color : "var(--cyan)",
                        }}>
                          {msg.role === "user" ? conv.initials : "AI"}
                        </div>
                        <div className="msg-bubble-wrap">
                          {msg.ai && <div className="ai-tag">✦ AI Generated</div>}
                          <div className="msg-bubble">{msg.text}</div>
                          <div className="msg-time">{msg.time}</div>
                        </div>
                      </div>
                    ))}

                    {typing && (
                      <div className="msg-row user">
                        <div className="msg-avatar" style={{ background: conv.bg, color: conv.color }}>{conv.initials}</div>
                        <div className="typing-indicator">
                          <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="ai-suggestion-bar">
                    <div className="ai-suggestion-label">✦ AI Suggestions</div>
                    <div className="ai-pill-row">
                      {suggestions.map((s, i) => (
                        <div key={i} className="ai-pill" onClick={() => useSuggestion(s)}>{s}</div>
                      ))}
                    </div>
                  </div>

                  <div className="input-bar">
                    <div className="input-wrap">
                      <textarea
                        placeholder={`Reply to ${conv.name.split(" ")[0]}...`}
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
                        rows={1}
                      />
                      <span style={{ color: "var(--text-dim)", fontSize: 12, cursor: "pointer", fontWeight: 500 }} title="Attach">Attach</span>
                    </div>
                    <button className="send-btn" onClick={() => sendMessage(inputVal)}>↑</button>
                  </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="right-panel">
                  {/* USER PROFILE */}
                  <div className="right-section">
                    <div className="right-section-title">Customer Profile</div>
                    <div className="user-profile-card">
                      <div className="profile-top">
                        <div className="profile-avatar" style={{ background: conv.bg, color: conv.color, fontSize: 18 }}>
                          {conv.initials}
                        </div>
                        <div>
                          <div className="profile-name">{conv.name}</div>
                          <div className="profile-tier" style={{ background: conv.tierBg, color: conv.tierColor }}>
                            ★ {conv.tier}
                          </div>
                        </div>
                      </div>
                      <div className="profile-stats">
                        <div className="stat-box">
                          <div className="stat-val" style={{ color: "var(--cyan)" }}>{conv.ltv}</div>
                          <div className="stat-label">Lifetime Value</div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-val" style={{ color: "var(--green)" }}>{conv.orders}</div>
                          <div className="stat-label">Orders</div>
                        </div>
                      </div>
                      <div className="intent-bar">
                        <div className="intent-label">
                          <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{conv.intentLabel}</span>
                          <span>{conv.intent}%</span>
                        </div>
                        <div className="intent-track">
                          <div className="intent-fill" style={{
                            width: `${conv.intent}%`,
                            background: conv.intent > 75 ? "var(--green)" : conv.intent > 50 ? "var(--cyan)" : "var(--orange)"
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BEHAVIOR SIGNALS */}
                  <div className="right-section">
                    <div className="right-section-title">Behaviour Signals</div>
                    <div className="signal-list">
                      {signals.map((s, i) => (
                        <div className="signal-item" key={i}>
                          <div className="signal-icon">{s.icon}</div>
                          <div className="signal-text">{s.text}</div>
                          {s.time && <div className="signal-time">{s.time}</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MESSAGE STUDIO */}
                  <div className="right-section">
                    <div className="right-section-title">✦ AI Message Studio</div>
                    <div className="studio-panel">
                      <div className="studio-context">
                        <select className="ctx-select" value={genTrigger} onChange={e => setGenTrigger(e.target.value)}>
                          {Object.keys(GENERATED_MESSAGES).map(k => <option key={k}>{k}</option>)}
                        </select>
                      </div>
                      <button className="generate-btn" onClick={generateMessage} disabled={generating}>
                        {generating ? <><span className="spinning">⟳</span> Generating…</> : <>✦ Generate Personalised Message</>}
                      </button>
                      {generatedMsg && (
                        <>
                          <div className="generated-msg">{generatedMsg}</div>
                          <button className="use-msg-btn" onClick={() => { setInputVal(generatedMsg); setGeneratedMsg(null); }}>
                            ↑ Use in Chat
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ANALYTICS */}
                  <div className="right-section">
                    <div className="right-section-title">Today's Metrics</div>
                    <div className="analytics-grid">
                      {[
                        { label: "Messages Sent", val: "1,284", delta: "+12%", color: "var(--cyan)" },
                        { label: "Open Rate", val: "74%", delta: "+3%", color: "var(--green)" },
                        { label: "Conversions", val: "68", delta: "+22%", color: "var(--orange)" },
                        { label: "Avg. Response", val: "18s", delta: "−4s", color: "var(--purple)" },
                      ].map(({ label, val, delta, color }) => (
                        <div className="analytics-card" key={label}>
                          <div className="analytics-val" style={{ color }}>{val}</div>
                          <div className="analytics-label">{label}</div>
                          <div className="analytics-delta" style={{ color: delta.startsWith("+") ? "var(--green)" : "var(--orange)" }}>{delta}</div>
                        </div>
                      ))}
                    </div>
                    <SparkLine color="var(--cyan)" />
                  </div>

                  {/* CONSENT */}
                  <div className="right-section">
                    <div className="right-section-title">Consent & Privacy</div>
                    <div className="consent-toggles">
                      {[
                        { id: "whatsapp", label: "WhatsApp Messages", desc: "Promotional & transactional" },
                        { id: "sms", label: "SMS Notifications", desc: "Order updates & alerts" },
                        { id: "email", label: "Email Marketing", desc: "Newsletter & offers" },
                        { id: "profiling", label: "Behaviour Profiling", desc: "Personalisation engine" },
                      ].map(({ id, label, desc }) => (
                        <div className="consent-row" key={id}>
                          <div className="consent-info">
                            <div className="consent-name">{label}</div>
                            <div className="consent-desc">{desc}</div>
                          </div>
                          <Toggle on={consents[id]} onToggle={() => setConsents(prev => ({ ...prev, [id]: !prev[id] }))} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-dim)", lineHeight: 1.5 }}>
                      All data handled per DPDP Act 2023 & GDPR. User can revoke at any time.
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ANALYTICS & CAMPAIGNS placeholder views */}
            {sidebarTab === "analytics" && (
              <div className="sidebar-page">
                <div className="sidebar-page-title">Analytics</div>
                <div className="sidebar-page-sub">Platform-wide performance metrics and insights</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                  {[
                    { label: "Total Messages", val: "48,291", delta: "+18%", color: "var(--cyan)" },
                    { label: "Avg. Open Rate", val: "74%", delta: "+3%", color: "var(--green)" },
                    { label: "Total Conversions", val: "2,140", delta: "+22%", color: "var(--orange)" },
                    { label: "Avg. Response", val: "18s", delta: "−4s", color: "var(--purple)" },
                  ].map(({ label, val, delta, color }) => (
                    <div className="settings-card" key={label} style={{ textAlign: "center", marginBottom: 0 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: delta.startsWith("+") ? "var(--green)" : "var(--orange)" }}>{delta}</div>
                    </div>
                  ))}
                </div>
                <div className="settings-card">
                  <div className="settings-card-title">Message Volume — Last 10 Days</div>
                  <SparkLine color="var(--cyan)" />
                </div>
              </div>
            )}
            {sidebarTab === "campaigns" && (
              <div className="sidebar-page">
                <div className="sidebar-page-title">Campaigns</div>
                <div className="sidebar-page-sub">Manage broadcast campaigns and automations</div>
                <button className="save-btn" style={{ marginBottom: 20 }} onClick={() => setShowBroadcast(true)}>+ New Campaign</button>
                {["Cart Recovery — Gold Members", "Flash Sale — All Users", "Re-engagement — Inactive 30d"].map((name, i) => (
                  <div className="settings-card" key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>Sent {["2d ago", "5d ago", "1w ago"][i]} · {["2,140", "8,320", "1,980"][i]} reached</div>
                    </div>
                    <span style={{ padding: "3px 10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, fontSize: 10, color: "var(--green)", fontWeight: 600 }}>Completed</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}