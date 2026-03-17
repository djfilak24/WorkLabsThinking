import { useState, useEffect, useRef } from "react";

const LOGO = "https://nelsonworldwide.com/wp-content/uploads/2020/01/nelson-logo-light.svg";
const BLUE = "#00BADC";
const GOLD = "#c8922a";

const ARTICLES = [
  { id:1, title:"Avoiding the Eye Roll: How to Make the Case for Workplace Change", category:"Workplace Strategy", author:"Dave", city:"Minneapolis", prospectType:"Owner", date:"Mar 2025", excerpt:"The hardest room in any repositioning project isn't the one you're designing. It's the boardroom where you have to explain why.", featured:true, readTime:"8 min", accent:GOLD },
  { id:2, title:"The Agile Repositioning Sprint: A Six-Week Path to Clarity", category:"Asset Repositioning", author:"Dave", city:"Chicago", prospectType:"Broker", date:"Feb 2025", excerpt:"Fixed-fee. Time-boxed. Built to move faster than the market.", featured:false, readTime:"5 min", accent:"#a8956e" },
  { id:3, title:"AI on the Floor: What Workplace Strategists Actually Need to Know", category:"AI + Work", author:"Jeff", city:"New York", prospectType:"Tenant", date:"Feb 2025", excerpt:"The tools are changing. The questions we should be asking aren't.", featured:false, readTime:"6 min", accent:BLUE },
  { id:4, title:"Culture Isn't a Perk. It's a Space Problem.", category:"Culture + Change", author:"Jeff", city:"Minneapolis", prospectType:"Tenant", date:"Jan 2025", excerpt:"When belonging breaks down, the fix usually isn't a ping-pong table.", featured:false, readTime:"7 min", accent:"#b8a090" },
  { id:5, title:"Programming by Instinct vs. Programming by Data", category:"Workplace Strategy", author:"Dave", city:"Chicago", prospectType:"Owner", date:"Jan 2025", excerpt:"Most workplace programs are built on gut feel dressed up as research.", featured:false, readTime:"9 min", accent:GOLD },
  { id:6, title:"The Broker's View: What Asset Owners Are Missing in 2025", category:"Asset Repositioning", author:"Jeff", city:"New York", prospectType:"Broker", date:"Mar 2025", excerpt:"Capital markets are repricing. The buildings that survive will have a story to tell.", featured:false, readTime:"6 min", accent:"#a8956e" },
];

const VOTE_OPTIONS = [
  { id:"a", label:"AI tools for workplace planning", votes:142 },
  { id:"b", label:"Asset repositioning case studies", votes:98 },
  { id:"c", label:"Culture + change management", votes:76 },
  { id:"d", label:"Programming calculators & tools", votes:115 },
  { id:"e", label:"Future of the office predictions", votes:189 },
];

const METRICS = [
  { value:"6", label:"Published Insights", sub:"and growing" },
  { value:"4", label:"Practice Areas", sub:"covered" },
  { value:"2", label:"Authors", sub:"practitioners" },
  { value:"620+", label:"Reader Signals", sub:"collected" },
];

const TESTIMONIALS = [
  { quote:"This reframed how I walked into a board presentation. We got the green light.", attr:"VP Real Estate, Fortune 500", tag:"Workplace Strategy" },
  { quote:"The Sprint Brief helped us scope a project in one meeting. First time that's ever happened.", attr:"Principal Broker, Chicago", tag:"Asset Repositioning" },
  { quote:"I sent 'Culture Isn't a Perk' to our CEO. She read it twice.", attr:"Head of People, Tech Co.", tag:"Culture + Change" },
  { quote:"Finally someone writing about AI in design that isn't theoretical.", attr:"Director of CRE, Minneapolis", tag:"AI + Work" },
];

const CONTENT_SERIES = [
  { key:"published", label:"Published", color:BLUE, data:[0.9,0.7,1.0,0.8,0.85,0.75] },
  { key:"inprogress", label:"In Progress", color:GOLD, data:[0.4,0.6,0.3,0.7,0.5,0.4] },
  { key:"planned", label:"Coming Soon", color:"rgba(240,235,227,0.3)", data:[0.6,0.8,0.5,0.9,0.7,0.6] },
];
const RADAR_DIMS = ["Workplace Strategy","AI + Work","Asset Reposition.","Culture + Change","Tools","Case Studies"];
const TRAJECTORY = [
  {month:"Sep",signals:0},{month:"Oct",signals:18},{month:"Nov",signals:34},
  {month:"Dec",signals:67},{month:"Jan",signals:142},{month:"Feb",signals:390},{month:"Mar",signals:620},
];
const THEMES = ["People","Space","Technology","Culture","Strategy"];
const STATUS_WORDS = ["Synthesizing","Reframing","Questioning","Mapping","Observing","Prototyping","Iterating","Validating","Challenging","Calibrating","Rethinking","Sensing","Connecting","Translating","Provoking"];
const FILTER_DIMS = [
  { key:"author", label:"Author", options:["Dave","Jeff"] },
  { key:"category", label:"Topic", options:["Workplace Strategy","AI + Work","Asset Repositioning","Culture + Change"] },
  { key:"city", label:"City", options:["Minneapolis","Chicago","New York"] },
  { key:"prospectType", label:"Prospect Type", options:["Owner","Broker","Tenant"] },
];
const AUTHOR_COLORS = {
  Dave: { bg:"linear-gradient(135deg,#c8922a,#a8720a)", text:"#141414" },
  Jeff: { bg:"linear-gradient(135deg,#00BADC,#0090b0)", text:"#fff" },
};

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function cr(y) { return "\u00A9 " + y + " NELSON Worldwide"; }

function AuthorAvatar({ author, size }) {
  const s = size || 22;
  const c = AUTHOR_COLORS[author] || { bg:"#333", text:"#fff" };
  return (
    <div style={{ width:s, height:s, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:s*0.42, fontWeight:700, color:c.text, flexShrink:0 }}>
      {author[0]}
    </div>
  );
}

function getBgPattern(color, idx) {
  const s = { position:"absolute", inset:0, pointerEvents:"none", width:"100%", height:"100%" };
  if (idx % 3 === 0) return (
    <svg style={{...s, opacity:0.13}} viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <g fill={color}>{[0,1,2,3,4,5].flatMap(r => [0,1,2,3,4].map(c => <circle key={r+"-"+c} cx={20+c*40} cy={20+r*40} r="2"/>))}</g>
    </svg>
  );
  if (idx % 3 === 1) return (
    <svg style={{...s, opacity:0.1}} viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <line key={i} x1={-20+i*30} y1="0" x2={-20+i*30+80} y2="260" stroke={color} strokeWidth="1"/>)}
    </svg>
  );
  return (
    <svg style={{...s, opacity:0.1}} viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      {[10,30,50,70,90].map(o => <rect key={o} x={o} y={o} width={200-o*2} height={260-o*2} fill="none" stroke={color} strokeWidth="1"/>)}
    </svg>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"32px" }}>
      <div style={{ width:"3px", height:"16px", background:BLUE, borderRadius:"2px" }}/>
      <span style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.2em", color:"rgba(240,235,227,0.22)", textTransform:"uppercase" }}>{text}</span>
      <div style={{ flex:1, height:"1px", background:"rgba(240,235,227,0.05)" }}/>
    </div>
  );
}

function BlinkCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => { const iv = setInterval(() => setOn(p => !p), 520); return () => clearInterval(iv); }, []);
  return <span style={{ opacity:on?1:0, color:BLUE, fontWeight:300, marginLeft:"1px" }}>|</span>;
}

function StatusCycler() {
  const [displayed, setDisplayed] = useState("");
  const wi = useRef(0); const ci = useRef(0); const ph = useRef("typing"); const tm = useRef(null);
  useEffect(() => {
    const tick = () => {
      const word = STATUS_WORDS[wi.current];
      if (ph.current === "typing") {
        ci.current++; setDisplayed(word.slice(0, ci.current));
        if (ci.current < word.length) { tm.current = setTimeout(tick, 68); }
        else { ph.current = "pause"; tm.current = setTimeout(tick, 1400); }
      } else if (ph.current === "pause") {
        ph.current = "erasing"; tm.current = setTimeout(tick, 50);
      } else {
        ci.current--; setDisplayed(word.slice(0, ci.current));
        if (ci.current > 0) { tm.current = setTimeout(tick, 38); }
        else { wi.current = (wi.current+1) % STATUS_WORDS.length; ph.current = "typing"; tm.current = setTimeout(tick, 200); }
      }
    };
    tm.current = setTimeout(tick, 600);
    return () => clearTimeout(tm.current);
  }, []);
  return (
    <span style={{ fontSize:"11px", fontWeight:500, letterSpacing:"0.06em", color:"rgba(240,235,227,0.55)", minWidth:"100px", display:"inline-flex", alignItems:"center" }}>
      {displayed}<BlinkCursor/>
    </span>
  );
}

function TickerTrack({ articles, reverse }) {
  const trackRef = useRef(null); const rafRef = useRef(null);
  const posRef = useRef(0); const pausedRef = useRef(false); const halfRef = useRef(0);
  const spd = reverse ? 28 : 36;
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    Array.from(track.children).forEach(c => track.appendChild(c.cloneNode(true)));
    halfRef.current = track.scrollWidth / 2;
    posRef.current = reverse ? 0 : -halfRef.current;
    let last = null;
    const step = ts => {
      if (last !== null && !pausedRef.current) {
        const px = spd*(ts-last)/1000;
        if (reverse) { posRef.current -= px; if (posRef.current < -halfRef.current) posRef.current += halfRef.current; }
        else { posRef.current += px; if (posRef.current > 0) posRef.current = -halfRef.current; }
        track.style.transform = "translateX(" + posRef.current + "px)";
      }
      last = ts; rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reverse, spd]);
  return (
    <div style={{ overflow:"hidden", width:"100%" }} onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }}>
      <div ref={trackRef} style={{ display:"flex", gap:"14px", width:"max-content", willChange:"transform" }}>
        {articles.map((a, i) => <TickerCard key={a.id} article={a} idx={i}/>)}
      </div>
    </div>
  );
}

function TickerCard({ article, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:"210px", height:"280px", flexShrink:0, position:"relative", background:hov?"#1a1815":"#161310", border:"1px solid "+(hov?article.accent+"60":"rgba(240,235,227,0.07)"), overflow:"hidden", cursor:"pointer", transition:"all 0.3s", transform:hov?"translateY(-5px)":"none", boxShadow:hov?"0 16px 36px rgba(0,0,0,0.5)":"none" }}>
      {getBgPattern(article.accent, idx)}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 70%, "+article.accent+"15 0%, transparent 60%)" }}/>
      {hov ? (
        <div style={{ position:"absolute", inset:0, background:"rgba(14,12,10,0.94)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"20px" }}>
          <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.16em", color:article.accent, textTransform:"uppercase", border:"1px solid "+article.accent+"40", padding:"2px 7px", alignSelf:"flex-start", marginBottom:"11px" }}>{article.category}</span>
          <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"13px", lineHeight:1.4, color:"#f0ebe3", marginBottom:"9px" }}>{article.title}</p>
          <p style={{ fontSize:"11px", lineHeight:1.6, color:"rgba(240,235,227,0.48)", marginBottom:"13px", fontWeight:300 }}>{article.excerpt}</p>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <AuthorAvatar author={article.author} size={18}/>
            <span style={{ fontSize:"10px", color:article.accent }}>{article.author+" \u00B7 Read "+article.readTime+" \u2192"}</span>
          </div>
        </div>
      ) : (
        <div style={{ position:"relative", height:"100%", display:"flex", flexDirection:"column", padding:"16px" }}>
          <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.14em", color:article.accent, textTransform:"uppercase", border:"1px solid "+article.accent+"40", padding:"2px 7px", alignSelf:"flex-start" }}>{article.category}</span>
          <div style={{ marginTop:"auto" }}>
            <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"13px", lineHeight:1.35, color:"#f0ebe3", marginBottom:"9px" }}>{article.title}</p>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <AuthorAvatar author={article.author} size={16}/>
              <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.38)" }}>{article.author+" \u00B7 "+article.date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TOOL VISUAL ──
function ToolVisual({ type, active, large }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) { setTick(0); return; }
    const iv = setInterval(() => setTick(p => p+1), 80);
    return () => clearInterval(iv);
  }, [active]);

  if (type === "calculator") {
    const bars = [0.4,0.65,0.5,0.85,0.7,0.55,0.9,0.6];
    const depts = ["Exec","Sales","Eng","Ops","HR","Mktg","IT","Legal"];
    return (
      <svg viewBox="0 0 120 72" width={large?"100%":"120"} height={large?"auto":"72"} style={{ display:"block", overflow:"visible", maxWidth:"240px" }}>
        {bars.map((h, i) => {
          const progress = active ? Math.min(1, Math.max(0, (tick-i*2)/12)) : 0;
          const bH = h*progress*52; const x = 6+i*14;
          return (
            <g key={i}>
              <rect x={x} y={58-bH} width="10" height={bH} rx="1" fill={i%2===0?BLUE:GOLD} opacity={0.7+progress*0.3}/>
              <text x={x+5} y="66" textAnchor="middle" fontSize="5" fill="rgba(240,235,227,0.25)" fontFamily="DM Sans">{depts[i]}</text>
            </g>
          );
        })}
        <line x1="4" y1="58" x2="118" y2="58" stroke="rgba(240,235,227,0.1)" strokeWidth="1"/>
      </svg>
    );
  }

  if (type === "sprint") {
    const steps = ["Discovery","Analysis","Brief","Scope","Deliver"];
    const durations = [2,3,2,1,2];
    return (
      <svg viewBox="0 0 120 72" width={large?"100%":"120"} height={large?"auto":"72"} style={{ display:"block", maxWidth:"240px" }}>
        {steps.map((s, i) => {
          const lit = active && tick > i*7;
          const bW = lit ? Math.min(durations[i]*22, 80) : 0;
          const y = 8+i*13;
          return (
            <g key={s}>
              <text x="0" y={y+8} fontSize="7" fill={lit?"rgba(240,235,227,0.6)":"rgba(240,235,227,0.18)"} fontFamily="DM Sans">{s}</text>
              <rect x="52" y={y} width={bW} height="8" rx="2" fill={lit?GOLD:"rgba(240,235,227,0.05)"} opacity={lit?0.85:1}/>
              <circle cx="46" cy={y+4} r="3" fill={lit?GOLD:"rgba(240,235,227,0.1)"}/>
            </g>
          );
        })}
      </svg>
    );
  }

  const dims = ["Location","Access","Tenant","Amenity","Cap Stack","Market"];
  const scores = [0.7,0.5,0.85,0.6,0.75,0.55];
  const rcx = 130; const rcy = 120; const rr = large ? 80 : 66;
  const progress = active ? Math.min(1, Math.max(0, (tick-5)/20)) : 0;
  const polyPts = dims.map((_, i) => {
    const a = (i/dims.length)*Math.PI*2-Math.PI/2;
    const sr = rr*scores[i]*progress;
    return (rcx+sr*Math.cos(a))+","+(rcy+sr*Math.sin(a));
  }).join(" ");
  return (
    <svg viewBox="0 0 260 240" width="100%" height={large?"200":"160"} style={{ display:"block" }}>
      {[0.33,0.66,1.0].map(lvl => {
        const pts = dims.map((_,i) => { const a=(i/dims.length)*Math.PI*2-Math.PI/2; return (rcx+rr*lvl*Math.cos(a))+","+(rcy+rr*lvl*Math.sin(a)); }).join(" ");
        return <polygon key={lvl} points={pts} fill="none" stroke={BLUE+"22"} strokeWidth="1"/>;
      })}
      {dims.map((_,i) => { const a=(i/dims.length)*Math.PI*2-Math.PI/2; return <line key={i} x1={rcx} y1={rcy} x2={rcx+rr*Math.cos(a)} y2={rcy+rr*Math.sin(a)} stroke={BLUE+"15"} strokeWidth="1"/>; })}
      {progress > 0 && <polygon points={polyPts} fill={BLUE+"22"} stroke={BLUE} strokeWidth="2"/>}
      {dims.map((d, i) => {
        const a=(i/dims.length)*Math.PI*2-Math.PI/2;
        const sr = rr*scores[i]*progress;
        return <circle key={i} cx={rcx+sr*Math.cos(a)} cy={rcy+sr*Math.sin(a)} r="4" fill={BLUE} opacity={progress}/>;
      })}
      {dims.map((d, i) => {
        const a=(i/dims.length)*Math.PI*2-Math.PI/2;
        const lx=rcx+(rr+18)*Math.cos(a); const ly=rcy+(rr+18)*Math.sin(a);
        const anchor = lx<rcx-4?"end":lx>rcx+4?"start":"middle";
        return <text key={d} x={lx} y={ly+3} textAnchor={anchor} fontSize="9" fill="rgba(240,235,227,0.4)" fontFamily="DM Sans">{d}</text>;
      })}
      {!active && <text x={rcx} y={rcy+4} textAnchor="middle" fontSize="10" fill="rgba(240,235,227,0.2)" fontFamily="DM Sans">Hover to animate</text>}
    </svg>
  );
}

// ── CONTENT RADAR ──
function ContentRadar({ visible }) {
  const [progress, setProgress] = useState(0);
  const [activeSeries, setActiveSeries] = useState(["published","inprogress","planned"]);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const go = ts => { if (!start) start=ts; const p=Math.min((ts-start)/1400,1); setProgress(1-Math.pow(1-p,3)); if(p<1) rafRef.current=requestAnimationFrame(go); };
    const t = setTimeout(() => { rafRef.current = requestAnimationFrame(go); }, 200);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [visible]);
  const toggle = k => setActiveSeries(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k]);
  const W=280; const H=230; const ccx=140; const ccy=115; const cr=88; const n=RADAR_DIMS.length;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <svg viewBox={"0 0 "+W+" "+H} width="100%" style={{ maxWidth:"360px" }}>
        <defs>
          {CONTENT_SERIES.map(s => (
            <radialGradient key={s.key} id={"rg-"+s.key} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={s.color} stopOpacity="0.05"/>
            </radialGradient>
          ))}
        </defs>
        {[0.33,0.66,1.0].map(lvl => {
          const pts = RADAR_DIMS.map((_,i) => { const a=(i/n)*Math.PI*2-Math.PI/2; return (ccx+cr*lvl*Math.cos(a))+","+(ccy+cr*lvl*Math.sin(a)); }).join(" ");
          return <polygon key={lvl} points={pts} fill="none" stroke="rgba(240,235,227,0.06)" strokeWidth="1"/>;
        })}
        {RADAR_DIMS.map((_,i) => { const a=(i/n)*Math.PI*2-Math.PI/2; return <line key={i} x1={ccx} y1={ccy} x2={ccx+cr*Math.cos(a)} y2={ccy+cr*Math.sin(a)} stroke="rgba(240,235,227,0.06)" strokeWidth="1"/>; })}
        {RADAR_DIMS.map((d,i) => {
          const a=(i/n)*Math.PI*2-Math.PI/2; const lx=ccx+(cr+18)*Math.cos(a); const ly=ccy+(cr+18)*Math.sin(a);
          const anchor = lx<ccx-4?"end":lx>ccx+4?"start":"middle";
          return <text key={d} x={lx} y={ly+3} textAnchor={anchor} fontSize="7" fill="rgba(240,235,227,0.35)" fontFamily="DM Sans">{d.split(" ").slice(0,2).join(" ")}</text>;
        })}
        {CONTENT_SERIES.map(s => {
          if (!activeSeries.includes(s.key)) return null;
          const pts = s.data.map((v,i) => { const a=(i/n)*Math.PI*2-Math.PI/2; const sr=cr*v*progress; return (ccx+sr*Math.cos(a))+","+(ccy+sr*Math.sin(a)); }).join(" ");
          return (
            <g key={s.key}>
              <polygon points={pts} fill={"url(#rg-"+s.key+")"} stroke={s.color} strokeWidth="1.5" opacity="0.9"/>
              {s.data.map((v,i) => { const a=(i/n)*Math.PI*2-Math.PI/2; const sr=cr*v*progress; return <circle key={i} cx={ccx+sr*Math.cos(a)} cy={ccy+sr*Math.sin(a)} r="2.5" fill={s.color}/>; })}
            </g>
          );
        })}
      </svg>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center", marginTop:"12px" }}>
        {CONTENT_SERIES.map(s => {
          const on = activeSeries.includes(s.key);
          return (
            <button key={s.key} onClick={() => toggle(s.key)}
              style={{ display:"flex", alignItems:"center", gap:"5px", padding:"4px 10px", background:on?"rgba(240,235,227,0.05)":"transparent", border:"1px solid "+(on?s.color+"60":"rgba(240,235,227,0.1)"), borderRadius:"4px", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"all 0.2s" }}>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:on?s.color:"rgba(240,235,227,0.2)" }}/>
              <span style={{ fontSize:"10px", color:on?"rgba(240,235,227,0.7)":"rgba(240,235,227,0.3)", letterSpacing:"0.05em" }}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── TRAJECTORY CHART (full-width, with tooltip + forecast) ──
function TrajectoryChart({ visible }) {
  const [progress, setProgress] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const go = ts => { if (!start) start=ts; const p=Math.min((ts-start)/1800,1); setProgress(p); if(p<1) rafRef.current=requestAnimationFrame(go); };
    const t = setTimeout(() => { rafRef.current = requestAnimationFrame(go); }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  const W=600; const H=180; const PL=24; const PR=24; const PT=24; const PB=44;
  const iW=W-PL-PR; const iH=H-PT-PB;

  // Actual data — 7 points from launch to today
  const ACTUAL = [0, 18, 34, 67, 142, 390, 620];
  // Projected (expected) — started higher, intersects ~index 4, actual beats it after
  const PROJECTED = [80, 110, 145, 175, 210, 310, 520];
  // Future forecast beyond today — indices 7,8,9 (extended)
  const FUTURE_ACTUAL = [620, 890, 1240];
  const FUTURE_PROJ   = [520, 750, 1100];

  const maxSig = 1400;
  const totalPts = 10; // 7 actual + 3 future

  const xAt = i => PL + (i / (totalPts - 1)) * iW;
  const yAt = v => PT + iH - (v / maxSig) * iH;

  // Points for actual line (indices 0–6)
  const actualPts = ACTUAL.map((v,i) => ({ x:xAt(i), y:yAt(v), v }));
  // Points for projected line (indices 0–6)
  const projPts   = PROJECTED.map((v,i) => ({ x:xAt(i), y:yAt(v), v }));
  // Future points (indices 7–9)
  const futureActualPts = FUTURE_ACTUAL.map((v,i) => ({ x:xAt(7+i), y:yAt(v), v }));
  const futureProjPts   = FUTURE_PROJ.map((v,i)   => ({ x:xAt(7+i), y:yAt(v), v }));

  const todayPt = actualPts[actualPts.length-1];
  const todayX = todayPt.x; const todayY = todayPt.y;

  // Animate actual line draw
  const cutIdx = Math.min(Math.floor(progress*(actualPts.length-1)), actualPts.length-1);
  const frac = progress*(actualPts.length-1) - cutIdx;
  let lastX = actualPts[cutIdx].x; let lastY = actualPts[cutIdx].y;
  if (cutIdx < actualPts.length-1) {
    lastX = actualPts[cutIdx].x + frac*(actualPts[cutIdx+1].x - actualPts[cutIdx].x);
    lastY = actualPts[cutIdx].y + frac*(actualPts[cutIdx+1].y - actualPts[cutIdx].y);
  }
  const drawnActual = actualPts.slice(0, cutIdx+1).concat(cutIdx < actualPts.length-1 ? [{x:lastX,y:lastY}] : []);
  const actualPath = drawnActual.map((p,i) => (i===0?"M":"L")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" ");
  const actualArea = actualPath+" L"+lastX.toFixed(1)+","+(PT+iH)+" L"+PL+","+(PT+iH)+" Z";

  // Projected path (full, appears with slight delay)
  const projPath = projPts.map((p,i) => (i===0?"M":"L")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" ");

  // Future paths (appear after progress > 0.9)
  const futureProgress = Math.max(0, (progress - 0.92) / 0.08);
  const futureActualVisible = Math.min(Math.floor(futureProgress * futureActualPts.length), futureActualPts.length);
  const futureProjVisible   = Math.min(Math.floor(futureProgress * futureProjPts.length),   futureProjPts.length);

  const futureBridge = (basePt, futurePts, count) => {
    if (count === 0) return "";
    const all = [basePt, ...futurePts.slice(0, count)];
    return all.map((p,i) => (i===0?"M":"L")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" ");
  };

  const futureActualPath = futureBridge(todayPt, futureActualPts, futureActualVisible);
  const futureProjPath   = futureBridge(projPts[projPts.length-1], futureProjPts, futureProjVisible);

  // X-axis label positions
  const launchX = xAt(0);
  const todayLabelX = xAt(6);
  const futureLabelX = xAt(9);

  return (
    <div style={{ position:"relative", width:"100%" }}>
      <svg width="100%" viewBox={"0 0 "+W+" "+H} style={{ overflow:"visible", display:"block" }}>
        <defs>
          <linearGradient id="ag3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={BLUE} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="futureActualGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.9"/>
            <stop offset="100%" stopColor={BLUE} stopOpacity="0.35"/>
          </linearGradient>
          <linearGradient id="futureProjGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.7"/>
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.2"/>
          </linearGradient>
        </defs>

        {/* Subtle grid */}
        {[0,0.33,0.66,1].map(v => {
          const y = PT+iH-v*iH;
          return <line key={v} x1={PL} y1={y} x2={PL+iW} y2={y} stroke="rgba(240,235,227,0.04)" strokeWidth="1"/>;
        })}

        {/* Today vertical divider */}
        <line x1={todayLabelX} y1={PT} x2={todayLabelX} y2={PT+iH} stroke="rgba(240,235,227,0.08)" strokeWidth="1" strokeDasharray="3,4"/>

        <text x={launchX} y={H-8} textAnchor="middle" fontSize="10" fill="rgba(240,235,227,0.3)" fontFamily="DM Sans" letterSpacing="0.06em">Launch</text>
        <text x={todayLabelX} y={H-8} textAnchor="middle" fontSize="10" fill={BLUE} fontFamily="DM Sans" fontWeight="600" letterSpacing="0.06em">Today</text>
        <text x={futureLabelX} y={H-8} textAnchor="middle" fontSize="10" fill="rgba(240,235,227,0.2)" fontFamily="DM Sans" letterSpacing="0.06em">Forecast</text>

        {/* Projected line (full, dashed, gold) — draws with actual progress */}
        {progress > 0.05 && (
          <path d={projPath} fill="none" stroke={GOLD} strokeWidth="1.5"
            strokeDasharray="5,4" opacity={Math.min(1, progress*3)}/>
        )}

        {/* Actual area fill */}
        <path d={actualArea} fill="url(#ag3)"/>

        {/* Actual line */}
        <path d={actualPath} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Future projected (dashed gold, fading) */}
        {futureProjPath && (
          <path d={futureProjPath} fill="none" stroke="url(#futureProjGrad)" strokeWidth="1.5" strokeDasharray="5,4"/>
        )}

        {/* Future actual (solid blue, fading) */}
        {futureActualPath && (
          <path d={futureActualPath} fill="none" stroke="url(#futureActualGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,3"/>
        )}

        {/* Actual data dots (hoverable) */}
        {actualPts.map((p,i) => {
          const drawn = i < drawnActual.length;
          return drawn ? (
            <g key={i} style={{ cursor:"pointer" }}
              onMouseEnter={() => setTooltip({...p, label: i===0?"Launch":"Month "+(i+1)})}
              onMouseLeave={() => setTooltip(null)}>
              <circle cx={p.x} cy={p.y} r="12" fill="transparent"/>
              <circle cx={p.x} cy={p.y} r="3.5" fill={BLUE} stroke="#090808" strokeWidth="1.5"/>
            </g>
          ) : null;
        })}

        {/* TODAY marker — count label only, no badge, pulse ring behind dot */}
        {progress > 0.95 && (
          <g>
            {/* Pulse rings */}
            <circle cx={todayX} cy={todayY} r="10" fill={BLUE} opacity="0.1">
              <animate attributeName="r" values="8;16;8" dur="2.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.12;0.02;0.12" dur="2.2s" repeatCount="indefinite"/>
            </circle>
            {/* Main dot */}
            <circle cx={todayX} cy={todayY} r="5.5" fill={BLUE} stroke="#090808" strokeWidth="2"/>
            {/* 620+ count label — above the dot, clear of forecast line */}
            <text x={todayX} y={todayY-14} textAnchor="middle" fontSize="13" fill={BLUE} fontFamily="DM Sans" fontWeight="700">620+</text>
          </g>
        )}
      </svg>

      {/* Legend — bottom left */}
      <div style={{ display:"flex", gap:"20px", marginTop:"16px", paddingLeft:"4px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"/></svg>
          <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.5)", fontFamily:"'DM Sans', sans-serif" }}>Actual signals</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5,3" strokeLinecap="round"/></svg>
          <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.5)", fontFamily:"'DM Sans', sans-serif" }}>Expected trajectory</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke={BLUE} strokeWidth="2" strokeDasharray="6,3" strokeLinecap="round" opacity="0.5"/></svg>
          <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.5)", fontFamily:"'DM Sans', sans-serif" }}>Forecast</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div style={{ position:"absolute", top:0, left:0, pointerEvents:"none",
          transform:"translate(calc("+(tooltip.x/W*100)+"% - 50%), calc("+(tooltip.y/H*100)+"% - 120%))",
          background:"rgba(14,12,10,0.96)", border:"1px solid "+BLUE+"40", padding:"7px 13px", borderRadius:"6px", whiteSpace:"nowrap", zIndex:10 }}>
          <div style={{ fontSize:"12px", fontWeight:700, color:BLUE }}>{tooltip.v.toLocaleString()} signals</div>
          <div style={{ fontSize:"10px", color:"rgba(240,235,227,0.45)", marginTop:"2px" }}>{tooltip.label}</div>
        </div>
      )}
    </div>
  );
}

// ── TESTIMONIALS ──
function Testimonials() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => { setFade(false); setTimeout(() => { setActive(p=>(p+1)%TESTIMONIALS.length); setFade(true); }, 400); }, 4500);
    return () => clearInterval(iv);
  }, []);
  const t = TESTIMONIALS[active];
  return (
    <section style={{ padding:"80px 48px", background:"#13110e", borderTop:"1px solid rgba(200,146,42,0.12)", borderBottom:"1px solid rgba(200,146,42,0.12)" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"48px" }}>
          <div style={{ width:"3px", height:"16px", background:GOLD, borderRadius:"2px" }}/>
          <span style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.2em", color:"rgba(240,235,227,0.22)", textTransform:"uppercase" }}>Design That Unlocks Value</span>
          <div style={{ flex:1, height:"1px", background:"rgba(200,146,42,0.1)" }}/>
          <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.2)", letterSpacing:"0.06em" }}>Reader Voices</span>
        </div>
        <div style={{ opacity:fade?1:0, transition:"opacity 0.4s ease", minHeight:"120px" }}>
          <p style={{ fontFamily:"'Playfair Display', serif", fontStyle:"italic", fontSize:"clamp(20px,2.8vw,32px)", fontWeight:400, lineHeight:1.4, color:"#f0ebe3", marginBottom:"28px", maxWidth:"780px" }}>
            {"\u201C"+t.quote+"\u201D"}
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:"14px", flexWrap:"wrap" }}>
            <div style={{ width:"40px", height:"1px", background:GOLD }}/>
            <span style={{ fontSize:"13px", color:"rgba(240,235,227,0.45)" }}>{t.attr}</span>
            <span style={{ fontSize:"9px", fontWeight:600, letterSpacing:"0.12em", color:BLUE, textTransform:"uppercase", border:"1px solid "+BLUE+"35", padding:"2px 8px", borderRadius:"3px" }}>{t.tag}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", marginTop:"36px" }}>
          {TESTIMONIALS.map((_,i) => (
            <button key={i} onClick={() => { setFade(false); setTimeout(()=>{setActive(i);setFade(true);},300); }}
              style={{ width:i===active?"28px":"8px", height:"3px", background:i===active?GOLD:"rgba(240,235,227,0.15)", border:"none", cursor:"pointer", borderRadius:"2px", transition:"all 0.3s", padding:0 }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EMAIL ──
function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = () => { if (email.includes("@")) setSubmitted(true); };
  if (submitted) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", padding:"16px", border:"1px solid "+BLUE+"40", borderRadius:"6px", background:BLUE+"0a" }}>
      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:BLUE }}/>
      <span style={{ fontSize:"13px", color:BLUE, fontWeight:500 }}>You're in. We'll be in touch.</span>
    </div>
  );
  return (
    <div style={{ display:"flex", maxWidth:"440px", margin:"0 auto" }}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submit();}} placeholder="your@email.com"
        style={{ flex:1, padding:"12px 16px", background:"rgba(240,235,227,0.04)", border:"1px solid "+BLUE+"30", borderRight:"none", color:"#f0ebe3", fontSize:"13px", fontFamily:"'DM Sans', sans-serif", outline:"none", borderRadius:"4px 0 0 4px" }}/>
      <button onClick={submit} style={{ padding:"12px 22px", background:BLUE, color:"#fff", border:"none", fontSize:"12px", fontWeight:700, fontFamily:"'DM Sans', sans-serif", cursor:"pointer", letterSpacing:"0.08em", borderRadius:"0 4px 4px 0", whiteSpace:"nowrap" }}>
        Subscribe \u2192
      </button>
    </div>
  );
}

// ── ARTICLE LIST ──
function ArticleListView({ articles, filters, onClose }) {
  const filtered = articles.filter(a => {
    if (filters.author && a.author!==filters.author) return false;
    if (filters.category && a.category!==filters.category) return false;
    if (filters.city && a.city!==filters.city) return false;
    if (filters.prospectType && a.prospectType!==filters.prospectType) return false;
    return true;
  });
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,9,8,0.98)", zIndex:450, overflowY:"auto" }}>
      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"100px 24px 80px" }}>
        <button onClick={onClose} style={{ display:"flex", alignItems:"center", gap:"8px", background:"transparent", border:"none", color:"rgba(240,235,227,0.38)", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:"12px", marginBottom:"32px" }}>
          \u2190 Back to Work Labs
        </button>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(22px,4vw,36px)", fontWeight:400, color:"#f0ebe3", marginBottom:"28px" }}>
          {filtered.length+" Article"+(filtered.length!==1?"s":"")}
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"1px", background:"rgba(240,235,227,0.04)" }}>
          {filtered.map((a,i) => (
            <div key={a.id} style={{ background:"#0f0e0c", padding:"20px 22px", display:"flex", gap:"16px", cursor:"pointer", transition:"background 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#161310";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#0f0e0c";}}>
              <span style={{ fontFamily:"'Playfair Display', serif", fontSize:"22px", fontWeight:700, color:a.accent+"28", lineHeight:1, minWidth:"28px" }}>{pad(i+1)}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:"6px", marginBottom:"6px", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.14em", color:a.accent, textTransform:"uppercase", border:"1px solid "+a.accent+"35", padding:"2px 6px" }}>{a.category}</span>
                  <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.2)", border:"1px solid rgba(240,235,227,0.07)", padding:"1px 5px", borderRadius:"3px" }}>{a.prospectType}</span>
                  <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.18)" }}>{a.city}</span>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:"16px", fontWeight:400, color:"#f0ebe3", marginBottom:"4px", lineHeight:1.3 }}>{a.title}</h3>
                <p style={{ fontSize:"11px", color:"rgba(240,235,227,0.36)", lineHeight:1.6, fontWeight:300, marginBottom:"8px" }}>{a.excerpt}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <AuthorAvatar author={a.author} size={18}/>
                    <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.26)" }}>{a.author+" \u00B7 "+a.date}</span>
                  </div>
                  <span style={{ fontSize:"11px", color:a.accent }}>Read \u2192</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TOOL CARD (mobile-aware) ──
function ToolCard({ tool, idx, hoveredTool, setHoveredTool, isMobile }) {
  const isHov = hoveredTool === tool.type;
  const accent = idx===0?BLUE:idx===1?GOLD:"rgba(240,235,227,0.4)";
  return (
    <div
      onMouseEnter={() => setHoveredTool(tool.type)}
      onMouseLeave={() => setHoveredTool(null)}
      style={{ background:isHov?"#161412":"#0f0e0c", cursor:"pointer", borderLeft:"3px solid "+(isHov?accent:accent+"55"), transition:"background 0.25s, transform 0.25s", transform:isHov&&!isMobile?"translateY(-3px)":"none", display:"flex", flexDirection:"row", alignItems:"center", gap:isMobile?"20px":"28px", padding:isMobile?"24px 20px":"28px 32px" }}>
      {/* Visual panel — left, with breathing room */}
      <div style={{ width:isMobile?"96px":"130px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", minHeight:isMobile?"80px":"88px", background:"rgba(240,235,227,0.02)", borderRadius:"4px", padding:"12px 10px" }}>
        <ToolVisual type={tool.type} active={isHov}/>
      </div>
      {/* Text — right */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
          <span style={{ fontFamily:"'Playfair Display', serif", fontSize:"11px", color:accent+"70" }}>{"0"+(idx+1)}</span>
          <h3 style={{ fontSize:"15px", fontWeight:600, color:"#f0ebe3" }}>{tool.name}</h3>
        </div>
        <p style={{ fontSize:"12px", lineHeight:1.6, color:"rgba(240,235,227,0.38)", marginBottom:"14px", fontWeight:300 }}>{tool.desc}</p>
        <button style={{ background:"transparent", border:"1px solid "+accent+"50", color:accent, padding:"6px 14px", fontSize:"11px", letterSpacing:"0.09em", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600, borderRadius:"3px" }}>{tool.cta+" →"}</button>
      </div>
    </div>
  );
}

function VoteOptions({ votedFor, voteData, totalVotes, handleVote }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
      {voteData.map(opt => {
        const pct = Math.round((opt.votes / totalVotes) * 100);
        const isV = votedFor === opt.id;
        return (
          <div key={opt.id} onClick={() => handleVote(opt.id)}
            style={{ padding:"14px 18px", border:"1px solid "+(isV?BLUE+"60":"rgba(240,235,227,0.07)"), background:isV?BLUE+"0d":"transparent", position:"relative", overflow:"hidden", cursor:votedFor?"default":"pointer", borderRadius:"4px", transition:"border-color 0.2s" }}>
            {votedFor && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:pct+"%", background:isV?BLUE+"12":"rgba(240,235,227,0.025)", transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)" }}/>}
            <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"11px", height:"11px", borderRadius:"50%", border:"1px solid "+(isV?BLUE:"rgba(240,235,227,0.2)"), background:isV?BLUE:"transparent", flexShrink:0, transition:"all 0.2s" }}/>
                <span style={{ fontSize:"14px", color:isV?"#f0ebe3":"rgba(240,235,227,0.6)", fontWeight:isV?500:400 }}>{opt.label}</span>
              </div>
              {votedFor && <span style={{ fontSize:"12px", color:isV?BLUE:"rgba(240,235,227,0.25)", fontWeight:600, marginLeft:"12px" }}>{pct+"%"}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN ──
export default function WorkLabsLanding() {
  const isMobile = useIsMobile();
  const [activeTheme, setActiveTheme] = useState(0);
  const [votedFor, setVotedFor] = useState(null);
  const [voteData, setVoteData] = useState(VOTE_OPTIONS);
  const [activeTopic, setActiveTopic] = useState("All");
  const [vis, setVis] = useState({});
  const [filters, setFilters] = useState({ author:null, category:null, city:null, prospectType:null });
  const [showList, setShowList] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeDim, setActiveDim] = useState(null);
  const [metricCounts, setMetricCounts] = useState(METRICS.map(()=>0));
  const refs = useRef({});
  const islandRef = useRef(null);
  const filterPanelRef = useRef(null);

  useEffect(()=>{ const iv=setInterval(()=>setActiveTheme(p=>(p+1)%THEMES.length),2200); return()=>clearInterval(iv); },[]);
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting) setVis(p=>({...p,[e.target.dataset.s]:true}));});
    },{threshold:0.08});
    Object.values(refs.current).forEach(r=>r&&obs.observe(r));
    return()=>obs.disconnect();
  },[]);
  useEffect(()=>{
    if(!vis.metrics) return;
    const targets=METRICS.map(m=>parseInt(m.value.replace("+","")));
    let frame=0;
    const iv=setInterval(()=>{frame++;const e=1-Math.pow(1-Math.min(frame/40,1),3);setMetricCounts(targets.map(t=>Math.round(t*e)));if(frame>=40)clearInterval(iv);},40);
    return()=>clearInterval(iv);
  },[vis.metrics]);
  useEffect(()=>{
    if(!filterOpen) return;
    const h=e=>{if(filterPanelRef.current&&!filterPanelRef.current.contains(e.target)&&islandRef.current&&!islandRef.current.contains(e.target)){setFilterOpen(false);setActiveDim(null);}};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[filterOpen]);

  const reg=k=>el=>{if(el){el.dataset.s=k;refs.current[k]=el;}};
  const isVis=k=>!!vis[k];
  const handleVote=id=>{if(votedFor)return;setVotedFor(id);setVoteData(p=>p.map(o=>o.id===id?{...o,votes:o.votes+1}:o));};
  const totalVotes=voteData.reduce((s,o)=>s+o.votes,0);
  const featured=ARTICLES.find(a=>a.featured);
  const rest=ARTICLES.filter(a=>!a.featured);
  const topics=["All",...new Set(ARTICLES.map(a=>a.category))];
  const filteredArticles=activeTopic==="All"?rest:rest.filter(a=>a.category===activeTopic);
  const activeFilterCount=Object.values(filters).filter(Boolean).length;
  const filteredCount=ARTICLES.filter(a=>{
    if(filters.author&&a.author!==filters.author)return false;
    if(filters.category&&a.category!==filters.category)return false;
    if(filters.city&&a.city!==filters.city)return false;
    if(filters.prospectType&&a.prospectType!==filters.prospectType)return false;
    return true;
  }).length;
  const toggleFilter=(k,v)=>setFilters(p=>({...p,[k]:p[k]===v?null:v}));
  const clearFilters=()=>{setFilters({author:null,category:null,city:null,prospectType:null});setActiveDim(null);};

  const px = isMobile ? "24px" : "48px";

  const TOOLS = [
    { name:"Programming Calculator", desc:"Estimate space requirements by department and headcount.", cta:"Open Tool", type:"calculator" },
    { name:"Sprint Brief", desc:"Scope a repositioning engagement in under 10 minutes.", cta:"Start Brief", type:"sprint" },
    { name:"Readiness Assessment", desc:"Score your asset's repositioning readiness across 12 dimensions.", cta:"Take Assessment", type:"assessment" },
  ];

  return (
    <div style={{ background:"#0f0e0c", color:"#f0ebe3", minHeight:"100vh", fontFamily:"'DM Sans', sans-serif", overflowX:"hidden", maxWidth:"100vw" }}>
      <style>{[
        "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');",
        "*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }",
        "html, body { overflow-x:hidden; max-width:100vw; }",
        "@keyframes fadeUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }",
        "@keyframes themeIn { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }",
        "@keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }",
        "@keyframes greenGlow { 0%,100%{background:#4ade80;box-shadow:0 0 4px #4ade80,0 0 10px rgba(74,222,128,0.4);transform:scale(1);}50%{background:#6ef09a;box-shadow:0 0 8px #4ade80,0 0 18px rgba(74,222,128,0.6);transform:scale(1.25);} }",
        ".reveal { opacity:0; transform:translateY(28px); transition:opacity 0.75s ease, transform 0.75s ease; }",
        ".reveal.on { opacity:1; transform:translateY(0); }",
        ".hrow:hover { background:rgba(0,186,220,0.04) !important; }",
        ".pill:hover { background:rgba(0,186,220,0.08) !important; border-color:rgba(0,186,220,0.3) !important; }",
        "::-webkit-scrollbar { width:3px; }",
        "::-webkit-scrollbar-thumb { background:#2a2520; border-radius:2px; }",
      ].join(" ")}</style>

      {showList && <ArticleListView articles={ARTICLES} filters={filters} onClose={()=>setShowList(false)}/>}

      {menuOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(8,7,6,0.98)", zIndex:500, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:"28px" }}
          onClick={()=>setMenuOpen(false)}>
          {["Insights","Topics","Tools","Subscribe"].map(l=>(
            <a key={l} href={l==="Subscribe"?"#subscribe":"#"+l.toLowerCase()} onClick={()=>setMenuOpen(false)}
              style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(26px,5vw,42px)", fontWeight:400, color:l==="Subscribe"?BLUE:"#f0ebe3", textDecoration:"none", letterSpacing:"0.04em" }}>{l}</a>
          ))}
          <button onClick={()=>setMenuOpen(false)} style={{ position:"absolute", top:"28px", right:"28px", background:"transparent", border:"none", color:"rgba(240,235,227,0.4)", cursor:"pointer", fontSize:"22px" }}>&#x2715;</button>
        </div>
      )}

      {filterOpen && (
        <div ref={filterPanelRef} style={{ position:"fixed", top:"108px", left:"50%", transform:"translateX(-50%)", zIndex:490, width:"min(420px, calc(100vw - 32px))", background:"rgba(13,11,9,0.99)", border:"1px solid "+BLUE+"25", backdropFilter:"blur(24px)", borderRadius:"12px", overflow:"hidden", boxShadow:"0 16px 48px rgba(0,0,0,0.7)" }}>
          <div style={{ padding:"16px 18px 0" }}>
            <p style={{ fontSize:"9px", fontWeight:600, letterSpacing:"0.18em", color:"rgba(240,235,227,0.25)", textTransform:"uppercase", marginBottom:"12px" }}>Filter Insights</p>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"12px" }}>
              {FILTER_DIMS.map(d=>{
                const hasVal=!!filters[d.key]; const isAct=activeDim===d.key;
                return (
                  <button key={d.key} onMouseDown={e=>{e.preventDefault();e.stopPropagation();setActiveDim(isAct?null:d.key);}}
                    style={{ padding:"6px 12px", background:isAct?"rgba(0,186,220,0.12)":hasVal?"rgba(0,186,220,0.07)":"rgba(240,235,227,0.04)", border:"1px solid "+(isAct?BLUE+"80":hasVal?BLUE+"40":"rgba(240,235,227,0.1)"), color:isAct?BLUE:hasVal?"#5dd8f0":"rgba(240,235,227,0.5)", fontSize:"11px", fontFamily:"'DM Sans', sans-serif", cursor:"pointer", borderRadius:"4px", display:"flex", alignItems:"center", gap:"5px" }}>
                    {d.label}{hasVal&&<span style={{fontSize:"8px",color:BLUE}}>&bull;</span>}
                  </button>
                );
              })}
            </div>
            {activeDim && (
              <div style={{ borderTop:"1px solid rgba(240,235,227,0.06)", paddingTop:"12px", marginBottom:"12px" }}>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                  {FILTER_DIMS.find(d=>d.key===activeDim).options.map(opt=>{
                    const sel=filters[activeDim]===opt;
                    return (
                      <button key={opt} onMouseDown={e=>{e.preventDefault();e.stopPropagation();toggleFilter(activeDim,opt);}}
                        style={{ padding:"5px 12px", background:sel?"rgba(0,186,220,0.15)":"transparent", border:"1px solid "+(sel?BLUE+"70":"rgba(240,235,227,0.1)"), color:sel?BLUE:"rgba(240,235,227,0.55)", fontSize:"12px", fontFamily:"'DM Sans', sans-serif", cursor:"pointer", borderRadius:"4px" }}>
                        {opt}{sel?" \u2713":""}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px", borderTop:"1px solid rgba(240,235,227,0.06)", background:"rgba(0,0,0,0.2)" }}>
            <span style={{ fontSize:"11px", color:"rgba(240,235,227,0.28)" }}>{filteredCount+" match"+(filteredCount!==1?"es":"")}</span>
            <div style={{ display:"flex", gap:"10px" }}>
              {activeFilterCount>0&&<button onMouseDown={e=>{e.preventDefault();e.stopPropagation();clearFilters();}} style={{ fontSize:"11px", color:"rgba(240,235,227,0.32)", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", textDecoration:"underline" }}>Clear</button>}
              <button onMouseDown={e=>{e.preventDefault();e.stopPropagation();setFilterOpen(false);setActiveDim(null);setShowList(true);}} style={{ background:BLUE, color:"#fff", border:"none", padding:"7px 16px", fontSize:"11px", fontWeight:700, fontFamily:"'DM Sans', sans-serif", cursor:"pointer", borderRadius:"4px" }}>View Results \u2192</button>
            </div>
          </div>
        </div>
      )}

      {/* ISLAND */}
      <div ref={islandRef} style={{ position:"fixed", top:"16px", left:"50%", transform:"translateX(-50%)", zIndex:400, width:"min(680px, calc(100vw - 24px))", borderRadius:"16px", overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,235,227,0.07)" }}>
        <div style={{ background:"rgba(14,12,10,0.97)", backdropFilter:"blur(24px)", padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(240,235,227,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ height:"28px", display:"flex", alignItems:"center" }}>
              <img src={LOGO} alt="NELSON" style={{ height:"18px", width:"auto", opacity:1, display:"block" }}/>
            </div>
            <div style={{ width:"1px", height:"18px", background:"rgba(240,235,227,0.15)" }}/>
            <span style={{ fontFamily:"'Playfair Display', serif", fontSize:"14px", color:"rgba(240,235,227,0.65)", fontWeight:400, letterSpacing:"0.02em" }}>Work Labs</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <button style={{ background:BLUE, color:"#fff", border:"none", padding:"6px 14px", fontSize:"10px", letterSpacing:"0.1em", fontWeight:700, fontFamily:"'DM Sans', sans-serif", cursor:"pointer", borderRadius:"4px" }}>Subscribe</button>
            <button onClick={()=>setMenuOpen(p=>!p)} style={{ background:"transparent", border:"none", cursor:"pointer", padding:"4px", display:"flex", flexDirection:"column", gap:"4px" }}>
              <div style={{ width:"18px", height:"1.5px", background:"rgba(240,235,227,0.6)", transition:"all 0.25s", transform:menuOpen?"rotate(45deg) translate(4px,4px)":"none" }}/>
              <div style={{ width:"18px", height:"1.5px", background:"rgba(240,235,227,0.6)", transition:"all 0.25s", opacity:menuOpen?0:1 }}/>
              <div style={{ width:"18px", height:"1.5px", background:"rgba(240,235,227,0.6)", transition:"all 0.25s", transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"none" }}/>
            </button>
          </div>
        </div>
        <div style={{ background:"rgba(11,10,8,0.97)", backdropFilter:"blur(24px)", padding:"7px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", flex:1, minWidth:0 }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", flexShrink:0, animation:"greenGlow 2s ease infinite" }}/>
            <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.35)", whiteSpace:"nowrap" }}>Team is online.</span>
            <div style={{ width:"1px", height:"10px", background:"rgba(240,235,227,0.1)", flexShrink:0 }}/>
            <StatusCycler/>
          </div>
          <button onMouseDown={e=>{e.preventDefault();setFilterOpen(p=>!p);setActiveDim(null);}}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", background:filterOpen?"rgba(0,186,220,0.1)":"rgba(240,235,227,0.04)", border:"1px solid "+(filterOpen?BLUE+"60":activeFilterCount>0?BLUE+"40":"rgba(240,235,227,0.1)"), cursor:"pointer", fontFamily:"'DM Sans', sans-serif", borderRadius:"6px", transition:"all 0.2s", flexShrink:0 }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="3" x2="13" y2="3" stroke={filterOpen||activeFilterCount>0?BLUE:"rgba(240,235,227,0.45)"} strokeWidth="1.3"/>
              <line x1="3" y1="7" x2="11" y2="7" stroke={filterOpen||activeFilterCount>0?BLUE:"rgba(240,235,227,0.45)"} strokeWidth="1.3"/>
              <line x1="5" y1="11" x2="9" y2="11" stroke={filterOpen||activeFilterCount>0?BLUE:"rgba(240,235,227,0.45)"} strokeWidth="1.3"/>
            </svg>
            <span style={{ fontSize:"10px", color:filterOpen||activeFilterCount>0?BLUE:"rgba(240,235,227,0.5)", fontWeight:600, letterSpacing:"0.07em" }}>Filter Articles</span>
            {activeFilterCount>0&&<span style={{ background:BLUE, color:"#fff", fontSize:"8px", fontWeight:700, padding:"1px 5px", borderRadius:"8px" }}>{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      {/* 1. HERO */}
      <section style={{ minHeight:"clamp(75vh,85vh,100vh)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 "+px, paddingTop:"120px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 65% 40%, "+BLUE+"09 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 35% 60%, "+GOLD+"0a 0%, transparent 55%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:"6%", top:"50%", transform:"translateY(-50%)", fontFamily:"'Playfair Display', serif", fontSize:"clamp(100px,12vw,200px)", fontWeight:700, color:BLUE+"06", lineHeight:1, userSelect:"none", pointerEvents:"none" }}>06</div>
        <div style={{ maxWidth:"1280px", margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:"680px", animation:"fadeUp 0.9s ease forwards" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px" }}>
              <div style={{ width:"18px", height:"1px", background:BLUE }}/>
              <span style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.2em", color:BLUE, textTransform:"uppercase" }}>Workplace Intelligence Platform</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(36px,5.5vw,82px)", fontWeight:400, lineHeight:1.0, marginBottom:"4px", color:"#f0ebe3" }}>Designing the</h1>
            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(36px,5.5vw,82px)", fontWeight:400, lineHeight:1.0, marginBottom:"4px", color:"#f0ebe3" }}>future of</h1>
            <div style={{ height:"clamp(40px,7vw,90px)", overflow:"hidden", marginBottom:"24px" }}>
              <h1 key={activeTheme} style={{ fontFamily:"'Playfair Display', serif", fontStyle:"italic", fontSize:"clamp(36px,5.5vw,82px)", fontWeight:400, lineHeight:1.0, color:GOLD, animation:"themeIn 0.45s ease forwards" }}>{THEMES[activeTheme]}.</h1>
            </div>
            <p style={{ fontSize:"16px", fontWeight:300, color:"rgba(240,235,227,0.5)", maxWidth:"500px", lineHeight:1.7, marginBottom:"36px" }}>Insights, frameworks, and tools from the people designing the future of work.</p>
            <div style={{ display:"flex", gap:"14px", alignItems:"center", flexWrap:"wrap" }}>
              <a href="#insights" style={{ background:BLUE, color:"#fff", padding:"13px 28px", fontSize:"13px", letterSpacing:"0.09em", fontWeight:700, textDecoration:"none", borderRadius:"3px" }}>Explore Insights</a>
              <a href="#tools" style={{ color:"rgba(240,235,227,0.4)", fontSize:"13px", textDecoration:"none", borderBottom:"1px solid "+BLUE+"40", paddingBottom:"1px" }}>See our tools →</a>
            </div>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:"24px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", opacity:0.28, zIndex:1 }}>
          <span style={{ fontSize:"9px", letterSpacing:"0.18em", textTransform:"uppercase" }}>Scroll</span>
          <div style={{ width:"1px", height:"28px", background:"linear-gradient(to bottom, rgba(240,235,227,0.7), transparent)", animation:"pulse 2s ease infinite" }}/>
        </div>
      </section>

      {/* 2. TICKER */}
      <section style={{ overflow:"hidden", borderTop:"1px solid "+BLUE+"18", borderBottom:"1px solid "+BLUE+"18" }}>
        <div style={{ display:"flex", alignItems:"center", padding:"9px "+px, borderBottom:"1px solid rgba(240,235,227,0.04)" }}>
          <span style={{ fontSize:"9px", fontWeight:600, letterSpacing:"0.2em", color:"rgba(240,235,227,0.2)", textTransform:"uppercase", whiteSpace:"nowrap", marginRight:"20px" }}>Latest Insights</span>
          <div style={{ flex:1, height:"1px", background:"linear-gradient(to right, "+BLUE+"20, transparent)" }}/>
          <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.16)", marginLeft:"20px" }}>{ARTICLES.length+" published"}</span>
        </div>
        <div style={{ padding:"16px 0 12px" }}><TickerTrack articles={ARTICLES} reverse={false}/></div>
        <div style={{ padding:"0 0 16px" }}><TickerTrack articles={[...ARTICLES].reverse()} reverse={true}/></div>
      </section>

      {/* 3. FEATURED */}
      <section id="insights" ref={reg("feat")} className={"reveal "+(isVis("feat")?"on":"")} style={{ padding:"56px "+px }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <SectionLabel text="Featured"/>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(280px,1fr))", gap:"1px", background:"rgba(240,235,227,0.05)" }}>
            <div style={{ gridColumn:isMobile?"auto":"1/-1", background:"#131110", position:"relative", overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:isMobile?"24px":"36px", minHeight:isMobile?"280px":"340px" }}>
              {getBgPattern(BLUE,4)}
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 30%, "+BLUE+"0c 0%, transparent 55%)" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(13,11,9,0.96) 0%, rgba(13,11,9,0.3) 50%, transparent 100%)" }}/>
              <div style={{ position:"absolute", top:"16px", right:"20px", fontFamily:"'Playfair Display', serif", fontSize:"clamp(50px,9vw,100px)", fontWeight:700, color:BLUE+"07", lineHeight:1, userSelect:"none" }}>01</div>
              <div style={{ position:"relative" }}>
                <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"12px", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.16em", color:GOLD, textTransform:"uppercase", border:"1px solid "+GOLD+"40", padding:"3px 9px" }}>{featured.category}</span>
                  <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.3)" }}>{featured.readTime+" read \u00B7 "+featured.date}</span>
                </div>
                <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(20px,2.8vw,40px)", fontWeight:400, lineHeight:1.2, color:"#f0ebe3", marginBottom:"10px", maxWidth:"600px" }}>{featured.title}</h2>
                <p style={{ fontSize:"13px", lineHeight:1.7, color:"rgba(240,235,227,0.43)", maxWidth:"540px", fontWeight:300, marginBottom:"16px" }}>{featured.excerpt}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <AuthorAvatar author={featured.author} size={22}/>
                  <span style={{ fontSize:"11px", color:"rgba(240,235,227,0.32)" }}>{featured.author}</span>
                  <span style={{ fontSize:"15px", color:BLUE, marginLeft:"auto" }}>\u2192</span>
                </div>
              </div>
            </div>
            {rest.slice(0,2).map((a,i)=>(
              <div key={a.id} style={{ background:"#111009", position:"relative", overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:isMobile?"20px":"28px", minHeight:isMobile?"180px":"220px" }}>
                {getBgPattern(a.accent,i+1)}
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(11,10,8,0.92) 0%, transparent 60%)" }}/>
                <div style={{ position:"relative" }}>
                  <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.14em", color:a.accent, textTransform:"uppercase", border:"1px solid "+a.accent+"35", padding:"2px 7px", display:"inline-block", marginBottom:"8px" }}>{a.category}</span>
                  <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:"15px", fontWeight:400, lineHeight:1.35, color:"#f0ebe3", marginBottom:"8px" }}>{a.title}</h3>
                  <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                    <AuthorAvatar author={a.author} size={16}/>
                    <span style={{ fontSize:"10px", color:"rgba(240,235,227,0.26)" }}>{a.author+" \u00B7 "+a.date}</span>
                    <span style={{ fontSize:"11px", color:BLUE, marginLeft:"auto" }}>\u2192</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ALL INSIGHTS */}
      <section id="topics" ref={reg("list")} className={"reveal "+(isVis("list")?"on":"")} style={{ padding:"0 "+px+" 72px" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <SectionLabel text="All Insights"/>
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"20px" }}>
            {topics.map(t=>(
              <button key={t} className="pill" onClick={()=>setActiveTopic(t)}
                style={{ background:activeTopic===t?"rgba(0,186,220,0.12)":"transparent", border:"1px solid "+(activeTopic===t?BLUE+"60":"rgba(240,235,227,0.09)"), color:activeTopic===t?BLUE:"rgba(240,235,227,0.36)", padding:"5px 13px", fontSize:"11px", letterSpacing:"0.04em", fontFamily:"'DM Sans', sans-serif", fontWeight:500, borderRadius:"4px", cursor:"pointer" }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(340px,1fr))", gap:"1px", background:"rgba(240,235,227,0.04)" }}>
            {(filteredArticles.length?filteredArticles:rest).map((a,i)=>(
              <div key={a.id} className="hrow" style={{ background:"#0f0e0c", padding:"18px "+( isMobile?"16px":"22px"), display:"flex", gap:"14px", cursor:"pointer", transition:"background 0.2s" }}>
                <span style={{ fontFamily:"'Playfair Display', serif", fontSize:"22px", fontWeight:700, color:a.accent+"28", lineHeight:1, minWidth:"28px" }}>{pad(i+1)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:"5px", marginBottom:"5px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.14em", color:a.accent, textTransform:"uppercase", border:"1px solid "+a.accent+"35", padding:"1px 6px" }}>{a.category}</span>
                    <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.2)" }}>{a.readTime}</span>
                  </div>
                  <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:"14px", fontWeight:400, lineHeight:1.35, color:"#f0ebe3", marginBottom:"4px" }}>{a.title}</h3>
                  <p style={{ fontSize:"11px", color:"rgba(240,235,227,0.34)", lineHeight:1.6, fontWeight:300, marginBottom:"6px" }}>{a.excerpt}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <AuthorAvatar author={a.author} size={16}/>
                    <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.22)" }}>{a.author+" \u00B7 "+a.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5a. STATS — always full-width */}
      <section ref={reg("metrics")} className={"reveal "+(isVis("metrics")?"on":"")} style={{ padding:"64px "+px+" 56px", background:"#0b0a09", borderTop:"1px solid "+BLUE+"15" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <SectionLabel text="By the Numbers"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", background:"rgba(0,186,220,0.1)" }}>
            {METRICS.map((m,i)=>(
              <div key={m.label} style={{ background:"#0b0a09", padding:isMobile?"24px 20px":"32px 28px" }}>
                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:isMobile?"clamp(28px,8vw,44px)":"clamp(32px,3.5vw,52px)", fontWeight:700, color:i%2===0?BLUE:GOLD, lineHeight:1, marginBottom:"8px" }}>
                  {metricCounts[i]}{m.value.includes("+")&&metricCounts[i]>=parseInt(m.value)?"+":""}
                </div>
                <div style={{ fontSize:"12px", fontWeight:600, color:"rgba(240,235,227,0.5)", letterSpacing:"0.06em", marginBottom:"2px" }}>{m.label}</div>
                <div style={{ fontSize:"10px", color:"rgba(240,235,227,0.22)", letterSpacing:"0.08em" }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5b. CONTENT MIX RADAR */}
      <section style={{ padding:"64px "+px, background:"#0b0a09", borderTop:"1px solid rgba(240,235,227,0.05)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <SectionLabel text="Content Mix"/>
          {isMobile ? (
            <div>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(22px,5vw,32px)", fontWeight:400, color:"#f0ebe3", marginBottom:"8px", lineHeight:1.2 }}>What we're building.</h2>
              <p style={{ fontSize:"13px", color:"rgba(240,235,227,0.38)", fontWeight:300, marginBottom:"28px", lineHeight:1.6 }}>Toggle series to see what's live, in-flight, and coming next.</p>
              <ContentRadar visible={isVis("metrics")}/>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:"64px", alignItems:"center" }}>
              <div>
                <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(26px,2.8vw,42px)", fontWeight:400, color:"#f0ebe3", marginBottom:"16px", lineHeight:1.2 }}>What we're building<span style={{ color:BLUE }}>.</span></h2>
                <p style={{ fontSize:"14px", color:"rgba(240,235,227,0.45)", fontWeight:300, marginBottom:"16px", lineHeight:1.7 }}>Toggle series to see what's live, in-flight, and coming next across each practice area.</p>
                <p style={{ fontSize:"13px", color:"rgba(240,235,227,0.28)", fontWeight:300, lineHeight:1.7, paddingTop:"16px", borderTop:"1px solid rgba(240,235,227,0.06)" }}>Our goal is full coverage across all six dimensions by Q3 2025. AI + Work and Case Studies represent our biggest in-progress investment.</p>
              </div>
              <ContentRadar visible={isVis("metrics")}/>
            </div>
          )}
        </div>
      </section>

      {/* 6. TRAJECTORY CHART — full-width */}
      <section ref={reg("chart")} className={"reveal "+(isVis("chart")?"on":"")} style={{ padding:"64px "+px, background:"#090808", borderTop:"1px solid rgba(240,235,227,0.05)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <SectionLabel text="Platform Growth"/>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(22px,3vw,38px)", fontWeight:400, color:"#f0ebe3", marginBottom:"6px", lineHeight:1.2 }}>Reader signals are accelerating.</h2>
          <p style={{ fontSize:"13px", color:"rgba(240,235,227,0.35)", fontWeight:300, marginBottom:"36px" }}>Engagement has grown every month since launch. Hover any point for detail.</p>
          <TrajectoryChart visible={isVis("chart")}/>
        </div>
      </section>

      {/* 7. VOTE — full-width, its own section */}
      <section ref={reg("vote")} className={"reveal "+(isVis("vote")?"on":"")} style={{ padding:"64px "+px, background:"#0b0a09", borderTop:"1px solid rgba(240,235,227,0.05)", position:"relative", overflow:"hidden" }}>
        {/* Desktop background accent */}
        {!isMobile && (
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 70% at 80% 50%, "+BLUE+"06 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 10% 80%, "+GOLD+"05 0%, transparent 55%)", pointerEvents:"none" }}/>
        )}
        <div style={{ maxWidth:"1280px", margin:"0 auto", position:"relative" }}>
          <SectionLabel text="Reader Signal"/>
          {isMobile ? (
            <div>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(22px,5vw,32px)", fontWeight:400, color:"#f0ebe3", marginBottom:"6px", lineHeight:1.2 }}>What should we publish next?</h2>
              <p style={{ fontSize:"13px", color:"rgba(240,235,227,0.35)", fontWeight:300, marginBottom:"28px" }}>Your signal shapes what we write. One vote.</p>
              <VoteOptions votedFor={votedFor} voteData={voteData} totalVotes={totalVotes} handleVote={handleVote}/>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"80px", alignItems:"start" }}>
              {/* Left: editorial copy */}
              <div style={{ paddingTop:"8px" }}>
                <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(26px,2.8vw,44px)", fontWeight:400, color:"#f0ebe3", marginBottom:"20px", lineHeight:1.15 }}>
                  What should we<br/>publish next<span style={{ color:GOLD }}>?</span>
                </h2>
                <p style={{ fontSize:"14px", color:"rgba(240,235,227,0.45)", fontWeight:300, lineHeight:1.75, marginBottom:"28px" }}>
                  Your signal shapes what we write. We track community interest across every topic and prioritize the next piece based on real demand — not guesswork.
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px", background:"rgba(0,186,220,0.06)", border:"1px solid "+BLUE+"20", borderRadius:"6px" }}>
                  <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:BLUE, animation:"greenGlow 2s ease infinite", flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:"11px", fontWeight:600, color:BLUE, letterSpacing:"0.08em", marginBottom:"2px" }}>{totalVotes.toLocaleString()} SIGNALS CAST</div>
                    <div style={{ fontSize:"11px", color:"rgba(240,235,227,0.35)", fontWeight:300 }}>across {VOTE_OPTIONS.length} topics so far</div>
                  </div>
                </div>
                {votedFor && <p style={{ fontSize:"12px", color:BLUE, marginTop:"16px" }}>Counted. Thanks for the signal.</p>}
              </div>
              {/* Right: vote options */}
              <VoteOptions votedFor={votedFor} voteData={voteData} totalVotes={totalVotes} handleVote={handleVote}/>
            </div>
          )}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <Testimonials/>

      {/* 9. TOOLS */}
      <section id="tools" ref={reg("tools")} className={"reveal "+(isVis("tools")?"on":"")} style={{ padding:"64px "+px }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <SectionLabel text="Tools and Calculators"/>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(20px,2.8vw,34px)", fontWeight:400, color:"#f0ebe3", marginBottom:"6px" }}>Practical instruments built from practice.</h2>
          <p style={{ fontSize:"13px", color:"rgba(240,235,227,0.35)", fontWeight:300, marginBottom:"36px" }}>30 years of workplace design intelligence, distilled into tools you can use today.</p>
          {isMobile ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              {TOOLS.map((t,i) => (
                <ToolCard key={t.name} tool={t} idx={i} hoveredTool={hoveredTool} setHoveredTool={setHoveredTool} isMobile={true}/>
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", background:"rgba(240,235,227,0.07)" }}>
                {TOOLS.slice(0,2).map((t,i) => (
                  <ToolCard key={t.name} tool={t} idx={i} hoveredTool={hoveredTool} setHoveredTool={setHoveredTool} isMobile={false}/>
                ))}
              </div>
              {/* Assessment — full-width desktop */}
              {(() => {
                const t = TOOLS[2]; const isHov = hoveredTool==="assessment";
                return (
                  <div onMouseEnter={()=>setHoveredTool("assessment")} onMouseLeave={()=>setHoveredTool(null)}
                    style={{ background:isHov?"#161412":"#0f0e0c", cursor:"pointer", borderTop:"1px solid rgba(240,235,227,0.06)", transition:"background 0.25s", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", alignItems:"center", padding:"36px 40px" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                        <span style={{ fontFamily:"'Playfair Display', serif", fontSize:"11px", color:"rgba(240,235,227,0.3)" }}>03</span>
                        <h3 style={{ fontSize:"18px", fontWeight:600, color:"#f0ebe3" }}>{t.name}</h3>
                      </div>
                      <p style={{ fontSize:"13px", lineHeight:1.7, color:"rgba(240,235,227,0.4)", marginBottom:"24px", fontWeight:300 }}>{t.desc} Get a visual breakdown of where you stand and where to focus next.</p>
                      <button style={{ background:"transparent", border:"1px solid rgba(240,235,227,0.5)", color:"rgba(240,235,227,0.75)", padding:"8px 20px", fontSize:"12px", letterSpacing:"0.09em", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600, borderRadius:"3px" }}>{t.cta+" →"}</button>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <ToolVisual type="assessment" active={isHov} large={true}/>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* 10. SUBSCRIBE */}
      <section id="subscribe" ref={reg("subscribe")} className={"reveal "+(isVis("subscribe")?"on":"")} style={{ padding:"64px "+px, background:"#0a0908", borderTop:"1px solid "+BLUE+"18" }}>
        <div style={{ maxWidth:"600px", margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
            <div style={{ width:"20px", height:"1px", background:BLUE }}/>
            <span style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.2em", color:BLUE, textTransform:"uppercase" }}>Stay in the Loop</span>
            <div style={{ width:"20px", height:"1px", background:BLUE }}/>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(22px,3.5vw,36px)", fontWeight:400, color:"#f0ebe3", marginBottom:"10px", lineHeight:1.2 }}>New thinking, straight to your inbox.</h2>
          <p style={{ fontSize:"13px", color:"rgba(240,235,227,0.38)", fontWeight:300, lineHeight:1.7, marginBottom:"32px" }}>No noise. When we publish something worth reading, you'll get it.</p>
          <EmailSubscribe/>
          <p style={{ fontSize:"10px", color:"rgba(240,235,227,0.2)", marginTop:"14px", letterSpacing:"0.04em" }}>No spam. Unsubscribe any time.</p>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer style={{ padding:"36px "+px+" 48px", borderTop:"1px solid "+BLUE+"15", background:"#080807" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:"24px", flexWrap:"wrap", paddingBottom:"22px", borderBottom:"1px solid rgba(240,235,227,0.04)", marginBottom:"16px" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
                <div style={{ display:"flex", alignItems:"center" }}>
                  <img src={LOGO} alt="NELSON" style={{ height:"16px", width:"auto", opacity:1, display:"block" }}/>
                </div>
                <div style={{ width:"1px", height:"16px", background:"rgba(240,235,227,0.1)" }}/>
                <span style={{ fontFamily:"'Playfair Display', serif", fontSize:"14px", color:"rgba(240,235,227,0.45)", letterSpacing:"0.02em" }}>Work Labs</span>
              </div>
              <p style={{ fontSize:"11px", color:"rgba(240,235,227,0.2)", maxWidth:"360px", lineHeight:1.65, fontWeight:300 }}>The thought leadership and tools platform of NELSON Worldwide's Asset Strategy + Workplace practice.</p>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
            <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
              {["Workplace Strategy","AI + Work","Asset Repositioning","Culture + Change"].map(t=>(
                <span key={t} style={{ fontSize:"9px", color:"rgba(240,235,227,0.16)", letterSpacing:"0.04em", cursor:"pointer" }}>{t}</span>
              ))}
            </div>
            <span style={{ fontSize:"9px", color:"rgba(240,235,227,0.12)", letterSpacing:"0.06em" }}>{cr(new Date().getFullYear())}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
