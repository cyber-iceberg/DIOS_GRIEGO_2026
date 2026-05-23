'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import {
  QUOTES, DAYS, RFT_GUIDE, RULES, TRACKER_EXERCISES, OFFICE_HABITS,
} from '../data/plan'

const START_DATE = new Date('2026-06-01T00:00:00')

function currentWeek() {
  const now = new Date()
  const diff = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24 * 7)) + 1
  return Math.min(Math.max(diff, 1), 10)
}

function todayKey() {
  const map = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']
  return map[new Date().getDay()]
}

export default function Home() {
  const [tab, setTab] = useState('hoy')
  const [activeDay, setActiveDay] = useState(todayKey())
  const [week, setWeek] = useState(currentWeek())
  const [log, setLog] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  useEffect(() => {
    loadLog()
  }, [])

  async function loadLog() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('workout_log')
        .select('week, exercise_id, value')
      if (error) throw error
      const map = {}
      ;(data || []).forEach((r) => {
        if (!map[r.exercise_id]) map[r.exercise_id] = {}
        map[r.exercise_id][r.week] = Number(r.value)
      })
      setLog(map)
    } catch (e) {
      console.error('Error cargando log:', e)
    }
    setLoading(false)
  }

  async function saveWeek() {
    setSaving(true)
    try {
      const rows = []
      TRACKER_EXERCISES.forEach((ex) => {
        const v = log[ex.id]?.[week]
        if (v !== undefined && v !== '' && v !== null && !Number.isNaN(Number(v))) {
          rows.push({ user_id: 'robert', week, exercise_id: ex.id, value: Number(v) })
        }
      })
      for (const row of rows) {
        await supabase
          .from('workout_log')
          .delete()
          .eq('user_id', row.user_id)
          .eq('week', row.week)
          .eq('exercise_id', row.exercise_id)
      }
      if (rows.length) {
        const { error } = await supabase.from('workout_log').insert(rows)
        if (error) throw error
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error('Error guardando:', e)
    }
    setSaving(false)
  }

  function setVal(exId, value) {
    setLog((prev) => ({
      ...prev,
      [exId]: { ...(prev[exId] || {}), [week]: value },
    }))
  }

  const stats = useMemo(() => {
    const best = (id) => {
      const vals = log[id] ? Object.values(log[id]).map(Number).filter(Boolean) : []
      return vals.length ? Math.max(...vals) : null
    }
    return {
      dl: best('peso_muerto'),
      press: best('press_inclinado'),
      curl: best('curl'),
      dom: best('dominadas'),
    }
  }, [log])

  const day = DAYS.find((d) => d.key === activeDay)

  return (
    <div className="root">
      <Background />

      <header className="hd">
        <div className="hd-logo">
          <span className="hd-mark">⟁</span>
          <div>
            <h1>FORGE</h1>
            <p className="hd-sub">Protocolo Hollywood · 10 semanas</p>
          </div>
        </div>
        <div className="hd-week">
          <span className="hd-week-num">{String(week).padStart(2, '0')}</span>
          <span className="hd-week-lbl">/ 10</span>
        </div>
      </header>

      <div className="quote-bar">
        <span className="quote-mark">“</span>
        <p>{quote}</p>
      </div>

      <nav className="nav">
        {[
          ['hoy', 'Hoy', '◆'],
          ['plan', 'Plan', '▤'],
          ['rft', 'RFT', '◈'],
          ['progreso', 'Progreso', '◢'],
          ['reglas', 'Reglas', '◉'],
          ['oficina', 'Oficina', '▣'],
        ].map(([k, l, ic]) => (
          <button
            key={k}
            className={`nav-btn ${tab === k ? 'on' : ''}`}
            onClick={() => setTab(k)}
          >
            <span className="nav-ic">{ic}</span>
            {l}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === 'hoy' && <TodayView stats={stats} week={week} setTab={setTab} setActiveDay={setActiveDay} />}

        {tab === 'plan' && (
          <>
            <div className="day-strip">
              {DAYS.map((d) => (
                <button
                  key={d.key}
                  className={`day-chip ${d.train ? 'train' : 'rest'} ${activeDay === d.key ? 'on' : ''}`}
                  onClick={() => setActiveDay(d.key)}
                >
                  <span className="day-chip-d">{d.short}</span>
                  <span className="day-chip-l">{d.label}</span>
                </button>
              ))}
            </div>
            <DayView day={day} />
          </>
        )}

        {tab === 'rft' && <RftView />}

        {tab === 'progreso' && (
          <ProgressView
            log={log} week={week} setWeek={setWeek} setVal={setVal}
            saveWeek={saveWeek} saving={saving} saved={saved} loading={loading} stats={stats}
          />
        )}

        {tab === 'reglas' && <RulesView />}

        {tab === 'oficina' && <OfficeView />}
      </main>

      <footer className="ft">
        Cyber Iceberg · Forjado para no fallar ni una semana
      </footer>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bg: #07090d;
          --panel: #0d1118;
          --panel-2: #11161f;
          --line: #1c2330;
          --line-2: #2a3444;
          --txt: #e8edf4;
          --txt-2: #8b97a8;
          --txt-3: #5a6678;
          --acc: #00e5a0;
          --acc-dim: #0a3d2e;
          --acc-glow: rgba(0, 229, 160, 0.15);
          --gold: #d4af37;
          --warn: #ff8a3d;
          --rft: #5dd6ff;
        }
        html, body {
          background: var(--bg);
          color: var(--txt);
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .root {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 18px 60px;
          position: relative;
          z-index: 1;
        }
      `}</style>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap');

        h1 {
          font-family: 'Oswald', sans-serif;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 6px;
          line-height: 1;
          background: linear-gradient(90deg, var(--txt) 0%, var(--acc) 120%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hd {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 0 20px;
        }
        .hd-logo { display: flex; align-items: center; gap: 14px; }
        .hd-mark {
          font-size: 34px;
          color: var(--acc);
          filter: drop-shadow(0 0 12px var(--acc-glow));
        }
        .hd-sub {
          font-size: 11px;
          color: var(--txt-3);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .hd-week {
          font-family: 'Oswald', sans-serif;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .hd-week-num {
          font-size: 38px;
          font-weight: 700;
          color: var(--acc);
          line-height: 1;
        }
        .hd-week-lbl { font-size: 16px; color: var(--txt-3); }

        .quote-bar {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px 20px;
          background: linear-gradient(120deg, var(--panel) 0%, rgba(0,229,160,0.04) 100%);
          border: 1px solid var(--line);
          border-left: 2px solid var(--acc);
          border-radius: 10px;
          margin-bottom: 22px;
        }
        .quote-mark {
          font-family: 'Oswald', sans-serif;
          font-size: 40px;
          color: var(--acc);
          line-height: 0.7;
          opacity: 0.6;
        }
        .quote-bar p {
          font-size: 15px;
          font-weight: 500;
          font-style: italic;
          color: var(--txt);
          padding-top: 6px;
        }

        .nav {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 22px;
          scrollbar-width: none;
        }
        .nav::-webkit-scrollbar { display: none; }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 15px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          color: var(--txt-2);
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s;
        }
        .nav-btn:hover { border-color: var(--line-2); color: var(--txt); }
        .nav-btn.on {
          color: var(--acc);
          border-color: var(--acc-dim);
          background: linear-gradient(180deg, var(--acc-glow) 0%, var(--panel) 100%);
          box-shadow: 0 0 0 1px var(--acc-dim), 0 4px 20px var(--acc-glow);
        }
        .nav-ic { font-size: 11px; opacity: 0.85; }

        .ft {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--txt-3);
          text-align: center;
        }
      `}</style>
    </div>
  )
}

function Background() {
  return (
    <>
      <div className="bg-grid" />
      <div className="bg-glow" />
      <style jsx>{`
        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,229,160,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,160,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%);
        }
        .bg-glow {
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          z-index: 0;
          background: radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%);
          filter: blur(40px);
        }
      `}</style>
    </>
  )
}

function TodayView({ stats, week, setTab, setActiveDay }) {
  const tk = todayKey()
  const day = DAYS.find((d) => d.key === tk)
  const dayName = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado', dom: 'Domingo' }[tk]

  return (
    <div className="today">
      <div className="today-card">
        <span className="today-tag">{dayName} · Semana {week}</span>
        <h2 className="today-title">{day.title}</h2>
        {day.train ? (
          <button className="today-go" onClick={() => { setActiveDay(tk); setTab('plan') }}>
            Ver sesión completa →
          </button>
        ) : (
          <button className="today-go" onClick={() => { setActiveDay(tk); setTab('plan') }}>
            Ver protocolo de recuperación →
          </button>
        )}
      </div>

      <div className="stat-grid">
        <StatCard label="Peso muerto" value={stats.dl} unit="kg" goal={85} />
        <StatCard label="Press inclinado" value={stats.press} unit="kg" goal={24} />
        <StatCard label="Curl mancuerna" value={stats.curl} unit="kg" goal={22} />
        <StatCard label="Dominadas" value={stats.dom} unit="reps" goal={8} />
      </div>

      <style jsx>{`
        .today-card {
          padding: 26px 24px;
          background: linear-gradient(135deg, var(--panel) 0%, var(--panel-2) 100%);
          border: 1px solid var(--line);
          border-radius: 14px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        .today-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 180px; height: 100%;
          background: radial-gradient(circle at 100% 0%, var(--acc-glow) 0%, transparent 60%);
        }
        .today-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--acc);
        }
        .today-title {
          font-family: 'Oswald', sans-serif;
          font-size: 26px;
          font-weight: 600;
          margin: 10px 0 20px;
          line-height: 1.1;
          position: relative;
        }
        .today-go {
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--bg);
          background: var(--acc);
          border: none;
          padding: 11px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          box-shadow: 0 4px 24px var(--acc-glow);
        }
        .today-go:hover { transform: translateY(-1px); box-shadow: 0 6px 30px var(--acc-glow); }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
      `}</style>
    </div>
  )
}

function StatCard({ label, value, unit, goal }) {
  const pct = value ? Math.min(100, Math.round((value / goal) * 100)) : 0
  return (
    <div className="sc">
      <span className="sc-l">{label}</span>
      <div className="sc-v">
        {value ?? '—'}<span className="sc-u">{value ? unit : ''}</span>
      </div>
      <div className="sc-bar"><div className="sc-fill" style={{ width: `${pct}%` }} /></div>
      <span className="sc-goal">Meta: {goal} {unit}</span>
      <style jsx>{`
        .sc {
          padding: 16px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 11px;
        }
        .sc-l { font-size: 12px; color: var(--txt-2); }
        .sc-v {
          font-family: 'Oswald', sans-serif;
          font-size: 32px;
          font-weight: 600;
          color: var(--txt);
          margin: 4px 0 10px;
          line-height: 1;
        }
        .sc-u { font-size: 14px; color: var(--txt-3); margin-left: 4px; }
        .sc-bar { height: 3px; background: var(--line); border-radius: 3px; overflow: hidden; }
        .sc-fill {
          height: 3px;
          background: linear-gradient(90deg, var(--acc-dim), var(--acc));
          border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .sc-goal { font-size: 10px; color: var(--txt-3); margin-top: 7px; display: block; letter-spacing: 0.5px; }
      `}</style>
    </div>
  )
}

function DayView({ day }) {
  if (!day.train) {
    return (
      <div className="dv">
        <h2 className="dv-title">{day.title}</h2>
        <div className="rest-list">
          {day.opts.map((o, i) => (
            <div key={i} className="rest-item">
              <span className="rest-dot" />
              <p>{o}</p>
            </div>
          ))}
        </div>
        <style jsx>{styleDay}</style>
      </div>
    )
  }
  return (
    <div className="dv">
      <div className="dv-head">
        <h2 className="dv-title">{day.title}</h2>
        <div className="dv-tags">
          {day.focus.map((f, i) => <span key={i} className="dv-tag">{f}</span>)}
        </div>
      </div>
      {day.blocks.map((b, i) => (
        <div key={i} className={`block ${b.rft ? 'rft' : ''}`}>
          <div className="block-h">{b.t}</div>
          {b.exs.map((e, j) => (
            <div key={j} className="ex">
              <div className="ex-main">
                <div className="ex-n">{e.n}</div>
                <div className="ex-d">{e.d}</div>
              </div>
              <div className={`ex-s ${b.rft ? 'rft' : ''}`}>{e.s}</div>
            </div>
          ))}
        </div>
      ))}
      <style jsx>{styleDay}</style>
    </div>
  )
}

const styleDay = `
  .dv-head { margin-bottom: 18px; }
  .dv-title {
    font-family: 'Oswald', sans-serif;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.15;
    margin-bottom: 12px;
  }
  .dv-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .dv-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.5px;
    color: var(--acc);
    background: var(--acc-dim);
    padding: 4px 10px;
    border-radius: 6px;
  }
  .block {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 6px 18px 12px;
    margin-bottom: 12px;
  }
  .block.rft { border-color: rgba(93,214,255,0.18); background: linear-gradient(180deg, rgba(93,214,255,0.04), var(--panel)); }
  .block-h {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--txt-3);
    padding: 14px 0 10px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 4px;
  }
  .block.rft .block-h { color: var(--rft); }
  .ex {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid var(--line);
  }
  .ex:last-child { border-bottom: none; }
  .ex-main { flex: 1; min-width: 0; }
  .ex-n { font-size: 14px; font-weight: 500; color: var(--txt); }
  .ex-d { font-size: 12px; color: var(--txt-2); margin-top: 4px; line-height: 1.5; }
  .ex-s {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: var(--acc);
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 2px;
  }
  .ex-s.rft { color: var(--rft); }
  .rest-list { display: flex; flex-direction: column; gap: 4px; }
  .rest-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 18px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .rest-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--acc);
    margin-top: 6px;
    flex-shrink: 0;
    box-shadow: 0 0 8px var(--acc-glow);
  }
  .rest-item p { font-size: 13px; color: var(--txt-2); line-height: 1.55; }
`

function RftView() {
  return (
    <div className="rft-v">
      <div className="rft-intro">
        <h2>El bloque RFT</h2>
        <p>Movimiento animal y crawling antes del hierro. Activa el sistema nervioso central de una forma que el calentamiento clásico no consigue: cuando llegas a la primera serie pesada, las fibras rápidas ya están encendidas. Levantas más, coordinas mejor, te lesionas menos. 8–10 min al inicio de cada sesión.</p>
      </div>
      {RFT_GUIDE.map((m, i) => (
        <div key={i} className="rft-card">
          <div className="rft-card-h">
            <span className="rft-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="rft-name">{m.name}</span>
            <span className="rft-spec">{m.spec}</span>
          </div>
          <p className="rft-desc">{m.desc}</p>
        </div>
      ))}
      <style jsx>{`
        .rft-intro {
          padding: 22px;
          background: linear-gradient(135deg, rgba(93,214,255,0.06), var(--panel));
          border: 1px solid rgba(93,214,255,0.18);
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .rft-intro h2 {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--rft);
          margin-bottom: 10px;
        }
        .rft-intro p { font-size: 13px; color: var(--txt-2); line-height: 1.6; }
        .rft-card {
          padding: 16px 18px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 11px;
          margin-bottom: 10px;
        }
        .rft-card-h { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .rft-num {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--rft);
          opacity: 0.5;
        }
        .rft-name { font-size: 15px; font-weight: 600; color: var(--txt); flex: 1; }
        .rft-spec {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--rft);
          background: rgba(93,214,255,0.1);
          padding: 4px 10px;
          border-radius: 6px;
        }
        .rft-desc { font-size: 13px; color: var(--txt-2); line-height: 1.55; }
      `}</style>
    </div>
  )
}

function ProgressView({ log, week, setWeek, setVal, saveWeek, saving, saved, loading, stats }) {
  return (
    <div className="pv">
      <div className="pv-bar">
        <span className="pv-bar-l">Registrando semana</span>
        <select value={week} onChange={(e) => setWeek(Number(e.target.value))} className="pv-sel">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((w) => (
            <option key={w} value={w}>
              Semana {w}{w === 4 || w === 7 ? ' · descarga' : ''}{w === 10 ? ' · AGOSTO' : ''}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="pv-loading">Sincronizando con la nube…</div>
      ) : (
        <>
          {TRACKER_EXERCISES.map((ex) => {
            const target = Math.round((ex.start + (week - 1) * ex.step) * 100) / 100
            const val = log[ex.id]?.[week] ?? ''
            const allVals = log[ex.id]
              ? Object.entries(log[ex.id]).filter(([k]) => Number(k) <= week).map(([, v]) => Number(v)).filter(Boolean)
              : []
            const best = allVals.length ? Math.max(...allVals) : ex.start
            const maxT = ex.start + 9 * ex.step
            const pct = Math.min(100, Math.round(((best - ex.start) / (maxT - ex.start || 1)) * 100))
            const hit = val !== '' && Number(val) >= target
            return (
              <div key={ex.id} className="tex">
                <div className="tex-h">
                  <div>
                    <span className="tex-n">{ex.name}</span>
                    <span className="tex-sub">{ex.sub}</span>
                  </div>
                  <span className="tex-best">PR {best}</span>
                </div>
                <div className="tex-inputs">
                  <div className="tex-field">
                    <label>Objetivo</label>
                    <div className="tex-target">{target}</div>
                  </div>
                  <div className="tex-field">
                    <label>Tu marca</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={val}
                      placeholder={String(target)}
                      onChange={(e) => setVal(ex.id, e.target.value)}
                      className={hit ? 'hit' : ''}
                    />
                  </div>
                  {hit && <span className="tex-check">▲ objetivo</span>}
                </div>
                <div className="tex-bar"><div className="tex-fill" style={{ width: `${pct}%` }} /></div>
                <span className="tex-pct">{pct}% hacia agosto</span>
              </div>
            )
          })}
          <button className="pv-save" onClick={saveWeek} disabled={saving}>
            {saving ? 'Guardando…' : saved ? '✓ Guardado en la nube' : 'Guardar semana'}
          </button>
        </>
      )}

      <style jsx>{`
        .pv-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .pv-bar-l { font-size: 13px; color: var(--txt-2); }
        .pv-sel {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--txt);
          background: var(--panel);
          border: 1px solid var(--line-2);
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
        }
        .pv-loading { padding: 40px; text-align: center; color: var(--txt-3); font-size: 13px; }
        .tex {
          padding: 16px 18px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 11px;
          margin-bottom: 10px;
        }
        .tex-h { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .tex-n { font-size: 14px; font-weight: 500; color: var(--txt); }
        .tex-sub { font-size: 11px; color: var(--txt-3); margin-left: 8px; }
        .tex-best {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--gold);
          background: rgba(212,175,55,0.1);
          padding: 3px 9px;
          border-radius: 6px;
        }
        .tex-inputs { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 12px; }
        .tex-field { display: flex; flex-direction: column; gap: 5px; }
        .tex-field label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--txt-3);
        }
        .tex-target {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--txt-3);
          width: 80px;
          padding: 6px 0;
          text-align: center;
          border: 1px solid var(--line);
          border-radius: 8px;
        }
        .tex-field input {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--txt);
          width: 80px;
          padding: 6px 0;
          text-align: center;
          background: var(--panel-2);
          border: 1px solid var(--line-2);
          border-radius: 8px;
          outline: none;
          transition: all 0.18s;
        }
        .tex-field input:focus { border-color: var(--acc); box-shadow: 0 0 0 3px var(--acc-glow); }
        .tex-field input.hit { border-color: var(--acc); color: var(--acc); }
        .tex-check {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--acc);
          padding-bottom: 10px;
        }
        .tex-bar { height: 3px; background: var(--line); border-radius: 3px; overflow: hidden; }
        .tex-fill {
          height: 3px;
          background: linear-gradient(90deg, var(--acc-dim), var(--acc));
          border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .tex-pct { font-size: 10px; color: var(--txt-3); margin-top: 6px; display: block; }
        .pv-save {
          width: 100%;
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--acc);
          border: none;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.18s;
          box-shadow: 0 4px 24px var(--acc-glow);
        }
        .pv-save:hover:not(:disabled) { transform: translateY(-1px); }
        .pv-save:disabled { opacity: 0.7; cursor: default; }
      `}</style>
    </div>
  )
}

function RulesView() {
  return (
    <div className="rv">
      {RULES.map((r, i) => (
        <div key={i} className="rule">
          <span className="rule-i">◉</span>
          <div>
            <div className="rule-t">{r.t}</div>
            <div className="rule-d">{r.d}</div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .rule {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px 18px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 11px;
          margin-bottom: 10px;
        }
        .rule-i { color: var(--acc); font-size: 13px; margin-top: 2px; }
        .rule-t { font-size: 14px; font-weight: 500; color: var(--txt); margin-bottom: 4px; }
        .rule-d { font-size: 13px; color: var(--txt-2); line-height: 1.55; }
      `}</style>
    </div>
  )
}

function OfficeView() {
  return (
    <div className="ov">
      <div className="ov-intro">
        Trabajas en casa todo el día. La mayoría desperdicia eso. Tú lo conviertes en ventaja.
      </div>
      {OFFICE_HABITS.map((h, i) => (
        <div key={i} className="habit">
          <span className="habit-n">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <div className="habit-t">{h.t}</div>
            <div className="habit-d">{h.d}</div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .ov-intro {
          padding: 18px 20px;
          font-family: 'Oswald', sans-serif;
          font-size: 17px;
          font-weight: 500;
          line-height: 1.4;
          color: var(--txt);
          background: linear-gradient(135deg, rgba(212,175,55,0.06), var(--panel));
          border: 1px solid rgba(212,175,55,0.18);
          border-left: 2px solid var(--gold);
          border-radius: 11px;
          margin-bottom: 16px;
        }
        .habit {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px 18px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 11px;
          margin-bottom: 10px;
        }
        .habit-n {
          font-family: 'Oswald', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--acc);
          opacity: 0.5;
        }
        .habit-t { font-size: 14px; font-weight: 500; color: var(--txt); margin-bottom: 4px; }
        .habit-d { font-size: 13px; color: var(--txt-2); line-height: 1.55; }
      `}</style>
    </div>
  )
}
