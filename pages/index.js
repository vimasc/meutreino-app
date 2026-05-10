import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BACKEND_URL = "https://meutreino-ia-production.up.railway.app";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a26;
    --border: #2a2a3d;
    --accent: #00ff88;
    --accent2: #7c3aed;
    --text: #e8e8f0;
    --text2: #8888a8;
    --danger: #ff4466;
    --run: #ff6b35;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* HEADER */
  .header {
    padding: 20px 16px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .header-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .header-title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
  }
  .header-title span { color: var(--accent); }
  .chat-global-btn {
    background: var(--accent);
    color: var(--bg);
    border: none;
    border-radius: 20px;
    padding: 7px 14px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .chat-global-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,255,136,0.3); }

  /* TABS */
  .tabs {
    display: flex;
    padding: 12px 16px 0;
    gap: 4px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }
  .tab {
    padding: 8px 16px;
    border-radius: 8px 8px 0 0;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--text2);
    transition: all 0.2s;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.3px;
  }
  .tab.active {
    background: var(--surface);
    color: var(--accent);
    border: 1px solid var(--border);
    border-bottom: 1px solid var(--surface);
    margin-bottom: -1px;
  }

  /* TREINOS */
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .loading-text {
    text-align: center;
    color: var(--text2);
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    padding: 40px 0;
  }
  .loading-text::after {
    content: '...';
    animation: dots 1.2s infinite;
  }
  @keyframes dots {
    0% { content: '.'; }
    33% { content: '..'; }
    66% { content: '...'; }
  }

  .empty-state {
    text-align: center;
    color: var(--text2);
    padding: 60px 20px;
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; line-height: 1.5; }

  .treino-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .treino-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--run);
    border-radius: 3px 0 0 3px;
  }
  .treino-card:hover {
    border-color: var(--accent);
    transform: translateX(2px);
    box-shadow: -4px 0 0 var(--accent);
  }

  .treino-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .treino-nome {
    font-size: 15px;
    font-weight: 800;
    color: var(--text);
    flex: 1;
    padding-right: 8px;
    line-height: 1.2;
  }
  .treino-data {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--text2);
    white-space: nowrap;
  }

  .treino-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-bottom: 10px;
  }
  .stat {
    background: var(--surface2);
    border-radius: 8px;
    padding: 8px 6px;
    text-align: center;
  }
  .stat-val {
    font-family: 'Space Mono', monospace;
    font-size: 16px;
    font-weight: 700;
    color: var(--accent);
    display: block;
  }
  .stat-label {
    font-size: 9px;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
    display: block;
  }

  .treino-actions {
    display: flex;
    gap: 8px;
  }
  .btn-analise {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text2);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-analise:hover { border-color: var(--text2); color: var(--text); }
  .btn-chat-treino {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--accent2);
    background: rgba(124,58,237,0.1);
    color: var(--accent2);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-chat-treino:hover {
    background: rgba(124,58,237,0.2);
    color: #a78bfa;
  }

  /* MODAL DE ANÁLISE */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface);
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .modal-header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-title {
    font-size: 16px;
    font-weight: 800;
    color: var(--text);
  }
  .modal-close {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text2);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { border-color: var(--danger); color: var(--danger); }
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  .analise-text {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    font-family: 'Space Mono', monospace;
  }

  /* CHAT */
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: calc(100vh - 130px);
  }
  .chat-context-banner {
    margin: 10px 16px 0;
    padding: 8px 12px;
    background: rgba(124,58,237,0.15);
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 10px;
    font-size: 11px;
    color: #a78bfa;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chat-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text2);
    padding: 30px;
  }
  .chat-empty-icon { font-size: 44px; }
  .chat-empty-text { font-size: 13px; text-align: center; line-height: 1.5; }
  .chat-suggestions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    margin-top: 4px;
  }
  .suggestion-btn {
    padding: 9px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  .suggestion-btn:hover { border-color: var(--accent); color: var(--accent); }

  .msg {
    display: flex;
    flex-direction: column;
    max-width: 82%;
  }
  .msg.user { align-self: flex-end; align-items: flex-end; }
  .msg.assistant { align-self: flex-start; align-items: flex-start; }

  .msg-bubble {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  .msg.user .msg-bubble {
    background: var(--accent);
    color: var(--bg);
    border-radius: 16px 16px 4px 16px;
    font-weight: 600;
  }
  .msg.assistant .msg-bubble {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 4px 16px 16px 16px;
  }
  .msg-time {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--text2);
    margin-top: 3px;
    padding: 0 4px;
  }

  .typing-bubble {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px 16px 16px 16px;
    padding: 12px 16px;
    display: flex;
    gap: 5px;
    align-items: center;
    align-self: flex-start;
  }
  .typing-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--text2);
    animation: typing 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-6px); opacity: 1; }
  }

  .chat-input-area {
    padding: 10px 12px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
    align-items: flex-end;
    background: var(--bg);
  }
  .chat-input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    resize: none;
    outline: none;
    max-height: 100px;
    min-height: 44px;
    transition: border-color 0.2s;
    line-height: 1.4;
  }
  .chat-input:focus { border-color: var(--accent); }
  .chat-input::placeholder { color: var(--text2); }
  .send-btn {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--accent);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    font-size: 18px;
  }
  .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(0,255,136,0.3); }
  .send-btn:disabled { background: var(--border); cursor: not-allowed; transform: none; box-shadow: none; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const SUGGESTIONS_GLOBAL = [
  "📊 Como está minha evolução de pace?",
  "💪 Qual foi meu melhor treino recente?",
  "🎯 O que devo focar para melhorar velocidade?",
  "😴 Estou me recuperando bem?",
];

export default function Home() {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("treinos");
  const [modalAnalise, setModalAnalise] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatContext, setChatContext] = useState(null); // { id, name }
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadTreinos();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  async function loadTreinos() {
    setLoading(true);
    const { data } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    setTreinos(data || []);
    setLoading(false);
  }

  function openChat(context = null) {
    setChatContext(context);
    setChatMessages([]);
    setActiveTab("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendMessage(text) {
    const msg = text || chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");

    const userMsg = { role: "user", content: msg, time: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          activity_id: chatContext?.id || null,
        }),
      });
      const data = await res.json();
      const aiMsg = {
        role: "assistant",
        content: data.response || "Sem resposta do coach.",
        time: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Erro ao conectar com o coach. Tente novamente.",
          time: new Date(),
        },
      ]);
    }
    setChatLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="header-logo">
            <div className="header-dot" />
            <span className="header-title">
              Meu<span>Treino</span>IA
            </span>
          </div>
          <button className="chat-global-btn" onClick={() => openChat(null)}>
            🤖 Coach
          </button>
        </header>

        {/* TABS */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "treinos" ? "active" : ""}`}
            onClick={() => setActiveTab("treinos")}
          >
            🏃 Treinos
          </button>
          <button
            className={`tab ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            💬 Chat
          </button>
        </div>

        {/* TREINOS */}
        {activeTab === "treinos" && (
          <div className="content">
            {loading ? (
              <div className="loading-text">Carregando treinos</div>
            ) : treinos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏃</div>
                <div className="empty-text">
                  Nenhum treino ainda.<br />
                  Complete uma corrida no Strava para ver a análise aqui!
                </div>
              </div>
            ) : (
              treinos.map((t) => (
                <div className="treino-card" key={t.id}>
                  <div className="treino-header">
                    <div className="treino-nome">{t.activity_name || "Treino"}</div>
                    <div className="treino-data">{formatDate(t.created_at)}</div>
                  </div>
                  <div className="treino-stats">
                    <div className="stat">
                      <span className="stat-val">{t.distance_km ? `${t.distance_km}` : "—"}</span>
                      <span className="stat-label">km</span>
                    </div>
                    <div className="stat">
                      <span className="stat-val">{t.pace || "—"}</span>
                      <span className="stat-label">min/km</span>
                    </div>
                    <div className="stat">
                      <span className="stat-val">
                        {t.heart_rate_avg ? Math.round(t.heart_rate_avg) : "—"}
                      </span>
                      <span className="stat-label">bpm</span>
                    </div>
                  </div>
                  <div className="treino-actions">
                    <button
                      className="btn-analise"
                      onClick={() => setModalAnalise(t)}
                    >
                      📋 Ver análise
                    </button>
                    <button
                      className="btn-chat-treino"
                      onClick={() =>
                        openChat({ id: t.activity_id, name: t.activity_name })
                      }
                    >
                      💬 Perguntar ao coach
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CHAT */}
        {activeTab === "chat" && (
          <div className="chat-container">
            {chatContext && (
              <div className="chat-context-banner">
                🎯 Contexto: {chatContext.name}
              </div>
            )}
            <div className="chat-messages">
              {chatMessages.length === 0 && !chatLoading ? (
                <div className="chat-empty">
                  <div className="chat-empty-icon">🤖</div>
                  <div className="chat-empty-text">
                    {chatContext
                      ? `Tire dúvidas sobre "${chatContext.name}"`
                      : "Pergunte qualquer coisa sobre seus treinos"}
                  </div>
                  <div className="chat-suggestions">
                    {SUGGESTIONS_GLOBAL.map((s) => (
                      <button
                        key={s}
                        className="suggestion-btn"
                        onClick={() => sendMessage(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`msg ${m.role}`}>
                      <div className="msg-bubble">{m.content}</div>
                      <div className="msg-time">{formatTime(m.time)}</div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="typing-bubble">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Pergunte ao seu coach..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!chatInput.trim() || chatLoading}
              >
                ↑
              </button>
            </div>
          </div>
        )}

        {/* MODAL ANÁLISE */}
        {modalAnalise && (
          <div className="modal-overlay" onClick={() => setModalAnalise(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  {modalAnalise.activity_name || "Análise do Treino"}
                </div>
                <button
                  className="modal-close"
                  onClick={() => setModalAnalise(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="analise-text">
                  {modalAnalise.analysis || "Análise não disponível."}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
