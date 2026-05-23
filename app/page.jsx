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
  const [quote, setQuote] = useState(QUOTES[0])

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
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
      <div className="bg-grid" />
      <div className="bg-glow" />

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

      <main>
        {tab === 'hoy' && (
          <TodayView stats={stats} week={week} setTab={setTab} setActiveDay={setActiveDay} />
        )}

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
            saveWeek={saveWeek} saving={saving} saved={saved} loading={loading}
          />
        )}

        {tab === 'reglas' && <RulesView />}

        {tab === 'oficina' && <OfficeView />}
      </main>

      <footer className="ft">
        Cyber Iceberg · Forjado para no fallar ni una semana
      </footer>
    </div>
  )
}

function TodayView({ stats, week, setTab, setActiveDay }) {
  const tk = todayKey()
  const day = DAYS.find((d) => d.key === tk)
  const dayName = {
    lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves',
    vie: 'Viernes', sab: 'Sábado', dom: 'Domingo',
  }[tk]

  return (
    <div>
      <div className="today-card">
        <span className="today-tag">{dayName} · Semana {week}</span>
        <h2 className="today-title">{day.title}</h2>
        <button className="today-go" onClick={() => { setActiveDay(tk); setTab('plan') }}>
          {day.train ? 'Ver sesión completa →' : 'Ver protocolo de recuperación →'}
        </button>
      </div>

      <div className="stat-grid">
        <StatCard label="Peso muerto" value={stats.dl} unit="kg" goal={85} />
        <StatCard label="Press inclinado" value={stats.press} unit="kg" goal={24} />
        <StatCard label="Curl mancuerna" value={stats.curl} unit="kg" goal={22} />
        <StatCard label="Dominadas" value={stats.dom} unit="reps" goal={8} />
      </div>
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
    </div>
  )
}

function DayView({ day }) {
  if (!day.train) {
    return (
      <div>
        <h2 className="dv-title">{day.title}</h2>
        <div className="rest-list">
          {day.opts.map((o, i) => (
            <div key={i} className="rest-item">
              <span className="rest-dot" />
              <p>{o}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
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
    </div>
  )
}

function RftView() {
  return (
    <div>
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
    </div>
  )
}

function ProgressView({ log, week, setWeek, setVal, saveWeek, saving, saved, loading }) {
  return (
    <div>
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
    </div>
  )
}

function RulesView() {
  return (
    <div>
      {RULES.map((r, i) => (
        <div key={i} className="rule">
          <span className="rule-i">◉</span>
          <div>
            <div className="rule-t">{r.t}</div>
            <div className="rule-d">{r.d}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function OfficeView() {
  return (
    <div>
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
    </div>
  )
}
