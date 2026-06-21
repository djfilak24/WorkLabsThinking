import { useState, useEffect, useRef } from "react";

// OVERLAND · outdoor storage teaser (clean brand).
// Signature: a live, re-runnable lot grid that demos the assignment engine.
// Mobile: lot reflows below the copy as a flat, full-size mini-map (no tilt, fewer columns).

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.ovl {
  --ink: #080D17; --bg: #0C1322; --panel: #111A2B;
  --steel: #8693AB; --steel-dim: rgba(134,147,171,0.16);
  --pale: #EEF3FB; --amber: #F4A23C; --amber-bright: #FFB857; --amber-glow: rgba(244,162,60,0.30);
  background: var(--bg); color: var(--pale);
  font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased;
  overflow: hidden; overflow-anchor: none; position: relative;
}
.ovl * { box-sizing: border-box; }
.ovl ::selection { background: var(--amber); color: var(--ink); }

.ovl-mono { font-family: 'JetBrains Mono', monospace; }
.ovl-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; letter-spacing: 0.30em; text-transform: uppercase; color: var(--amber); }
.ovl-display { font-family: 'Archivo', sans-serif; font-weight: 900; line-height: 0.92; letter-spacing: -0.02em; text-transform: uppercase; }
.ovl-wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }

.ovl-glow { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.ovl-grain { position: fixed; inset: 0; pointer-events: none; z-index: 8; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

/* hero */
.ovl-hero { position: relative; min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; }
.ovl-hero-sky { position: relative; z-index: 4; flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 116px; padding-bottom: 30px; }
.ovl-h1 { font-size: clamp(3rem, 9.4vw, 7.4rem); margin: 18px 0 0; }
.ovl-h1 .ln { display: block; overflow: hidden; padding-bottom: 0.04em; }
.ovl-h1 .ln span { display: inline-block; transform: translateY(110%); animation: ovl-rise 0.95s cubic-bezier(.16,.84,.32,1) forwards; }
.ovl-h1 .ln:nth-child(2) span { animation-delay: 0.10s; }
.ovl-sub { max-width: 560px; margin: 26px 0 30px; color: var(--steel); font-size: clamp(1rem, 1.5vw, 1.16rem); line-height: 1.55; opacity: 0; animation: ovl-fade 0.9s 0.5s forwards; }
.ovl-cta-row { display: flex; gap: 14px; flex-wrap: wrap; opacity: 0; animation: ovl-fade 0.9s 0.66s forwards; }
.ovl-btn { font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 0.92rem; letter-spacing: 0.01em; padding: 15px 26px; border-radius: 2px; cursor: pointer; border: 1px solid transparent; transition: transform .25s, box-shadow .25s, background .25s, border-color .25s, color .25s; text-transform: uppercase; }
.ovl-btn-primary { background: var(--amber); color: var(--ink); box-shadow: 0 0 0 var(--amber-glow); }
.ovl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px var(--amber-glow); background: var(--amber-bright); }
.ovl-btn-ghost { background: transparent; color: var(--pale); border-color: var(--steel-dim); }
.ovl-btn-ghost:hover { transform: translateY(-2px); border-color: var(--amber); color: var(--amber); }
.ovl-stats { display: flex; gap: 26px; margin-top: 28px; flex-wrap: wrap; opacity: 0; animation: ovl-fade 0.9s 0.82s forwards; }
.ovl-stats div { font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.08em; color: var(--steel); }
.ovl-stats b { color: var(--pale); font-weight: 500; }

.ovl-horizon { position: absolute; left: 0; right: 0; bottom: 40%; height: 1px; z-index: 2; background: linear-gradient(90deg, transparent, rgba(244,162,60,0.55), transparent); }
.ovl-lot { position: absolute; left: 50%; bottom: -4%; z-index: 1; width: 162%; max-width: 1500px; transform: translateX(-50%);
  -webkit-mask-image: linear-gradient(to top, #000 52%, transparent 96%); mask-image: linear-gradient(to top, #000 52%, transparent 96%); perspective: 760px; }
.ovl-lot-inner { transform: rotateX(62deg); transform-origin: center bottom; }

.ovl-grid { display: grid; gap: 7px; }
.ovl-bay { position: relative; aspect-ratio: 1 / 1.5; border-radius: 2px; border: 1px solid var(--steel-dim); background: rgba(255,255,255,0.012); opacity: 0; transform: scale(0.6); animation: ovl-draw 0.5s cubic-bezier(.16,.84,.32,1) forwards; }
.ovl-bay.occ { background: rgba(134,147,171,0.07); border-color: rgba(134,147,171,0.20); }
.ovl-bay.occ::after { content: ''; position: absolute; inset: 24% 30%; border-radius: 1px; background: rgba(134,147,171,0.30); }
.ovl-bay.wide.occ::after { inset: 30% 16%; }
.ovl-bay.match { border-color: var(--amber); background: rgba(244,162,60,0.12); box-shadow: 0 0 0 1px var(--amber), 0 0 28px var(--amber-glow); opacity: 1; transform: scale(1); animation: ovl-lockpop 0.5s cubic-bezier(.16,.84,.32,1); }
.ovl-bay.match::after { content: ''; position: absolute; inset: 26% 30%; border-radius: 1px; background: var(--amber); opacity: 0; animation: ovl-fade 0.5s 0.3s forwards; }
.ovl-reticle { position: absolute; inset: -3px; pointer-events: none; }
.ovl-reticle span { position: absolute; width: 9px; height: 9px; border: 1.5px solid var(--amber); opacity: 0; animation: ovl-fade 0.4s 0.1s forwards; }
.ovl-reticle .tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.ovl-reticle .tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.ovl-reticle .bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.ovl-reticle .br { bottom: 0; right: 0; border-left: none; border-top: none; }
.ovl-tag { position: absolute; z-index: 5; top: 28px; right: 22px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.04em; color: var(--ink); background: var(--amber); padding: 7px 11px; border-radius: 2px; box-shadow: 0 10px 30px var(--amber-glow); }
.ovl-tag.scan { background: transparent; color: var(--amber); border: 1px solid var(--amber); box-shadow: none; }
.ovl-tag-enter { animation: ovl-tag-in 0.5s cubic-bezier(.16,.84,.32,1); }
.ovl-scan { position: absolute; left: 0; right: 0; height: 130px; z-index: 2; pointer-events: none; background: linear-gradient(to bottom, transparent, rgba(244,162,60,0.12), transparent); animation: ovl-sweep 6s 2.4s ease-in-out infinite; }
.ovl-sweep2 { position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; background: linear-gradient(90deg, transparent, rgba(244,162,60,0.22), transparent); }
.ovl-lot.is-scanning .ovl-sweep2 { animation: ovl-sweep2 0.7s ease-in-out; }
.ovl-chips { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 22px; opacity: 0; animation: ovl-fade 0.9s 0.74s forwards; }
.ovl-chips .lbl { font-family:'JetBrains Mono',monospace; font-size:0.7rem; letter-spacing:0.16em; color:var(--steel); text-transform:uppercase; }
.ovl-chip { font-family:'JetBrains Mono',monospace; font-size:0.74rem; letter-spacing:0.04em; color:var(--pale); background:transparent; border:1px solid var(--steel-dim); padding:8px 14px; border-radius:99px; cursor:pointer; transition: border-color .2s, color .2s, background .2s; }
.ovl-chip:hover { border-color: var(--amber); color: var(--amber); }
.ovl-chip.active { background: var(--amber); border-color: var(--amber); color: var(--ink); }
.ovl-btn:focus-visible, .ovl-chip:focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }

.ovl-ticker { border-top: 1px solid var(--steel-dim); border-bottom: 1px solid var(--steel-dim); overflow: hidden; background: var(--ink); position: relative; z-index: 4; }
.ovl-ticker-track { display: inline-flex; gap: 38px; white-space: nowrap; padding: 13px 0; animation: ovl-marq 30s linear infinite; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.10em; color: var(--steel); }
.ovl-ticker-track .hot { color: var(--amber); }

.ovl-trust { position: relative; z-index: 4; padding: 24px 0; background: var(--ink); border-bottom: 1px solid var(--steel-dim); }
.ovl-trust-row { display: flex; align-items: center; justify-content: space-between; gap: 22px; flex-wrap: wrap; }
.ovl-trust-list { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; }
.ovl-trust-item { display: flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; letter-spacing: 0.05em; color: var(--steel); white-space: nowrap; }
.ovl-trust-item svg { width: 15px; height: 15px; color: var(--amber); flex: none; }
.ovl-trust-rating { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; letter-spacing: 0.04em; color: var(--pale); white-space: nowrap; }
.ovl-trust-rating b { color: var(--amber); font-size: 0.92rem; }

.ovl-section { position: relative; z-index: 4; padding: clamp(6rem,12vh,9.5rem) 0; }
.ovl-reveal { opacity: 0; transform: translateY(28px); transition: opacity .9s, transform .9s; }
.ovl-reveal.is-in { opacity: 1; transform: none; }
.ovl-shead { font-family:'Archivo',sans-serif; font-weight:800; font-size: clamp(1.8rem,4vw,3.1rem); line-height:1.04; letter-spacing:-0.02em; margin: 14px 0 0; }

.ovl-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; margin-top: 56px; }
.ovl-step { padding: 30px 26px 30px 0; border-top: 1px solid var(--steel-dim); }
.ovl-step .n { font-family:'JetBrains Mono',monospace; color: var(--amber); font-size:0.8rem; letter-spacing:0.12em; }
.ovl-step h4 { font-family:'Archivo',sans-serif; font-weight:800; font-size:1.35rem; margin:18px 0 10px; text-transform:uppercase; letter-spacing:-0.01em; }
.ovl-step p { color: var(--steel); font-size:0.98rem; line-height:1.55; margin:0; }

.ovl-live { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 60px; align-items: center; }
.ovl-count { font-family:'Archivo',sans-serif; font-weight:900; font-size: clamp(2.6rem,7vw,5.6rem); line-height:0.92; letter-spacing:-0.03em; }
.ovl-count .open { color: var(--amber); }
.ovl-count .lbl { display:block; font-family:'JetBrains Mono',monospace; font-weight:400; font-size:0.78rem; letter-spacing:0.22em; color:var(--steel); margin-top:18px; text-transform:uppercase; }
.ovl-livegrid { display: grid; gap: 6px; padding: 22px; background: var(--panel); border:1px solid var(--steel-dim); border-radius: 4px; }
.ovl-cell { aspect-ratio: 1/1.4; border-radius: 2px; border:1px solid var(--steel-dim); background: rgba(255,255,255,0.015); transition: background .7s, border-color .7s, box-shadow .7s; }
.ovl-cell.occ { background: rgba(134,147,171,0.12); border-color: rgba(134,147,171,0.22); }
.ovl-cell.res { background: rgba(244,162,60,0.16); border-color: var(--amber); box-shadow: 0 0 12px var(--amber-glow); }
.ovl-legend { display:flex; gap:24px; margin-top:22px; flex-wrap:wrap; }
.ovl-legend span { font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.06em; color:var(--steel); display:flex; align-items:center; gap:8px; }
.ovl-dot { width:10px; height:10px; border-radius:2px; display:inline-block; border:1px solid var(--steel-dim); }

.ovl-cards { display:grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 56px; }
.ovl-card { padding: 34px 30px; background: var(--panel); border:1px solid var(--steel-dim); border-radius:4px; transition: transform .35s, border-color .35s; }
.ovl-card:hover { transform: translateY(-4px); border-color: var(--amber); }
.ovl-card .k { font-family:'JetBrains Mono',monospace; color:var(--amber); font-size:0.74rem; letter-spacing:0.14em; }
.ovl-card h4 { font-family:'Archivo',sans-serif; font-weight:800; font-size:1.4rem; margin:22px 0 12px; text-transform:uppercase; letter-spacing:-0.01em; }
.ovl-card p { color:var(--steel); font-size:0.98rem; line-height:1.55; margin:0; }

.ovl-closer { position:relative; z-index:4; padding: clamp(7rem,16vh,11rem) 0; text-align:center; overflow:hidden; }
.ovl-closer h2 { font-family:'Archivo',sans-serif; font-weight:900; font-size:clamp(1.9rem,5vw,3.6rem); line-height:1.02; letter-spacing:-0.02em; text-transform:uppercase; }
.ovl-closer-sub { color: var(--steel); font-size: clamp(1rem,1.5vw,1.12rem); line-height:1.6; max-width: 560px; margin: 22px auto 0; }
.ovl-foot { position:relative; z-index:4; border-top:1px solid var(--steel-dim); padding: 30px 0; }
.ovl-foot::before { content:''; position:absolute; top:-1px; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity:0.4; }
.ovl-foot-base { display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap; }
.ovl-mark { font-family:'Archivo',sans-serif; font-weight:900; font-size:1.3rem; letter-spacing:0.02em; }
.ovl-foot-meta { font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.08em; color:var(--steel); }

.ovl-nav { position:fixed; top:0; left:0; right:0; z-index:50; background: rgba(8,13,23,0.62); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--steel-dim); }
.ovl-nav-row { display:flex; justify-content:space-between; align-items:center; padding:18px 0; gap: 14px; }
.ovl-nav .ovl-mark { font-size:1.15rem; }
.ovl-brand { display:flex; align-items:center; gap:10px; }
.ovl-logo-mark { width:30px; height:30px; display:flex; align-items:center; justify-content:center; color: var(--amber); flex:none; }
.ovl-logo-mark svg { width:100%; height:100%; display:block; }
.ovl-nav-right { display:flex; align-items:center; gap:18px; }
.ovl-nav-btn { padding:10px 20px; font-size:0.78rem; }
.ovl-nav-cta { font-family:'JetBrains Mono',monospace; font-size:0.74rem; letter-spacing:0.12em; color:var(--steel); text-transform:uppercase; display:flex; align-items:center; gap:9px; }

/* ---------- system section ---------- */
.ovl-sys { position: relative; z-index: 4; padding: clamp(6rem,12vh,9.5rem) 0; background: var(--ink); }
.ovl-sys-intro { color: var(--steel); font-size: clamp(1rem,1.5vw,1.16rem); line-height:1.6; margin-top: 18px; max-width: 600px; }
.ovl-panel { margin-top: 40px; background: var(--panel); border:1px solid var(--steel-dim); border-radius:6px; padding: clamp(24px,4vw,44px); overflow:hidden; }
.ovl-panel-tag { font-family:'JetBrains Mono',monospace; color:var(--amber); font-size:0.72rem; letter-spacing:0.16em; text-transform:uppercase; }
.ovl-panel-h { font-family:'Archivo',sans-serif; font-weight:800; font-size: clamp(1.5rem,3vw,2.2rem); letter-spacing:-0.01em; text-transform:uppercase; margin: 12px 0 0; }
.ovl-panel-cap { color: var(--steel); font-size:0.96rem; line-height:1.55; margin: 14px 0 0; max-width: 560px; }
.ovl-pipe { margin-top: 34px; }
.ovl-pipe-io { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.ovl-io-label { font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.18em; color:var(--steel); text-transform:uppercase; display:block; margin-bottom:8px; }
.ovl-io-chip { font-family:'JetBrains Mono',monospace; font-size:0.82rem; letter-spacing:0.03em; padding:11px 15px; border-radius:4px; border:1px solid var(--steel-dim); background: rgba(255,255,255,0.02); color: var(--pale); }
.ovl-io-chip.out { border-color: var(--amber); color: var(--ink); background: var(--amber); box-shadow: 0 8px 26px var(--amber-glow); }
.ovl-arrow { color: var(--steel); font-size: 1.2rem; padding-bottom: 9px; }
.ovl-steps2 { display:flex; gap:10px; flex-wrap:wrap; margin-top: 28px; }
.ovl-step2 { flex:1 1 130px; display:flex; align-items:center; gap:11px; padding:14px 16px; border:1px solid var(--steel-dim); border-radius:4px; background: rgba(255,255,255,0.012); }
.ovl-step2-node { width:11px; height:11px; border-radius:50%; border:1.5px solid var(--steel); flex:none; animation: ovl-step-pulse 4s linear infinite; }
.ovl-step2-name { font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.05em; color:var(--steel); text-transform:uppercase; }
.ovl-er { width: 100%; margin-top: 30px; }
.ovl-er svg { width:100%; height:auto; display:block; overflow:visible; }
.er-box { fill: var(--bg); stroke: var(--steel-dim); stroke-width:1; }
.er-box.lease { stroke: rgba(244,162,60,0.55); }
.er-sep { stroke: var(--steel-dim); stroke-width:1; }
.er-title { font-family:'Archivo',sans-serif; font-weight:800; font-size:15px; fill: var(--pale); letter-spacing:0.04em; }
.er-field { font-family:'JetBrains Mono',monospace; font-size:12.5px; fill: var(--steel); }
.er-fk { fill: var(--amber); }
.er-table { opacity: 0; }
.er-link { fill:none; stroke: var(--steel); stroke-width:1.5; stroke-dasharray: 680; stroke-dashoffset: 680; opacity:0.45; }
.er-flow { fill:none; stroke: var(--amber); stroke-width:2; stroke-dasharray: 3 13; opacity:0; }
.er-newrow { fill: rgba(244,162,60,0.08); stroke: var(--amber); stroke-width:1.5; opacity: 0; }
.ovl-reveal.is-in .er-table { animation: ovl-fade 0.6s ease forwards; }
.ovl-reveal.is-in .er-link { animation: ovl-draw-line 1.1s ease forwards 0.4s; }
.ovl-reveal.is-in .er-flow { opacity: 0.9; animation: ovl-flow 1.3s linear infinite 1.5s; }
.ovl-reveal.is-in .er-newrow { animation: ovl-rowpulse 2.6s ease-in-out infinite 1.6s; }
/* ---------- phone journey ---------- */
.ovl-phone-sec { position:relative; z-index:4; padding: clamp(6rem,12vh,9.5rem) 0; background: var(--ink); contain: layout; overflow-anchor: none; }
.ovl-phone-wrap { display:grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items:center; }
.ovl-phone-stage { display:flex; justify-content:center; }
.ovl-phone { position:relative; width: 300px; max-width: 82vw; aspect-ratio: 300 / 620; background: #05080F; border-radius: 44px; box-shadow: 0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(134,147,171,0.18); padding: 12px; }
.ovl-phone-notch { position:absolute; top:12px; left:50%; transform:translateX(-50%); width:116px; height:22px; background:#05080F; border-radius:0 0 14px 14px; z-index:6; }
.ovl-phone-screen { position:absolute; inset:12px; border-radius:34px; background: var(--bg); overflow:hidden; }
.ovl-scr-top { display:flex; justify-content:space-between; align-items:center; padding: 16px 22px 0; font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.06em; color:var(--steel); }
.ovl-scr-brand { font-family:'Archivo',sans-serif; font-weight:900; letter-spacing:0.06em; color:var(--pale); font-size:0.64rem; }
.ovl-scr-dots { display:flex; gap:6px; justify-content:center; padding: 14px 0 0; }
.ovl-scr-dot { width:6px; height:6px; border-radius:50%; background:var(--steel-dim); transition: background .4s, width .4s; }
.ovl-scr-dot.on { background: var(--amber); width:16px; border-radius:3px; }
.ovl-panes { position:absolute; left:0; right:0; top:66px; bottom:0; overflow:hidden; overflow-anchor:none; }
.ovl-pane { position:absolute; inset:0; padding: 18px 22px 24px; opacity:0; transform: translateX(16px); transition: opacity .55s ease, transform .55s ease; display:flex; flex-direction:column; }
.ovl-pane.active { opacity:1; transform:none; }
.ovl-p-ey { font-family:'JetBrains Mono',monospace; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--amber); }
.ovl-p-h { font-family:'Archivo',sans-serif; font-weight:800; font-size:1.5rem; line-height:1.05; text-transform:uppercase; letter-spacing:-0.01em; margin: 12px 0 18px; color:var(--pale); }
.ovl-p-opt { display:flex; align-items:center; justify-content:space-between; padding:13px 15px; border:1px solid var(--steel-dim); border-radius:8px; margin-bottom:9px; font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--pale); }
.ovl-p-opt.sel { border-color:var(--amber); background: rgba(244,162,60,0.12); }
.ovl-p-opt .tick { color: var(--amber); }
.ovl-p-bay { font-family:'Archivo',sans-serif; font-weight:900; font-size:2.4rem; line-height:1; color:var(--pale); margin-top:4px; }
.ovl-p-meta { font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--steel); margin-top:10px; }
.ovl-p-baychip { margin: 18px 0; height: 80px; border:1px solid var(--amber); border-radius:8px; background: rgba(244,162,60,0.08); display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; color:var(--amber); font-size:0.64rem; letter-spacing:0.12em; }
.ovl-p-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--steel-dim); font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--pale); }
.ovl-p-row .tick { color:var(--amber); }
.ovl-p-prog { height:6px; border-radius:3px; background: var(--steel-dim); margin: 20px 0; overflow:hidden; }
.ovl-p-prog i { display:block; height:100%; width:100%; background:var(--amber); transform-origin:left; transform: scaleX(0); }
.ovl-pane.active .ovl-p-prog i { animation: ovl-prog 1.6s ease forwards; }
.ovl-p-btn { margin-top: auto; text-align:center; background:var(--amber); color:var(--ink); font-family:'Archivo',sans-serif; font-weight:800; font-size:0.82rem; text-transform:uppercase; padding:13px; border-radius:8px; }
.ovl-p-success-wrap { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:4px; }
.ovl-check { width:78px; height:78px; position:relative; margin-bottom:8px; }
.ovl-check svg { width:100%; height:100%; display:block; }
.ovl-check-ring { fill:none; stroke: rgba(244,162,60,0.4); stroke-width:2; }
.ovl-check-mark { fill:none; stroke:var(--amber); stroke-width:5; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:44; stroke-dashoffset:44; animation: ovl-draw-line .5s .15s ease forwards; }
.ovl-check-pulse { position:absolute; inset:0; border-radius:50%; border:2px solid var(--amber); animation: ovl-ring 1.1s ease-out forwards; }
.ovl-p-success { font-family:'Archivo',sans-serif; font-weight:900; font-size:1.5rem; text-transform:uppercase; color:var(--pale); margin-top:12px; }
.ovl-p-sub { font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--steel); }
.ovl-p-gate { margin-top:14px; font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.08em; color:var(--amber); border:1px solid var(--amber); border-radius:6px; padding:8px 14px; }
.ovl-live-dot { width:7px; height:7px; border-radius:50%; background:var(--amber); flex:none; animation: ovl-livedot 1.9s ease-out infinite; }
.ovl-panel-note { font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.14em; text-transform:uppercase; color:var(--steel); margin-top:18px; display:flex; align-items:center; gap:9px; }
.ovl-phone-home { position:absolute; bottom:9px; left:50%; transform:translateX(-50%); width:92px; height:4px; border-radius:2px; background: rgba(238,243,251,0.22); z-index:6; }
@keyframes ovl-rise { to { transform: translateY(0); } }
@keyframes ovl-fade { to { opacity: 1; } }
@keyframes ovl-draw { to { opacity: 1; transform: scale(1); } }
@keyframes ovl-sweep { 0% { top:-130px; } 50% { top:100%; } 100% { top:-130px; } }
@keyframes ovl-marq { to { transform: translateX(-50%); } }
@keyframes ovl-tag-in { from { opacity:0; transform: translateY(8px) scale(0.96); } to { opacity:1; transform:none; } }
@keyframes ovl-sweep2 { 0% { opacity:0; transform: translateX(-28%);} 28% { opacity:1;} 100% { opacity:0; transform: translateX(28%);} }
@keyframes ovl-lockpop { 0% { transform: scale(0.82);} 60% { transform: scale(1.06);} 100% { transform: scale(1);} }
@keyframes ovl-step-pulse { 0% { border-color:var(--steel); background:transparent; box-shadow:none; } 6% { border-color:var(--amber); background:var(--amber); box-shadow:0 0 12px var(--amber); } 16% { border-color:var(--steel); background:transparent; box-shadow:none; } 100% { border-color:var(--steel); } }
@keyframes ovl-draw-line { to { stroke-dashoffset: 0; } }
@keyframes ovl-flow { to { stroke-dashoffset: -32; } }
@keyframes ovl-rowpulse { 0%,100% { opacity:0; } 50% { opacity:0.9; } }
@keyframes ovl-prog { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes ovl-ring { from { transform: scale(0.5); opacity:0.65; } to { transform: scale(1.5); opacity:0; } }
@keyframes ovl-livedot { 0% { box-shadow: 0 0 0 0 rgba(244,162,60,0.55); } 70% { box-shadow: 0 0 0 7px rgba(244,162,60,0); } 100% { box-shadow: 0 0 0 0 rgba(244,162,60,0); } }

/* ---------- MOBILE: reflow the lot below the copy as a flat mini-map ---------- */
@media (max-width: 860px) {
  .ovl-hero { min-height: auto; }
  .ovl-hero-sky { order: 1; flex: initial; padding: 102px 0 4px; }
  .ovl-horizon { display: none; }
  .ovl-lot {
    order: 2; position: relative; left: auto; bottom: auto; transform: none;
    width: 100%; max-width: 540px; margin: 22px auto 0; perspective: none;
    -webkit-mask-image: none; mask-image: none;
  }
  .ovl-lot-inner { transform: none; }
  .ovl-bay { aspect-ratio: 1 / 1.3; }
  .ovl-scan { display: none; }
  .ovl-tag { position: static; display: inline-flex; margin-top: 16px; top: auto; right: auto; }
  .ovl-h1 { font-size: clamp(2.4rem, 10vw, 3.6rem); }
  .ovl-sub { margin: 20px 0 24px; }
  .ovl-cta-row .ovl-btn { flex: 1 1 auto; text-align: center; }
  .ovl-section { padding: clamp(4.5rem,10vh,6.5rem) 0; }
  .ovl-steps { grid-template-columns: repeat(2,1fr); margin-top: 40px; }
  .ovl-live { grid-template-columns: 1fr; gap: 38px; }
  .ovl-livegrid { padding: 16px; }
  .ovl-cards { grid-template-columns: 1fr; margin-top: 40px; }
  .ovl-sys { padding: clamp(4.5rem,10vh,6.5rem) 0; }
  .ovl-phone-wrap { grid-template-columns: 1fr; gap: 40px; }
  .ovl-phone-sec { padding: clamp(4.5rem,10vh,6.5rem) 0; }
  .ovl-closer { padding: clamp(5rem,11vh,7rem) 0; }
}
@media (max-width: 520px) {
  .ovl-wrap { padding: 0 20px; }
  .ovl-steps { grid-template-columns: 1fr; }
  .ovl-h1 { font-size: clamp(2.2rem, 12vw, 3rem); }
  .ovl-stats { gap: 16px; row-gap: 10px; }
  .ovl-nav-row { padding: 14px 0; }
  .ovl-nav-cta { display: none; }
  .ovl-nav .ovl-mark { font-size: 1rem; }
  .ovl-logo-mark { width: 26px; height: 26px; }
  .ovl-nav-btn { padding: 9px 14px; font-size: 0.68rem; }
  .ovl-trust-row { flex-direction: column; align-items: flex-start; gap: 14px; }
  .ovl-trust-list { gap: 14px; overflow-x: auto; flex-wrap: nowrap; width: 100%; padding-bottom: 2px; -webkit-overflow-scrolling: touch; }
  .ovl-trust-item { font-size: 0.66rem; }
  .ovl-foot { padding: 30px 0; }
  .ovl-foot-base { flex-direction: column; align-items: flex-start; gap: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .ovl-h1 .ln span, .ovl-sub, .ovl-cta-row, .ovl-chips, .ovl-stats, .ovl-bay, .ovl-tag, .ovl-bay.match, .ovl-bay.match::after, .ovl-reticle span, .ovl-sweep2 { animation: none !important; opacity:1 !important; transform:none !important; }
  .ovl-scan, .ovl-ticker-track, .ovl-step2-node { animation: none !important; }
  .ovl-reveal { opacity:1 !important; transform:none !important; }
  .er-table { opacity:1 !important; }
  .er-link { stroke-dashoffset:0 !important; animation:none !important; }
  .er-flow, .er-newrow { animation:none !important; opacity:0 !important; }
  .ovl-pane { transition:none !important; }
  .ovl-pane.active .ovl-p-prog i { animation:none !important; transform: scaleX(1) !important; }
  .ovl-check-mark { stroke-dashoffset:0 !important; animation:none !important; }
  .ovl-check-pulse { animation:none !important; opacity:0 !important; }
  .ovl-scr-dot { transition:none !important; }
  .ovl-live-dot { animation:none !important; }
}
`;

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="29" rx="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 21 L13 13 L17 17.5 L25 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="25" cy="9" r="2.1" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.2 10.3 L8.7 12.8 L13.8 7.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TRUST_BADGES = [
  "Insured & bonded",
  "24/7 gated access",
  "HD video surveillance",
  "Lit lanes, concrete pads",
  "Month-to-month leases",
];

const occHero = (i) => ((i * 7 + (i % 6) * 5 + (i % 4)) % 10) < 6;
const wideHero = (i) => i % 9 === 3;
const LETTERS = "ABCDEFGHIJKLMN";
const DIMS = ["10×20", "10×30", "12×35", "12×40", "12×45", "14×50"];

const ITEMS = {
  Boat:    { pool: ["12×35", "12×40", "14×50"], wide: true },
  RV:      { pool: ["12×40", "12×45", "14×50"], wide: true },
  Trailer: { pool: ["10×20", "10×30", "12×35"], wide: false },
  Vehicle: { pool: ["10×20", "10×30"],          wide: false },
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];

const colsForWidth = (w) => (w <= 520 ? 6 : w <= 860 ? 8 : 10);
const rowsForCols = (c) => (c <= 6 ? 4 : 5);

const makeMatch = (c, r, exclude = -1, pool = DIMS, preferWide = false) => {
  const open = [];
  for (let i = 0; i < c * r; i++) if (!occHero(i) && i !== exclude) open.push(i);
  const wide = open.filter((i) => wideHero(i));
  const from = preferWide && wide.length ? wide : open;
  const idx = from.length ? pick(from) : 0;
  const col = idx % c, row = Math.floor(idx / c);
  return { index: idx, code: `${LETTERS[col]}-${String(row * c + col).padStart(2, "0")}`, dims: pick(pool) };
};

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current ? ref.current.querySelectorAll(".ovl-reveal") : [];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-in"); }),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function CountUp({ target }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf, started = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          if (reduce) { setVal(target); return; }
          const t0 = performance.now(), dur = 1300;
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target]);
  return <span ref={ref}>{val}</span>;
}

const buildLive = (c, r) => Array.from({ length: c * r }, (_, i) => (((i * 5 + (i % 7)) % 10) < 7 ? "occ" : "open"));

function LiveGrid() {
  const initCols = () => (typeof window !== "undefined" && window.innerWidth <= 860 ? 9 : 14);
  const ROWS = 6;
  const [cols, setCols] = useState(initCols);
  const [cells, setCells] = useState(() => buildLive(initCols(), ROWS));
  useEffect(() => {
    const apply = () => setCols((p) => { const n = initCols(); return p === n ? p : n; });
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  useEffect(() => { setCells(buildLive(cols, ROWS)); }, [cols]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const total = cols * ROWS;
    const id = setInterval(() => {
      setCells((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * total);
        next[i] = next[i] === "occ" ? "open" : (Math.random() > 0.5 ? "res" : "occ");
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [cols]);
  return (
    <div className="ovl-livegrid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {cells.map((s, i) => (
        <div key={i} className={`ovl-cell ${s === "occ" ? "occ" : s === "res" ? "res" : ""}`} />
      ))}
    </div>
  );
}

const TICKER = [
  ["B-12", "MATCHED", true], ["C-04", "OPEN", false], ["A-19", "RESERVED", false],
  ["D-31", "OPEN", false], ["F-07", "OCCUPIED", false], ["E-22", "OPEN", false],
  ["G-15", "MATCHED", true], ["H-09", "OPEN", false], ["B-28", "OCCUPIED", false],
];

const ENGINE_CASES = [
  { in: "BOAT · 32 ft", out: "BAY C-07 · 14×50" },
  { in: "RV · 38 ft", out: "BAY A-12 · 12×45" },
  { in: "TRAILER · 18 ft", out: "BAY D-03 · 10×30" },
  { in: "VEHICLE · 14 ft", out: "BAY B-21 · 10×20" },
];
const STAGES = ["Intake", "Classify", "Availability", "Best fit", "Assign"];

function MatchEngine() {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setK((p) => (p + 1) % ENGINE_CASES.length), 4000);
    return () => clearInterval(id);
  }, []);
  const c = ENGINE_CASES[k];
  return (
    <div className="ovl-pipe">
      <div className="ovl-pipe-io">
        <div>
          <span className="ovl-io-label">Request</span>
          <div className="ovl-io-chip" key={`in-${k}`}>{c.in}</div>
        </div>
        <div className="ovl-arrow">→</div>
        <div>
          <span className="ovl-io-label">Assigned</span>
          <div className="ovl-io-chip out ovl-tag-enter" key={`out-${k}`}>{c.out}</div>
        </div>
      </div>
      <div className="ovl-steps2">
        {STAGES.map((s, i) => (
          <div className="ovl-step2" key={s}>
            <span className="ovl-step2-node" style={{ animationDelay: `${i * 0.6}s` }} />
            <span className="ovl-step2-name">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataModel() {
  const tbl = (x, y, title, fields, lease) => {
    const h = 70 + (fields.length - 1) * 27 + 18;
    return (
      <g className="er-table" style={{ animationDelay: lease ? "0.15s" : "0s" }}>
        <rect className={`er-box ${lease ? "lease" : ""}`} x={x} y={y} width="240" height={h} rx="6" />
        <text className="er-title" x={x + 20} y={y + 30}>{title}</text>
        <line className="er-sep" x1={x + 14} y1={y + 44} x2={x + 226} y2={y + 44} />
        {fields.map((f, i) => (
          <text key={i} className={`er-field ${f.fk ? "er-fk" : ""}`} x={x + 20} y={y + 70 + i * 27}>{f.t}</text>
        ))}
      </g>
    );
  };
  return (
    <div className="ovl-er ovl-reveal">
      <svg viewBox="0 0 900 540" role="img" aria-label="Database schema: customers, units, leases and payments, related by foreign keys">
        <path className="er-link" d="M330,347 C250,347 210,250 160,204" />
        <path className="er-link" d="M570,374 C660,374 690,300 740,232" />
        <path className="er-link" d="M570,415 C595,415 600,432 620,435" />
        <path className="er-flow" d="M330,347 C250,347 210,250 160,204" />
        <path className="er-flow" d="M570,374 C660,374 690,300 740,232" />
        <path className="er-flow" d="M570,415 C595,415 600,432 620,435" />
        {tbl(40, 50, "CUSTOMERS", [{ t: "id" }, { t: "full_name" }, { t: "phone" }, { t: "email" }])}
        {tbl(620, 50, "UNITS", [{ t: "id" }, { t: "label" }, { t: "size_class" }, { t: "status" }, { t: "price" }])}
        {tbl(330, 250, "LEASES", [{ t: "id" }, { t: "customer_id →", fk: true }, { t: "unit_id →", fk: true }, { t: "start_date" }, { t: "status" }], true)}
        {tbl(620, 340, "PAYMENTS", [{ t: "id" }, { t: "lease_id →", fk: true }, { t: "amount" }, { t: "method" }])}
        <rect className="er-newrow" x="340" y="410" width="220" height="24" rx="3" />
      </svg>
    </div>
  );
}

function PhoneFlow() {
  const [s, setS] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setS(3); return; }
    const id = setInterval(() => {
      setS((p) => { const n = (p + 1) % 4; if (n === 3) setRun((r) => r + 1); return n; });
    }, 2400);
    return () => clearInterval(id);
  }, []);
  const pane = (i) => `ovl-pane ${s === i ? "active" : ""}`;
  return (
    <div className="ovl-phone-stage ovl-reveal">
      <div className="ovl-phone">
        <div className="ovl-phone-notch" />
        <div className="ovl-phone-screen">
          <div className="ovl-scr-top"><span>9:41</span><span className="ovl-scr-brand">OVERLAND</span><span>5G</span></div>
          <div className="ovl-scr-dots">{[0, 1, 2, 3].map((i) => <span key={i} className={`ovl-scr-dot ${s === i ? "on" : ""}`} />)}</div>
          <div className="ovl-panes">
            <div className={pane(0)}>
              <div className="ovl-p-ey">Step 1 · Find</div>
              <div className="ovl-p-h">What are you<br />storing?</div>
              <div className="ovl-p-opt"><span>Boat</span></div>
              <div className="ovl-p-opt sel"><span>RV · 38 ft</span><span className="tick">✓</span></div>
              <div className="ovl-p-opt"><span>Trailer</span></div>
              <div className="ovl-p-opt"><span>Vehicle</span></div>
            </div>
            <div className={pane(1)}>
              <div className="ovl-p-ey">Step 2 · Matched</div>
              <div className="ovl-p-bay">Bay A-12</div>
              <div className="ovl-p-meta">12×45 · $145 / mo</div>
              <div className="ovl-p-baychip">YOUR BAY · DRIVE-UP ACCESS</div>
              <div className="ovl-p-btn">Hold this bay</div>
            </div>
            <div className={pane(2)}>
              <div className="ovl-p-ey">Step 3 · Set up</div>
              <div className="ovl-p-row"><span>Your details</span><span className="tick">✓</span></div>
              <div className="ovl-p-row"><span>Lease terms</span><span className="tick">✓</span></div>
              <div className="ovl-p-row"><span>Payment</span><span className="tick">✓</span></div>
              <div className="ovl-p-prog"><i /></div>
              <div className="ovl-p-btn">Confirm &amp; pay</div>
            </div>
            <div className={pane(3)}>
              <div className="ovl-p-success-wrap">
                {s === 3 && (
                  <div className="ovl-check" key={run}>
                    <div className="ovl-check-pulse" />
                    <svg viewBox="0 0 64 64"><circle className="ovl-check-ring" cx="32" cy="32" r="28" /><path className="ovl-check-mark" d="M20 33 L29 42 L45 24" /></svg>
                  </div>
                )}
                <div className="ovl-p-success">You're all set</div>
                <div className="ovl-p-sub">Bay A-12 is yours</div>
                <div className="ovl-p-gate">GATE CODE · 4417</div>
              </div>
            </div>
          </div>
          <div className="ovl-phone-home" />
        </div>
      </div>
    </div>
  );
}

export default function OverlandTeaser() {
  const root = useReveal();
  const initCols = () => (typeof window !== "undefined" ? colsForWidth(window.innerWidth) : 10);
  const [cols, setCols] = useState(initCols);
  const rows = rowsForCols(cols);
  const colsRef = useRef(cols); colsRef.current = cols;
  const timers = useRef([]);
  const [match, setMatch] = useState(() => ({ ...makeMatch(initCols(), rowsForCols(initCols())), item: null }));
  const matchRef = useRef(match); matchRef.current = match;
  const [item, setItem] = useState(null);
  const [scanning, setScanning] = useState(false);

  const runMatch = (itemKey = null) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setItem(itemKey);
    setScanning(true);
    const t = setTimeout(() => {
      const c = colsRef.current, r = rowsForCols(c);
      const cfg = itemKey ? ITEMS[itemKey] : null;
      const m = makeMatch(c, r, matchRef.current.index, cfg ? cfg.pool : DIMS, cfg ? cfg.wide : false);
      setMatch({ ...m, item: itemKey });
      setScanning(false);
    }, 750);
    timers.current.push(t);
  };

  const toFlow = () => {
    const el = document.getElementById("ovl-flow");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // track viewport -> column count
  useEffect(() => {
    const apply = () => setCols((p) => { const n = colsForWidth(window.innerWidth); return p === n ? p : n; });
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // keep the match valid whenever the grid resizes
  useEffect(() => { setMatch({ ...makeMatch(cols, rowsForCols(cols)), item: null }); setItem(null); setScanning(false); }, [cols]);

  // opening flourish: scan + lock
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(runMatch, 1700);
    timers.current.push(t);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line
  }, []);

  const heroBays = Array.from({ length: cols * rows }, (_, i) => i);

  return (
    <div className="ovl" ref={root}>
      <style>{CSS}</style>
      <div className="ovl-grain" />
      <div className="ovl-glow" style={{ width: 620, height: 620, top: "18%", left: "-8%", background: "rgba(40,70,130,0.35)" }} />
      <div className="ovl-glow" style={{ width: 560, height: 560, bottom: "-6%", right: "-6%", background: "var(--amber-glow)" }} />

      {/* HERO */}
      <section className="ovl-hero">
        <nav className="ovl-nav">
          <div className="ovl-wrap ovl-nav-row">
            <div className="ovl-brand">
              <span className="ovl-logo-mark"><LogoMark /></span>
              <span className="ovl-mark">OVERLAND</span>
            </div>
            <div className="ovl-nav-right">
              <div className="ovl-nav-cta"><span className="ovl-live-dot" />Outdoor storage · live</div>
              <button className="ovl-btn ovl-btn-primary ovl-nav-btn">Reserve a bay</button>
            </div>
          </div>
        </nav>

        <div className="ovl-horizon" />
        <div className={`ovl-lot ${scanning ? "is-scanning" : ""}`}>
          <div className="ovl-lot-inner">
            <div className="ovl-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {heroBays.map((i) => {
                const isMatch = !scanning && i === match.index;
                const occ = occHero(i) && !isMatch;
                const cls = ["ovl-bay", occ ? "occ" : "", wideHero(i) ? "wide" : "", isMatch ? "match" : ""].join(" ");
                return (
                  <div key={i} className={cls} style={{ animationDelay: `${0.25 + i * 0.012}s` }}>
                    {isMatch && (
                      <div className="ovl-reticle" key={match.code}>
                        <span className="tl" /><span className="tr" /><span className="bl" /><span className="br" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="ovl-sweep2" />
          </div>
          <div className="ovl-scan" />
          <div className={`ovl-tag ovl-tag-enter ${scanning ? "scan" : ""}`} key={scanning ? "scan" : `${match.item || ""}${match.code}`}>
            {scanning ? "SCANNING YARD..." : `${match.item ? match.item.toUpperCase() + " · " : ""}BAY ${match.code} · ${match.dims} · MATCHED`}
          </div>
        </div>

        <div className="ovl-hero-sky">
          <div className="ovl-wrap">
            <div className="ovl-eyebrow">OVERLAND · OUTDOOR STORAGE</div>
            <h1 className="ovl-h1 ovl-display">
              <span className="ln"><span>A yard for</span></span>
              <span className="ln"><span>what moves you.</span></span>
            </h1>
            <p className="ovl-sub">
              Boats, RVs, trailers, equipment... matched to an open bay the moment you scan
              the gate. Sign and pay from your phone, before you've even pulled in.
            </p>
            <div className="ovl-cta-row">
              <button className="ovl-btn ovl-btn-primary">Reserve a bay</button>
              <button className="ovl-btn ovl-btn-ghost" onClick={toFlow}>See how it works</button>
            </div>
            <div className="ovl-chips">
              <span className="lbl">Match a bay</span>
              {Object.keys(ITEMS).map((k) => (
                <button key={k} className={`ovl-chip ${item === k ? "active" : ""}`} aria-pressed={item === k} onClick={() => runMatch(k)}>{k}</button>
              ))}
            </div>
            <div className="ovl-stats">
              <div><b>24</b> ACRES</div>
              <div><b>147</b> BAYS</div>
              <div>GATE <b>24/7</b></div>
              <div>STATUS <b>LIVE</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ovl-ticker">
        <div className="ovl-ticker-track">
          {[...TICKER, ...TICKER].map(([code, st, hot], i) => (
            <span key={i} className={hot ? "hot" : ""}>{code} · {st}</span>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div className="ovl-trust">
        <div className="ovl-wrap ovl-trust-row">
          <div className="ovl-trust-list">
            {TRUST_BADGES.map((b) => (
              <span className="ovl-trust-item" key={b}><CheckIcon />{b}</span>
            ))}
          </div>
          <div className="ovl-trust-rating"><b>4.9★</b> from 200+ renters</div>
        </div>
      </div>

      {/* FLOW */}
      <section className="ovl-section" id="ovl-flow">
        <div className="ovl-wrap">
          <div className="ovl-reveal">
            <div className="ovl-eyebrow">How it works</div>
            <h2 className="ovl-shead">Four steps. No office.<br />No paperwork.</h2>
          </div>
          <div className="ovl-steps">
            {[
              ["01 · Scan", "Scan", "Point your phone at the code on the gate. No app store, no download... the whole thing opens in your browser."],
              ["02 · Match", "Match", "Tell us what you're storing and how big. We size it and assign the right open bay automatically."],
              ["03 · Sign", "Sign", "Read the lease terms and tap to agree. Date and identity captured, no printer required."],
              ["04 · Park", "Park", "Pay from your phone and pull in. Your bay is held the second you confirm."],
            ].map(([n, t, p], idx) => (
              <div className="ovl-step ovl-reveal" key={t} style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className="n ovl-mono">{n}</div>
                <h4>{t}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE YARD */}
      <section className="ovl-section" style={{ background: "var(--ink)" }}>
        <div className="ovl-wrap ovl-live">
          <div className="ovl-reveal">
            <div className="ovl-eyebrow">The yard, live</div>
            <h2 className="ovl-shead" style={{ marginBottom: 28 }}>Know every bay,<br />in real time.</h2>
            <div className="ovl-count">
              <CountUp target={147} /> <span style={{ color: "var(--steel)", fontSize: "0.5em" }}>bays</span><br />
              <span className="open"><CountUp target={23} /> open</span> tonight
              <span className="lbl">Occupied, reserved, open... one screen</span>
            </div>
            <p style={{ color: "var(--steel)", marginTop: 26, maxWidth: 380, lineHeight: 1.55 }}>
              Watch a bay turn over the moment it does. Every submission, every status,
              every customer... managed without a clipboard.
            </p>
          </div>
          <div className="ovl-reveal">
            <LiveGrid />
            <div className="ovl-legend">
              <span><i className="ovl-dot" style={{ background: "rgba(134,147,171,0.12)" }} />Occupied</span>
              <span><i className="ovl-dot" style={{ background: "rgba(244,162,60,0.16)", borderColor: "var(--amber)" }} />Reserved</span>
              <span><i className="ovl-dot" />Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITY */}
      <section className="ovl-section">
        <div className="ovl-wrap">
          <div className="ovl-reveal">
            <div className="ovl-eyebrow">Why Overland</div>
            <h2 className="ovl-shead">Built to run itself.</h2>
            <p className="ovl-sys-intro">Three jobs the system handles on its own, so your staff never touches a clipboard.</p>
          </div>
          <div className="ovl-cards">
            {[
              ["⟶ matching", "Instant matching", "The right bay for the right rig, picked automatically by size and what's open. No guesswork at the gate."],
              ["⟶ leasing", "Phone-first leasing", "Sign and pay without a single sheet of paper or a trip to the office. The lease lives where the customer is."],
              ["⟶ control", "One screen, one lot", "Every submission, every bay, every customer... run the whole yard from one dashboard."],
            ].map(([k, t, p], idx) => (
              <div className="ovl-card ovl-reveal" key={t} style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className="k">{k}</div>
                <h4>{t}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM */}
      <section className="ovl-sys">
        <div className="ovl-wrap">
          <div className="ovl-sys-head ovl-reveal">
            <div className="ovl-eyebrow">Under the hood</div>
            <h2 className="ovl-shead">The system behind the screen.</h2>
            <p className="ovl-sys-intro">The interface is the easy part. The value is underneath... a matching engine that places every rig by size and availability, and a data model that keeps every unit, lease and payment in sync.</p>
          </div>

          <div className="ovl-panel ovl-reveal">
            <div className="ovl-panel-tag">01 · The match engine</div>
            <h3 className="ovl-panel-h">Size in, bay out.</h3>
            <p className="ovl-panel-cap">Every request runs the same four rules... class it, check what's open, find the nearest fit, assign. No clipboard, no double-booking.</p>
            <MatchEngine />
            <div className="ovl-panel-note"><span className="ovl-live-dot" />Live · cycling real request types</div>
          </div>

          <div className="ovl-panel ovl-reveal">
            <div className="ovl-panel-tag">02 · The data model</div>
            <h3 className="ovl-panel-h">Four tables. One source of truth.</h3>
            <p className="ovl-panel-cap">Units, customers, leases and payments... related, not retyped. One lease ties a customer to a unit and its payment, and the live yard reads straight from it.</p>
            <DataModel />
            <div className="ovl-panel-note"><span className="ovl-live-dot" />Live · foreign keys resolving in real time</div>
          </div>
        </div>
      </section>

      {/* PHONE JOURNEY */}
      <section className="ovl-phone-sec">
        <div className="ovl-wrap ovl-phone-wrap">
          <div className="ovl-phone-copy ovl-reveal">
            <div className="ovl-eyebrow">The customer's view</div>
            <h2 className="ovl-shead">From scan to set up,<br />in a minute.</h2>
            <p className="ovl-sys-intro">This is what your customer feels... pick what they're storing, get matched to a bay, sign and pay, and pull straight in. No office, no callback, no paperwork. Just a gate code and a spot that's theirs.</p>
          </div>
          <PhoneFlow />
        </div>
      </section>

      {/* CLOSER */}
      <section className="ovl-closer">
        <div className="ovl-glow" style={{ width: 700, height: 500, bottom: "0%", left: "50%", transform: "translateX(-50%)", background: "var(--amber-glow)" }} />
        <div className="ovl-wrap ovl-reveal" style={{ position: "relative", zIndex: 3 }}>
          <div className="ovl-eyebrow" style={{ marginBottom: 22 }}>The real product</div>
          <h2>The page is the demo.<br />The system is the product.</h2>
          <p className="ovl-closer-sub">A front end this clean is step one. The matching engine, the data model and the admin dashboard underneath it are the real build... and that part is ready when you are.</p>
          <div style={{ marginTop: 40 }}>
            <a className="ovl-btn ovl-btn-primary" style={{ fontSize: "1rem", padding: "18px 38px", textDecoration: "none" }} href="mailto:you@yourstudio.com">Want to build the real thing? →</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ovl-foot">
        <div className="ovl-wrap ovl-foot-base">
          <div className="ovl-mark">OVERLAND</div>
          <div className="ovl-foot-meta">Working prototype · built by [your name] · 2026</div>
        </div>
      </footer>
    </div>
  );
}
