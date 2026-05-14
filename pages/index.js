import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BACKEND = "https://meutreino-ia-production.up.railway.app";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0a1520;
    --bg2:      #0d1e2e;
    --card:     #0f1e30;
    --card2:    #132540;
    --border:   rgba(255,255,255,0.07);
    --border2:  rgba(255,255,255,0.12);
    --accent:   #1ab3f0;
    --accent2:  #f46b1a;
    --blue:     #0e7fd4;
    --text:     #f0f2f5;
    --text2:    #6b7a8d;
    --text3:    #3d4a5c;
    --green:    #00e676;
    --r: 12px;
  }

  html, body { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    z-index: 1;
    padding-bottom: 80px;
  }

  .header {
    padding: 20px 16px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
    background: linear-gradient(180deg, var(--bg) 70%, transparent);
  }

  .logo-main {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 26px;
    letter-spacing: -0.5px;
    color: var(--text);
    text-transform: uppercase;
  }
  .logo-main span { color: var(--accent); }

  .live-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(26,179,240,0.08);
    border: 1px solid rgba(26,179,240,0.2);
    border-radius: 20px;
    padding: 5px 12px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--accent);
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .live-pill:hover { background: rgba(26,179,240,0.15); }
  .live-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: livepulse 2s infinite;
  }
  @keyframes livepulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(0.7); }
  }

  .hero {
    margin: 0 12px 16px;
    background: var(--card);
    border: 1px solid var(--border2);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #0e7fd4, #1ab3f0, #f46b1a);
  }
  .hero-label {
    padding: 14px 16px 0;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text2);
    text-transform: uppercase;
  }
  .hero-name {
    padding: 4px 16px 12px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -0.3px;
    line-height: 1.1;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--border);
  }
  .hero-stat {
    padding: 12px 8px;
    text-align: center;
    border-right: 1px solid var(--border);
  }
  .hero-stat:last-child { border-right: none; }
  .hero-stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--accent);
    display: block;
    line-height: 1;
  }
  .hero-stat-lbl {
    font-size: 10px;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 3px;
    display: block;
  }

  .section-title {
    padding: 4px 16px 10px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text2);
    text-transform: uppercase;
  }

  .treinos-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 12px;
  }

  .treino-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .treino-card.open {
    border-color: var(--border2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .treino-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .treino-row:hover { background: rgba(255,255,255,0.02); }

  .treino-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: rgba(26,179,240,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .treino-info { flex: 1; min-width: 0; }
  .treino-nome {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.1px;
  }
  .treino-meta {
    font-size: 12px;
    color: var(--text2);
    margin-top: 1px;
    font-family: 'Barlow Condensed', sans-serif;
    letter-spacing: 0.5px;
  }

  .treino-badges {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
    flex-shrink: 0;
  }
  .badge-pace {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
  }
  .badge-dist {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    color: var(--text2);
    letter-spacing: 0.3px;
  }
  .chevron {
    color: var(--text3);
    font-size: 14px;
    transition: transform 0.25s;
    margin-left: 4px;
    flex-shrink: 0;
  }
  .treino-card.open .chevron { transform: rotate(180deg); color: var(--accent); }

  .delete-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text3);
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
    margin-left: 2px;
  }
  .delete-btn:hover { border-color: #ff4466; color: #ff4466; background: rgba(255,68,102,0.08); }

  .confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadein 0.15s;
  }
  .confirm-box {
    background: var(--card);
    border: 1px solid var(--border2);
    border-radius: 18px;
    padding: 24px 20px;
    width: 100%;
    max-width: 320px;
    text-align: center;
    animation: slideup 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  .confirm-icon { font-size: 36px; margin-bottom: 12px; }
  .confirm-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 6px;
  }
  .confirm-desc {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
    margin-bottom: 20px;
  }
  .confirm-desc strong { color: var(--text); }
  .confirm-btns { display: flex; gap: 10px; }
  .confirm-cancel {
    flex: 1;
    padding: 11px;
    border-radius: 10px;
    border: 1px solid var(--border2);
    background: transparent;
    color: var(--text2);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }
  .confirm-cancel:hover { border-color: var(--text); color: var(--text); }
  .confirm-delete {
    flex: 1;
    padding: 11px;
    border-radius: 10px;
    border: none;
    background: #ff4466;
    color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }
  .confirm-delete:hover { background: #e0335a; }
  .confirm-delete:disabled { opacity: 0.6; cursor: not-allowed; }

  .treino-panel {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .treino-card.open .treino-panel {
    max-height: 3000px;
    border-top: 1px solid var(--border);
  }

  .stats-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-bottom: 1px solid var(--border);
  }
  .sstat {
    padding: 10px 8px;
    text-align: center;
    border-right: 1px solid var(--border);
  }
  .sstat:last-child { border-right: none; }
  .sstat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: var(--blue);
    display: block;
  }
  .sstat-lbl {
    font-size: 9px;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
    display: block;
  }

  .analise-block {
    padding: 14px;
    border-bottom: 1px solid var(--border);
  }
  .analise-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }
  .analise-tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--accent2);
    text-transform: uppercase;
  }
  .analise-line { flex: 1; height: 1px; background: var(--border); }
  .analise-text {
    font-size: 13px;
    line-height: 1.65;
    color: #9aa5b4;
  }
  .analise-text p { margin-bottom: 8px; }
  .analise-text h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin: 12px 0 4px;
    letter-spacing: 0.3px;
  }
  .analise-text h2 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: var(--accent);
    margin: 14px 0 6px;
    letter-spacing: 0.3px;
  }
  .analise-text strong { color: var(--text); font-weight: 600; }
  .analise-text hr { border: none; border-top: 1px solid var(--border); margin: 10px 0; }
  .analise-text ul { padding-left: 16px; margin-bottom: 8px; }
  .analise-text li { margin-bottom: 4px; }
  .analise-toggle {
    margin-top: 8px;
    font-size: 12px;
    color: var(--accent);
    cursor: pointer;
    font-weight: 600;
    background: none;
    border: none;
    padding: 0;
    font-family: 'Barlow', sans-serif;
  }

  .chat-block { padding: 12px 14px 14px; }
  .chat-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }
  .chat-tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--blue);
    text-transform: uppercase;
  }

  .chat-msgs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    max-height: 320px;
    overflow-y: auto;
  }
  .chat-msgs::-webkit-scrollbar { width: 3px; }
  .chat-msgs::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .cmsg { display: flex; flex-direction: column; }
  .cmsg.user { align-items: flex-end; }
  .cmsg.assistant { align-items: flex-start; }
  .cmsg-bubble {
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.5;
    max-width: 88%;
    white-space: pre-wrap;
  }
  .cmsg.user .cmsg-bubble {
    background: var(--accent);
    color: #000;
    font-weight: 600;
    border-radius: 12px 12px 3px 12px;
  }
  .cmsg.assistant .cmsg-bubble {
    background: var(--card2);
    border: 1px solid var(--border2);
    color: var(--text);
    border-radius: 3px 12px 12px 12px;
  }

  .typing {
    display: flex;
    gap: 4px;
    padding: 10px 12px;
    background: var(--card2);
    border: 1px solid var(--border2);
    border-radius: 3px 12px 12px 12px;
    width: fit-content;
  }
  .tdot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--text2);
    animation: tdots 1.1s infinite;
  }
  .tdot:nth-child(2) { animation-delay: 0.18s; }
  .tdot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes tdots {
    0%,80%,100% { transform:translateY(0); opacity:0.3; }
    40% { transform:translateY(-5px); opacity:1; }
  }

  .quick-qs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }
  .qq {
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid var(--border2);
    background: transparent;
    color: var(--text2);
    font-size: 11px;
    font-family: 'Barlow', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .qq:hover { border-color: var(--accent); color: var(--accent); background: rgba(26,179,240,0.05); }

  .chat-input-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }
  .chat-input {
    flex: 1;
    background: var(--card2);
    border: 1px solid var(--border2);
    border-radius: 10px;
    padding: 9px 12px;
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    resize: none;
    outline: none;
    min-height: 38px;
    max-height: 90px;
    transition: border-color 0.2s;
    line-height: 1.4;
  }
  .chat-input:focus { border-color: rgba(26,179,240,0.4); }
  .chat-input::placeholder { color: var(--text3); }
  .send-btn {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: var(--accent);
    border: none;
    color: #000;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .send-btn:hover { transform: scale(1.06); box-shadow: 0 4px 14px rgba(26,179,240,0.3); }
  .send-btn:disabled { background: var(--card2); color: var(--text3); cursor: not-allowed; transform: none; box-shadow: none; }

  .fab {
    position: fixed;
    bottom: 24px;
    right: calc(50% - 215px + 12px);
    width: 52px; height: 52px;
    border-radius: 16px;
    background: var(--accent);
    border: none;
    color: #000;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 24px rgba(26,179,240,0.35);
    z-index: 100;
    transition: all 0.2s;
  }
  .fab:hover { transform: scale(1.08); }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadein 0.2s;
  }
  @keyframes fadein { from{opacity:0} to{opacity:1} }

  .gchat-modal {
    width: 100%;
    max-width: 430px;
    height: 80vh;
    background: var(--bg2);
    border-radius: 20px 20px 0 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border2);
    border-bottom: none;
    animation: slideup 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideup { from{transform:translateY(100%)} to{transform:translateY(0)} }

  .gchat-header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .gchat-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
  }
  .gchat-title span { color: var(--accent); }
  .close-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1px solid var(--border2);
    background: transparent;
    color: var(--text2);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .close-btn:hover { border-color: var(--accent2); color: var(--accent2); }

  .gchat-msgs {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .gchat-msgs::-webkit-scrollbar { width: 3px; }
  .gchat-msgs::-webkit-scrollbar-thumb { background: var(--border2); }

  .gchat-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--text2);
    padding: 20px;
  }
  .gchat-empty-icon { font-size: 40px; }
  .gchat-empty-text { font-size: 13px; text-align: center; line-height: 1.5; }
  .gchat-suggestions { display: flex; flex-direction: column; gap: 6px; width: 100%; margin-top: 4px; }
  .gs-btn {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid var(--border2);
    background: var(--card);
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  .gs-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(26,179,240,0.04); }

  .gchat-input-area {
    padding: 10px 12px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    gap: 14px;
  }
  .loading-bar {
    width: 120px; height: 3px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }
  .loading-bar::after {
    content: '';
    display: block;
    height: 100%;
    width: 40%;
    background: var(--accent);
    border-radius: 2px;
    animation: loadslide 1.2s ease-in-out infinite;
  }
  @keyframes loadslide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
  }
  .loading-lbl {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--text2);
    text-transform: uppercase;
  }
`;

const GLOBAL_QS = [
  "📊 Como está minha evolução de pace?",
  "💪 Qual foi meu melhor treino recente?",
  "🎯 O que focar para ganhar velocidade?",
  "😴 Estou me recuperando bem?",
];

const TREINO_QS = [
  "Como foi minha intensidade?",
  "O que melhorar no próximo?",
  "Analise minha cadência",
];

function fmt(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function ChatBlock({ treino }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, activity_id: treino?.activity_id || null }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", content: d.response || "Sem resposta." }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "⚠️ Erro ao conectar. Tente novamente." }]);
    }
    setLoading(false);
  }

  return (
    <div className="chat-block">
      <div className="chat-header">
        <span className="chat-tag">💬 Coach IA</span>
        <div className="analise-line" />
      </div>
      {msgs.length === 0 && !loading && (
        <div className="quick-qs">
          {TREINO_QS.map(q => (
            <button key={q} className="qq" onClick={() => send(q)}>{q}</button>
          ))}
        </div>
      )}
      {(msgs.length > 0 || loading) && (
        <div className="chat-msgs">
          {msgs.map((m, i) => (
            <div key={i} className={`cmsg ${m.role}`}>
              <div className="cmsg-bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="typing">
              <div className="tdot" /><div className="tdot" /><div className="tdot" />
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Pergunte sobre este treino..."
          value={input}
          rows={1}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button className="send-btn" onClick={() => send()} disabled={!input.trim() || loading}>↑</button>
      </div>
    </div>
  );
}

function GlobalChat({ onClose }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", content: d.response || "Sem resposta." }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "⚠️ Erro ao conectar. Tente novamente." }]);
    }
    setLoading(false);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="gchat-modal" onClick={e => e.stopPropagation()}>
        <div className="gchat-header">
          <div className="gchat-title">Coach <span>IA</span></div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {msgs.length === 0 && !loading ? (
          <div className="gchat-empty">
            <div className="gchat-empty-icon">🤖</div>
            <div className="gchat-empty-text">Pergunte qualquer coisa sobre seus treinos e evolução</div>
            <div className="gchat-suggestions">
              {GLOBAL_QS.map(q => (
                <button key={q} className="gs-btn" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="gchat-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`cmsg ${m.role}`}>
                <div className="cmsg-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="typing">
                <div className="tdot" /><div className="tdot" /><div className="tdot" />
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
        <div className="gchat-input-area">
          <textarea
            className="chat-input"
            placeholder="Pergunte ao seu coach..."
            value={input}
            rows={1}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            autoFocus
          />
          <button className="send-btn" onClick={() => send()} disabled={!input.trim() || loading}>↑</button>
        </div>
      </div>
    </div>
  );
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*/.test(part) ? <strong key={i}>{part.replace(/\*\*/g, "")}</strong> : part
  );
}

function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^###\s/.test(line)) {
      elements.push(<h3 key={i}>{line.replace(/^###\s*/, "")}</h3>);
    } else if (/^##\s/.test(line)) {
      elements.push(<h2 key={i}>{line.replace(/^##\s*/, "")}</h2>);
    } else if (/^#\s/.test(line)) {
      elements.push(<h2 key={i}>{line.replace(/^#\s*/, "")}</h2>);
    } else if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} />);
    } else if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(<li key={i}>{parseBold(lines[i].replace(/^[-*]\s*/, ""))}</li>);
        i++;
      }
      elements.push(<ul key={"ul" + i}>{items}</ul>);
      continue;
    } else if (line.trim() !== "") {
      elements.push(<p key={i}>{parseBold(line)}</p>);
    }
    i++;
  }
  return elements;
}

function TreinoCard({ treino, defaultOpen, onDelete }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const [showFull, setShowFull] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const analise = treino.analysis || "";
  const analiseShort = analise.slice(0, 500);
  const hasMore = analise.length > 500;

  async function handleDelete() {
    setDeleting(true);
    await supabase.from("analyses").delete().eq("id", treino.id);
    setDeleting(false);
    setConfirm(false);
    onDelete(treino.id);
  }

  return (
    <>
      <div className={`treino-card ${open ? "open" : ""}`}>
        <div className="treino-row" onClick={() => setOpen(o => !o)}>
          <div className="treino-icon">🏃</div>
          <div className="treino-info">
            <div className="treino-nome">{treino.activity_name || "Treino"}</div>
            <div className="treino-meta">{fmt(treino.created_at)} · {treino.duration_min ? `${Math.round(treino.duration_min)} min` : "—"}</div>
          </div>
          <div className="treino-badges">
            <span className="badge-pace">{treino.pace || "—"}</span>
            <span className="badge-dist">{treino.distance_km ? `${treino.distance_km} km` : "—"}</span>
          </div>
          <button className="delete-btn" onClick={e => { e.stopPropagation(); setConfirm(true); }} title="Deletar treino">🗑</button>
          <span className="chevron">▼</span>
        </div>

      <div className="treino-panel">
        <div className="stats-strip">
          <div className="sstat">
            <span className="sstat-val">{treino.distance_km ?? "—"}</span>
            <span className="sstat-lbl">km</span>
          </div>
          <div className="sstat">
            <span className="sstat-val">{treino.heart_rate_avg ? Math.round(treino.heart_rate_avg) : "—"}</span>
            <span className="sstat-lbl">bpm</span>
          </div>
          <div className="sstat">
            <span className="sstat-val">{treino.duration_min ? Math.round(treino.duration_min) : "—"}</span>
            <span className="sstat-lbl">min</span>
          </div>
        </div>

        {analise && (
          <div className="analise-block">
            <div className="analise-header">
              <span className="analise-tag">⚡ Análise IA</span>
              <div className="analise-line" />
            </div>
            <div className="analise-text">
              {renderMarkdown(showFull ? analise : analiseShort)}
              {hasMore && !showFull && <p style={{color:"var(--text3)"}}>...</p>}
            </div>
            {hasMore && (
              <button className="analise-toggle" onClick={e => { e.stopPropagation(); setShowFull(v => !v); }}>
                {showFull ? "← Ver menos" : "Ver análise completa →"}
              </button>
            )}
          </div>
        )}

        <ChatBlock treino={treino} />
      </div>
    </div>

      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(false)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <div className="confirm-title">Deletar treino?</div>
            <div className="confirm-desc">
              <strong>{treino.activity_name || "Treino"}</strong> será removido permanentemente. Esta ação não pode ser desfeita.
            </div>
            <div className="confirm-btns">
              <button className="confirm-cancel" onClick={() => setConfirm(false)}>Cancelar</button>
              <button className="confirm-delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || "IAVMIACoachVini2026";

const loginCss = `
  .login-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    background: var(--bg);
  }
  .login-logo {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 36px;
    color: var(--text);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .login-logo span { color: var(--accent); }
  .login-sub {
    font-size: 13px;
    color: var(--text2);
    margin-bottom: 40px;
    font-family: 'Barlow', sans-serif;
  }
  .login-box {
    width: 100%;
    max-width: 320px;
    background: var(--card);
    border: 1px solid var(--border2);
    border-radius: 20px;
    padding: 28px 24px;
  }
  .login-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text2);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
  }
  .login-input {
    width: 100%;
    background: var(--card2);
    border: 1px solid var(--border2);
    border-radius: 10px;
    padding: 12px 14px;
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    font-size: 15px;
    outline: none;
    margin-bottom: 16px;
    transition: border-color 0.2s;
    letter-spacing: 2px;
  }
  .login-input:focus { border-color: rgba(26,179,240,0.4); }
  .login-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: var(--accent);
    border: none;
    color: #000;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .login-btn:hover { transform: scale(1.02); box-shadow: 0 4px 20px rgba(26,179,240,0.3); }
  .login-error {
    margin-top: 12px;
    text-align: center;
    font-size: 13px;
    color: #ff4466;
    font-family: 'Barlow', sans-serif;
  }
`;

export default function Home() {
  const [auth, setAuth] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gchat, setGchat] = useState(false);

  function handleDelete(id) {
    setTreinos(prev => prev.filter(t => t.id !== id));
  }

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("mti_auth") === "1") {
      setAuth(true);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    (async () => {
      const { data } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      setTreinos(data || []);
      setLoading(false);
    })();
  }, [auth]);

  function handleLogin() {
    if (pwInput === APP_PASSWORD) {
      sessionStorage.setItem("mti_auth", "1");
      setAuth(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput("");
    }
  }

  if (!auth) {
    return (
      <>
        <style>{css}</style>
        <style>{loginCss}</style>
        <div className="login-screen">
          <div className="login-logo">IA Coach Treino<span> - VM</span></div>
          <div className="login-sub">Acesso restrito</div>
          <div className="login-box">
            <span className="login-label">🔑 Senha</span>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••••••"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
            />
            <button className="login-btn" onClick={handleLogin}>ENTRAR</button>
            {pwError && <div className="login-error">Senha incorreta. Tente novamente.</div>}
          </div>
        </div>
      </>
    );
  }

  const ultimo = treinos[0];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <span className="logo-main">IA Coach Treino<span> - VM</span></span>
          <div className="live-pill" onClick={() => setGchat(true)}>
            <div className="live-dot" />
            Coach
          </div>
        </header>

        {loading ? (
          <div className="loading-wrap">
            <div className="loading-bar" />
            <span className="loading-lbl">Carregando treinos</span>
          </div>
        ) : (
          <>
            {ultimo && (
              <>
                <div className="section-title">Último treino</div>
                <div className="hero">
                  <div className="hero-label">🏃 {ultimo.activity_type || "Run"} · {fmt(ultimo.created_at)}</div>
                  <div className="hero-name">{ultimo.activity_name || "Treino"}</div>
                  <div className="hero-grid">
                    <div className="hero-stat">
                      <span className="hero-stat-val">{ultimo.distance_km ?? "—"}</span>
                      <span className="hero-stat-lbl">km</span>
                    </div>
                    <div className="hero-stat">
                      <span className="hero-stat-val">{ultimo.pace || "—"}</span>
                      <span className="hero-stat-lbl">min/km</span>
                    </div>
                    <div className="hero-stat">
                      <span className="hero-stat-val">{ultimo.heart_rate_avg ? Math.round(ultimo.heart_rate_avg) : "—"}</span>
                      <span className="hero-stat-lbl">bpm</span>
                    </div>
                    <div className="hero-stat">
                      <span className="hero-stat-val">{ultimo.duration_min ? Math.round(ultimo.duration_min) : "—"}</span>
                      <span className="hero-stat-lbl">min</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="section-title" style={{ marginTop: 16 }}>Histórico</div>
            <div className="treinos-list">
              {treinos.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text2)", padding: "40px 0", fontSize: 14 }}>
                  Nenhum treino ainda. Complete uma corrida no Strava!
                </div>
              ) : (
                treinos.map((t, i) => (
                  <TreinoCard key={t.id} treino={t} defaultOpen={i === 0} onDelete={handleDelete} />
                ))
              )}
            </div>
          </>
        )}
      </div>

      <button className="fab" onClick={() => setGchat(true)} title="Coach IA">🤖</button>
      {gchat && <GlobalChat onClose={() => setGchat(false)} />}
    </>
  );
}
