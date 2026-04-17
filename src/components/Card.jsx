import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const TYPE = {
  job:        { color: '#00ffb3', bg: 'rgba(0,255,179,0.08)',  border: 'rgba(0,255,179,0.15)',  label: 'JOB',        icon: '◈' },
  internship: { color: '#ff6b8a', bg: 'rgba(255,107,138,0.08)', border: 'rgba(255,107,138,0.15)', label: 'INTERN',    icon: '◎' },
  hackathon:  { color: '#ffd93d', bg: 'rgba(255,217,61,0.08)',  border: 'rgba(255,217,61,0.15)',  label: 'HACKATHON', icon: '◆' },
  webinar:    { color: '#b794f4', bg: 'rgba(183,148,244,0.08)', border: 'rgba(183,148,244,0.15)', label: 'WEBINAR',   icon: '◉' },
}

export default function Card({ item, type, savedInit = false }) {
  const { user } = useAuth()
  const cfg = TYPE[type] || TYPE.job
  const [saved, setSaved]   = useState(savedInit)
  const [saving, setSaving] = useState(false)
  const [hovered, setHovered] = useState(false)

  const fmtSalary = (mn, mx) => {
    if (!mn && !mx) return null
    const f = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}k`
    return mn && mx ? `${f(mn)} – ${f(mx)}` : f(mn || mx)
  }

  const toggleSave = async (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!user) return alert('Please login to save')
    setSaving(true)
    try {
      await api.post('/api/user/saved', { item_id: item.id, item_type: type, title: item.title, company: item.company || item.organizer || item.host })
      setSaved(s => !s)
    } catch {}
    finally { setSaving(false) }
  }

  const trackClick = () => {
    if (user) api.post('/api/jobs/interact', { item_id: item.id, item_type: type, action: 'click' }).catch(() => {})
  }

  return (
    <div
      style={{
        ...s.card,
        borderColor: hovered ? cfg.border : 'var(--border)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${cfg.color}18` : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fade-up"
    >
      {/* Top row */}
      <div style={s.top}>
        <span style={{ ...s.typeBadge, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          {cfg.icon} {cfg.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.match_score != null && (
            <div style={s.matchScore}>
              <svg width={28} height={28} viewBox="0 0 28 28" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5"/>
                <circle cx="14" cy="14" r="11" fill="none" stroke={cfg.color} strokeWidth="2.5"
                  strokeDasharray={`${(item.match_score/100)*69} 69`} strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color, position: 'absolute' }}>
                {Math.round(item.match_score)}
              </span>
            </div>
          )}
          <button style={{ ...s.saveBtn, color: saved ? '#ffd93d' : 'var(--muted)' }} onClick={toggleSave} disabled={saving}>
            {saved ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 style={s.title}>{item.title}</h3>

      {/* Meta */}
      <div style={s.meta}>
        <span style={{ ...s.metaItem, color: cfg.color }}>
          {item.company || item.organizer || item.host}
        </span>
        {(item.location || item.mode) && (
          <span style={s.metaItem}>
            <span style={{ marginRight: 4, opacity: 0.6 }}>⊙</span>
            {item.location || item.mode}
          </span>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p style={s.desc}>{item.description.slice(0, 100)}...</p>
      )}

      {/* Tags */}
      {item.tags?.length > 0 && (
        <div style={s.tags}>
          {item.tags.slice(0, 4).map(t => (
            <span key={t} style={{ ...s.tag, borderColor: `${cfg.color}20`, color: cfg.color + 'aa' }}>{t}</span>
          ))}
        </div>
      )}

      {/* Bottom */}
      <div style={s.bottom}>
        <div style={s.salary}>
          {fmtSalary(item.salary_min, item.salary_max) || item.prize || item.stipend || (item.free ? '🎉 Free' : '')}
        </div>
        <a
          href={item.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...s.applyBtn, background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}bb)` }}
          onClick={trackClick}
        >
          {type === 'webinar' ? 'Register' : type === 'hackathon' ? 'Join' : 'Apply'} →
        </a>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        {item.posted && <span>📅 {new Date(item.posted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
        {item.deadline && <span>⏰ Deadline: {item.deadline}</span>}
        {item.date && <span>🗓 {item.date} {item.time || ''}</span>}
        {item.difficulty && <span style={{ color: item.difficulty === 'Advanced' ? 'var(--red)' : item.difficulty === 'Intermediate' ? 'var(--yellow)' : 'var(--green)' }}>● {item.difficulty}</span>}
      </div>
    </div>
  )
}

const s = {
  card: {
    background: 'var(--glass)',
    backdropFilter: 'blur(12px)',
    border: '1px solid',
    borderRadius: 16,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.8px', fontFamily: 'var(--font-display)' },
  matchScore: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 },
  saveBtn: { background: 'transparent', border: 'none', fontSize: 17, cursor: 'pointer', transition: 'transform 0.2s', padding: 2, lineHeight: 1 },
  title: { fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, fontFamily: 'var(--font-display)' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  metaItem: { fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center' },
  desc: { fontSize: 11, color: 'rgba(160,174,192,0.7)', lineHeight: 1.5 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  tag: { fontSize: 9, padding: '3px 8px', borderRadius: 20, border: '1px solid', background: 'transparent', fontWeight: 600, letterSpacing: '0.3px' },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  salary: { fontSize: 13, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' },
  applyBtn: { padding: '7px 16px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 11, color: '#060912', cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-display)', letterSpacing: '0.3px', transition: 'opacity 0.2s' },
  footer: { display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 9, color: 'var(--muted)', marginTop: 2 },
}
