import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  async function fetchAnalyses() {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAnalyses(data)
    setLoading(false)
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  function getIntensityColor(hr) {
    if (!hr) return '#6c757d'
    if (hr < 130) return '#28a745'
    if (hr < 155) return '#ffc107'
    if (hr < 170) return '#fd7e14'
    return '#dc3545'
  }

  function getIntensityLabel(hr) {
    if (!hr) return 'N/A'
    if (hr < 130) return 'Leve'
    if (hr < 155) return 'Moderado'
    if (hr < 170) return 'Intenso'
    return 'Muito Intenso'
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>🏃</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>MeuTreinoIA</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Análises automáticas dos seus treinos</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Carregando treinos...</p>
          </div>
        )}

        {!loading && analyses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', background: '#1e293b', borderRadius: 16, marginTop: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏅</div>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>Nenhum treino ainda</h3>
            <p style={{ fontSize: 14 }}>Complete um treino no Strava e a análise aparecerá aqui automaticamente!</p>
          </div>
        )}

        {/* Lista de treinos */}
        {!loading && !selected && analyses.map(a => (
          <div
            key={a.id}
            onClick={() => setSelected(a)}
            style={{
              background: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12,
              cursor: 'pointer', border: '1px solid #334155',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{formatDate(a.created_at)}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>{a.activity_name || 'Treino'}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{a.activity_type}</div>
              </div>
              <div style={{
                background: getIntensityColor(a.heart_rate_avg),
                color: '#fff', borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap'
              }}>
                {getIntensityLabel(a.heart_rate_avg)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { icon: '📍', label: 'Distância', value: a.distance_km ? `${a.distance_km} km` : 'N/A' },
                { icon: '⏱️', label: 'Tempo', value: a.duration_min ? `${a.duration_min} min` : 'N/A' },
                { icon: '💓', label: 'FC Média', value: a.heart_rate_avg ? `${a.heart_rate_avg} bpm` : 'N/A' },
              ].map(m => (
                <div key={m.label} style={{ background: '#0f172a', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{m.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10, fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>👁️</span> Toque para ver análise completa
            </div>
          </div>
        ))}

        {/* Análise detalhada */}
        {selected && (
          <div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: '#334155', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}
            >
              ← Voltar
            </button>

            <div style={{ background: '#1e293b', borderRadius: 16, padding: 20, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{formatDate(selected.created_at)}</div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: 20, color: '#fff' }}>{selected.activity_name}</h2>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{selected.activity_type}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {[
                  { icon: '📍', label: 'Distância', value: selected.distance_km ? `${selected.distance_km} km` : 'N/A' },
                  { icon: '⏱️', label: 'Tempo', value: selected.duration_min ? `${selected.duration_min} min` : 'N/A' },
                  { icon: '🏃', label: 'Pace', value: selected.pace || 'N/A' },
                  { icon: '💓', label: 'FC Média', value: selected.heart_rate_avg ? `${selected.heart_rate_avg} bpm` : 'N/A' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#0f172a', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#0f172a', borderRadius: 12, padding: 16 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#3b82f6' }}>🤖 Análise do Coach IA</h3>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                  {selected.analysis}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
