import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f6fa;
    --surface: #ffffff;
    --surface2: #f0f3f8;
    --surface3: #e4e9f2;
    --border: rgba(100,116,139,0.15);
    --border-bright: rgba(37,99,235,0.35);
    --cyan: #2563eb;
    --cyan-dim: rgba(37,99,235,0.08);
    --cyan-glow: rgba(37,99,235,0.25);
    --green: #16a34a;
    --orange: #ea580c;
    --pink: #db2777;
    --purple: #7c3aed;
    --text: #0f172a;
    --text-dim: #64748b;
    --text-mid: #475569;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 14px;
    --radius-sm: 8px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 72px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    gap: 8px;
    flex-shrink: 0;
    z-index: 10;
  }
  .sidebar-logo {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-weight: 800; font-size: 16px;
    color: #080c14;
    margin-bottom: 20px;
    box-shadow: 0 0 20px var(--cyan-glow);
  }
  .sidebar-btn {
    width: 44px; height: 44px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: var(--text-dim);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    transition: all 0.2s;
    position: relative;
  }
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
    box-shadow: 0 0 8px var(--cyan);
  }
  .sidebar-badge {
    position: absolute; top: 6px; right: 6px;
    width: 8px; height: 8px;
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
  }
  .chat-header-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700;
  }
  .chat-header-info { flex: 1; }
  .chat-header-name {
    font-family: var(--font-display);
    font-size: 15px; font-weight: 700;
  }
  .chat-header-sub { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
  .online-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

  .header-actions { display: flex; gap: 6px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text-dim); cursor: pointer;
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
    background: var(--surface2);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text);
  }
  .msg-row.agent .msg-bubble {
    background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(167,139,250,0.15));
    border: 1px solid var(--border-bright);
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
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    width: fit-content;
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
    border: none; color: #080c14;
    cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
    font-weight: 700;
  }
  .send-btn:hover { transform: scale(1.05); box-shadow: 0 0 16px var(--cyan-glow); }

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
  .profile-name { font-size: 14px; font-weight: 600; }
  .profile-tier {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600;
    padding: 2px 8px; border-radius: 4px;
    margin-top: 2px;
  }

  .profile-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .stat-box {
    background: var(--surface3);
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
    background: var(--surface3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 6px 10px;
    color: var(--text); font-family: var(--font-body);
    font-size: 11px; outline: none; cursor: pointer;
  }
  .ctx-select option { background: var(--surface2); }
  .generate-btn {
    width: 100%; padding: 8px;
    background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(167,139,250,0.2));
    border: 1px solid var(--border-bright);
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
    background: var(--surface3);
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
    color: #080c14; font-family: var(--font-body);
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
  .consent-name { font-size: 12px; font-weight: 500; }
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
  }
  .toggle.on .toggle-knob { left: 17px; }
  .toggle.off .toggle-knob { left: 3px; }

  /* BROADCAST MODAL */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(8,12,20,0.85);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border-bright);
    border-radius: 20px;
    width: 500px;
    max-width: 90vw;
    max-height: 85vh;
    overflow-y: auto;
    padding: 24px;
    box-shadow: 0 0 60px rgba(56,189,248,0.15);
    animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal-title {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 800;
    margin-bottom: 4px;
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
    color: #080c14; font-family: var(--font-display);
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .launch-btn:hover { transform: scale(1.02); box-shadow: 0 0 20px var(--cyan-glow); }

  /* TOP NAV */
  .topnav {
    display: flex; align-items: center;
    padding: 0 20px;
    height: 52px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 12px;
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
    color: #080c14; font-family: var(--font-display);
    font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .broadcast-btn:hover { box-shadow: 0 0 16px var(--cyan-glow); }

  .live-badge {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 10px;
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.3);
    border-radius: 20px;
    font-size: 10px; font-weight: 600; color: var(--green);
    letter-spacing: 0.05em;
  }
  .live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .spinning { animation: spin 1.5s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 10px var(--cyan-glow); }
    50% { box-shadow: 0 0 25px var(--cyan-glow), 0 0 50px rgba(56,189,248,0.15); }
  }
`;

// ─── DATA ───────────────────────────────────────────────────────────────────

const CONVERSATIONS = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.15)",
    platform: "whatsapp",
    platformIcon: "💬",
    platformColor: "#25d366",
    platformBg: "rgba(37,211,102,0.1)",
    preview: "Thanks! Is there a discount for the sneakers?",
    time: "2m",
    unread: true,
    score: 87,
    tier: "Gold",
    tierColor: "#fbbf24",
    tierBg: "rgba(251,191,36,0.15)",
    ltv: "₹24,800",
    orders: 12,
    intent: 87,
    intentLabel: "Purchase Intent",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    initials: "RM",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.15)",
    platform: "instagram",
    platformIcon: "📸",
    platformColor: "#e1306c",
    platformBg: "rgba(225,48,108,0.1)",
    preview: "Seen this jacket on your page. Available?",
    time: "8m",
    unread: true,
    score: 62,
    tier: "Silver",
    tierColor: "#94a3b8",
    tierBg: "rgba(148,163,184,0.15)",
    ltv: "₹9,200",
    orders: 5,
    intent: 62,
    intentLabel: "Browse Intent",
  },
  {
    id: 3,
    name: "Anita Krishnan",
    initials: "AK",
    color: "#34d399",
    bg: "rgba(52,211,153,0.15)",
    platform: "sms",
    platformIcon: "✉️",
    platformColor: "#94a3b8",
    platformBg: "rgba(148,163,184,0.1)",
    preview: "Order #2847 — when does it arrive?",
    time: "22m",
    unread: false,
    score: 45,
    tier: "New",
    tierColor: "#a78bfa",
    tierBg: "rgba(167,139,250,0.15)",
    ltv: "₹3,100",
    orders: 1,
    intent: 45,
    intentLabel: "Support Intent",
  },
  {
    id: 4,
    name: "Kiran Nair",
    initials: "KN",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.15)",
    platform: "whatsapp",
    platformIcon: "💬",
    platformColor: "#25d366",
    platformBg: "rgba(37,211,102,0.1)",
    preview: "I abandoned my cart, any discount?",
    time: "1h",
    unread: false,
    score: 78,
    tier: "Gold",
    tierColor: "#fbbf24",
    tierBg: "rgba(251,191,36,0.15)",
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
  1: [
    "Offer loyalty discount 🎁",
    "Check size availability",
    "Share style guide",
    "Apply flash offer ⚡",
  ],
  2: [
    "Confirm stock availability",
    "Suggest similar styles",
    "Share lookbook link",
    "Offer try-at-home",
  ],
  3: [
    "Share tracking link 📦",
    "Estimate delivery time",
    "Offer post-delivery review",
  ],
  4: [
    "Send rescue coupon 🎫",
    "Highlight urgency ⏰",
    "Suggest bundle deal",
    "Offer EMI option",
  ],
};

const GENERATED_MESSAGES = {
  "Cart Recovery": "Hey {name}! 🛒 You left something behind — your {product} is almost gone! Use code SAVE10 for 10% off in the next 2 hours. Tap to complete: nexachat.io/cart",
  "Loyalty Reward": "Hi {name}! 🌟 Your {tier} loyalty reward is ready — enjoy exclusive 15% off your next order + free shipping! Valid this weekend only.",
  "Back in Stock": "Great news, {name}! ✨ The {product} you wanted is back in stock. Sizes are filling up fast — grab yours now before it's gone!",
  "Reengagement": "We miss you, {name}! 👋 It's been a while. Here's a special 'welcome back' surprise just for you — 20% off storewide. Let's shop! 🛍️",
  "Flash Sale": "⚡ Flash Sale LIVE! {name}, 40% off everything for the next 3 hours. Our top picks based on your style: running shoes & joggers. Shop now!",
};

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
        <div
          key={i}
          className="spark-bar"
          style={{
            height: `${(v / max) * 100}%`,
            background: color || "var(--cyan)",
          }}
        />
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
    setSelectedAudience(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };
  const togglePlatform = (p) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
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
        <div className="modal-title">📡 Smart Broadcast</div>
        <div className="modal-sub">Send AI-personalised messages to segmented audiences</div>

        <div className="modal-label">Target Audience</div>
        <div className="audience-chips">
          {audiences.map(a => (
            <div
              key={a}
              className={`audience-chip ${selectedAudience.includes(a) ? "selected" : ""}`}
              onClick={() => toggleAudience(a)}
            >{a}</div>
          ))}
        </div>

        <div className="modal-label">Platforms</div>
        <div className="platform-row">
          {platforms.map(p => (
            <button
              key={p.id}
              className={`platform-tile ${selectedPlatforms.includes(p.id) ? "selected" : ""}`}
              onClick={() => togglePlatform(p.id)}
            >
              <span className="pt-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="modal-label">Message Template</div>
        <select
          className="ctx-select"
          value={template}
          onChange={e => setTemplate(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          {templates.map(t => <option key={t}>{t}</option>)}
        </select>

        <textarea
          className="broadcast-textarea"
          value={GENERATED_MESSAGES[template]}
          readOnly
        />

        <div className="broadcast-footer">
          <div className="reach-count">Est. reach: <span>{reach.toLocaleString()}</span> users</div>
          <button className="launch-btn" onClick={() => setLaunched(true)}>🚀 Launch Campaign</button>
        </div>
      </div>
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
      const reply = { id: Date.now() + 1, role: "user", text: "Got it, thanks! Let me check that out 🙏", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
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
              📡 Broadcast
            </button>
            <div className="icon-btn" title="Notifications">🔔</div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#080c14"
            }}>N</div>
          </div>
        </div>

        <div className="app">
          {/* SIDEBAR */}
          <div className="sidebar">
            {[
              { id: "chat", label: "Inbox", badge: true },
              { id: "analytics", label: "Analytics" },
              { id: "campaigns", label: "Campaigns" },
              { id: "privacy", label: "Privacy" },
              { id: "settings", label: "Settings" },
            ].map(({ id, label, badge }) => (
              <button
                key={id}
                className={`sidebar-btn ${sidebarTab === id ? "active" : ""}`}
                onClick={() => setSidebarTab(id)}
              >
                <span className="sidebar-btn-label">{label}</span>
                {badge && <div className="sidebar-badge" />}
              </button>
            ))}
          </div>

          {/* MAIN */}
          {sidebarTab === "chat" && (
            <div className="main">
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
                    padding: "4px 12px", background: "var(--surface2)",
                    border: "1px solid var(--border)", borderRadius: 20,
                    width: "fit-content", margin: "0 auto"
                  }}>Today</div>

                  {currentMessages.map(msg => (
                    <div key={msg.id} className={`msg-row ${msg.role}`}>
                      <div className="msg-avatar" style={{
                        background: msg.role === "user" ? conv.bg : "rgba(37,99,235,0.08)",
                        color: msg.role === "user" ? conv.color : "var(--cyan)",
                      }}>
                        {msg.role === "user" ? conv.initials : "AI"}
                      </div>
                      <div className="msg-bubble-wrap">
                        {msg.ai && <div className="ai-tag">AI Generated</div>}
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
                  <div className="ai-suggestion-label">AI Suggestions</div>
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
                    <span style={{ color: "var(--text-dim)", fontSize: 16, cursor: "pointer" }} title="Emoji">😊</span>
                    <span style={{ color: "var(--text-dim)", fontSize: 16, cursor: "pointer" }} title="Attachment">📎</span>
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
                  <div className="right-section-title">AI Message Studio</div>
                  <div className="studio-panel">
                    <div className="studio-context">
                      <select className="ctx-select" value={genTrigger} onChange={e => setGenTrigger(e.target.value)}>
                        {Object.keys(GENERATED_MESSAGES).map(k => <option key={k}>{k}</option>)}
                      </select>
                    </div>
                    <button className="generate-btn" onClick={generateMessage} disabled={generating}>
                      {generating ? <><span className="spinning">⟳</span> Generating…</> : <>Generate Personalised Message</>}
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
            </div>
          )}

          {sidebarTab === "analytics" && (
            <div className="main" style={{ padding: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 20 }}>Analytics Dashboard</h2>
              <div className="analytics-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                {[
                  { label: "Total Messages", val: "12,847", delta: "+8%", color: "var(--cyan)" },
                  { label: "Active Conversations", val: "234", delta: "+15%", color: "var(--green)" },
                  { label: "Conversion Rate", val: "24%", delta: "+5%", color: "var(--orange)" },
                  { label: "Avg Response Time", val: "12s", delta: "-2s", color: "var(--purple)" },
                  { label: "Customer Satisfaction", val: "4.8/5", delta: "+0.2", color: "var(--pink)" },
                  { label: "Revenue Generated", val: "₹2.4M", delta: "+18%", color: "var(--green)" },
                ].map(({ label, val, delta, color }) => (
                  <div className="analytics-card" key={label} style={{ padding: 20 }}>
                    <div className="analytics-val" style={{ color, fontSize: 28 }}>{val}</div>
                    <div className="analytics-label">{label}</div>
                    <div className="analytics-delta" style={{ color: delta.startsWith("+") ? "var(--green)" : "var(--orange)", fontSize: 12 }}>{delta}</div>
                    <SparkLine color={color} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidebarTab === "campaigns" && (
            <div className="main" style={{ padding: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 20 }}>Campaign Management</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="studio-panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Active Campaigns</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { name: "Cart Recovery", status: "Running", reach: "1,240", conv: "18%" },
                      { name: "Loyalty Rewards", status: "Scheduled", reach: "850", conv: "22%" },
                      { name: "Flash Sale", status: "Paused", reach: "2,100", conv: "12%" },
                    ].map((camp, i) => (
                      <div key={i} style={{ padding: 12, background: "var(--surface2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontWeight: 600 }}>{camp.name}</span>
                          <span style={{ fontSize: 12, color: camp.status === "Running" ? "var(--green)" : camp.status === "Scheduled" ? "var(--orange)" : "var(--text-dim)" }}>{camp.status}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Reach: {camp.reach} | Conv: {camp.conv}</div>
                      </div>
                    ))}
                  </div>
                  <button className="generate-btn" style={{ marginTop: 16, width: "100%" }} onClick={() => setShowBroadcast(true)}>
                    Create New Campaign
                  </button>
                </div>
                <div className="studio-panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Campaign Templates</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Object.keys(GENERATED_MESSAGES).map((template, i) => (
                      <div key={i} style={{ padding: 12, background: "var(--surface2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", cursor: "pointer" }} onClick={() => setGenTrigger(template)}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{template}</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{GENERATED_MESSAGES[template].slice(0, 60)}...</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {sidebarTab === "privacy" && (
            <div className="main" style={{ padding: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 20 }}>Privacy & Consent Management</h2>
              <div className="consent-toggles" style={{ maxWidth: 600 }}>
                <div style={{ marginBottom: 20, padding: 20, background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Data Collection Consent</h3>
                  <p style={{ color: "var(--text-dim)", marginBottom: 16 }}>Manage how we collect and use your customer data for personalization and messaging.</p>
                  {[
                    { id: "whatsapp", label: "WhatsApp Messages", desc: "Promotional & transactional messages via WhatsApp Business API" },
                    { id: "sms", label: "SMS Notifications", desc: "Order updates, delivery alerts, and important notifications" },
                    { id: "email", label: "Email Marketing", desc: "Newsletter, offers, and promotional emails" },
                    { id: "profiling", label: "Behaviour Profiling", desc: "AI-powered personalization based on browsing and purchase history" },
                    { id: "analytics", label: "Analytics Tracking", desc: "Website and app usage analytics for improving service" },
                  ].map(({ id, label, desc }) => (
                    <div className="consent-row" key={id} style={{ marginBottom: 12 }}>
                      <div className="consent-info">
                        <div className="consent-name">{label}</div>
                        <div className="consent-desc">{desc}</div>
                      </div>
                      <Toggle on={consents[id] || false} onToggle={() => setConsents(prev => ({ ...prev, [id]: !prev[id] }))} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: 20, background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Data Privacy Information</h3>
                  <div style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6 }}>
                    <p><strong>Data Controller:</strong> NexaChat Technologies Pvt Ltd</p>
                    <p><strong>Purpose:</strong> Customer communication and service personalization</p>
                    <p><strong>Legal Basis:</strong> Consent and legitimate business interests</p>
                    <p><strong>Retention:</strong> 7 years for business records, 2 years for marketing data</p>
                    <p><strong>Rights:</strong> Access, rectify, erase, restrict processing, data portability</p>
                    <p style={{ marginTop: 12 }}><strong>Contact DPO:</strong> privacy@nexachat.com | 📞 +91-9876543210</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {sidebarTab === "settings" && (
            <div className="main" style={{ padding: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 20 }}>Settings & Configuration</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="studio-panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>AI Configuration</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Response Tone</label>
                      <select className="ctx-select" style={{ width: "100%" }}>
                        <option>Friendly & Professional</option>
                        <option>Casual & Conversational</option>
                        <option>Formal & Corporate</option>
                        <option>Enthusiastic & Energetic</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Auto-Reply Delay</label>
                      <select className="ctx-select" style={{ width: "100%" }}>
                        <option>Immediate (0-5s)</option>
                        <option>Quick (5-15s)</option>
                        <option>Normal (15-30s)</option>
                        <option>Slow (30-60s)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Language</label>
                      <select className="ctx-select" style={{ width: "100%" }}>
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                        <option>Gujarati</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="studio-panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Business Information</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Business Name</label>
                      <input type="text" className="ctx-select" style={{ width: "100%", padding: "8px 12px" }} defaultValue="NexaChat Demo Store" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Support Email</label>
                      <input type="email" className="ctx-select" style={{ width: "100%", padding: "8px 12px" }} defaultValue="support@nexachat.com" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Support Phone</label>
                      <input type="tel" className="ctx-select" style={{ width: "100%", padding: "8px 12px" }} defaultValue="+91-9876543210" />
                    </div>
                    <button className="generate-btn" style={{ marginTop: 8 }}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
