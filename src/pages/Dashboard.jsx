import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import api from '../api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [feed, setFeed]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          const { data } = await api.get('/api/recommendations/feed')
          setFeed(data)
        } else {
          const [j, h, w] = await Promise.all([
            api.get('/api/jobs/?q=software+engineer'),
            api.get('/api/hackathons/'),
            api.get('/api/webinars/'),
          ])
          setFeed({ jobs: j.data.results?.slice(0,4)||[], hackathons: h.data.results?.slice(0,3)||[], webinars: w.data.results?.slice(0,3)||[] })
        }
      } catch { setFeed({ jobs:[], hackathons:[], webinars:[] }) }
      finally { setLoading(false) }
    }
    load()
  }, [user])

  const stats = [
    { label: 'Live Jobs',    value: '1,200+', color: '#00ffb3', icon: '◈', to: '/jobs' },
    { label: 'Internships',  value: '400+',   color: '#ff6b8a', icon: '◎', to: '/internships' },
    { label: 'Hackathons',   value: '20+',    color: '#ffd93d', icon: '◆', to: '/hackathons' },
    { label: 'Webinars',     value: '20+',    color: '#b794f4', icon: '◉', to: '/webinars' },
  ]

  return (
    <div style={s.page}>
      {/* Hero */}
      {!user ? (
        <div style={s.hero}>
          <div style={s.heroContent}>
            <div style={s.heroBadge}>
              <span style={s.heroBadgeDot} />
              AI-Powered Career Platform
            </div>
            <h1 style={s.heroTitle}>
              Find Your Next<br />
              <span className="gradient-text">Dream Opportunity</span>
            </h1>
            <p style={s.heroSub}>
              Jobs · Internships · Hackathons · Webinars — all in one intelligent platform powered by BERT semantic matching
            </p>
            <div style={s.heroBtns}>
              <button className="btn-neon" onClick={() => navigate('/register')} style={{ fontSize: 14, padding: '12px 28px' }}>
                Get Started Free →
              </button>
              <button style={s.heroBtn2} onClick={() => navigate('/jobs')}>
                Browse Jobs
              </button>
            </div>
          </div>
          {/* Floating cards decoration */}
          <div style={s.heroDecor}>
            {['◈ Software Engineer', '◆ Hackathon', '◉ Webinar', '◎ Internship'].map((label, i) => (
              <div key={i} style={{ ...s.floatingChip, animationDelay: `${i * 0.5}s`, top: `${20 + i * 18}%`, right: `${5 + (i % 2) * 20}%` }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={s.welcomeBar}>
          <div>
            <h1 style={s.welcomeTitle}>Welcome back, {user.name?.split(' ')[0]} 👋</h1>
            <p style={s.welcomeSub}>Your AI-powered dashboard — opportunities ranked by BERT semantic matching</p>
          </div>
          <div style={s.aiChip}>
            <div style={s.aiChipDot} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#00ffb3' }}>AI Matching Active</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={s.statsGrid}>
        {stats.map((st, i) => (
          <Link to={st.to} key={st.label} style={{ ...s.statCard, animationDelay: `${i * 0.1}s` }} className="fade-up">
            <div style={{ ...s.statIcon, color: st.color, background: `${st.color}15` }}>{st.icon}</div>
            <div style={{ ...s.statValue, color: st.color }}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
            <div style={{ ...s.statGlow, background: `radial-gradient(circle at center, ${st.color}15, transparent)` }} />
          </Link>
        ))}
      </div>

      {/* BERT Banner */}
      <div style={s.bertBanner} className="fade-up">
        <div style={s.bertLeft}>
          <div style={s.bertIcon}>🧠</div>
          <div>
            <div style={s.bertTitle}>BERT Semantic Engine Active</div>
            <div style={s.bertSub}>
              Opportunities matched using contextual embeddings — "Data Analyst" & "Data Scientist" both surfaced intelligently
            </div>
          </div>
        </div>
        <div style={s.bertBadge}>LIVE</div>
      </div>

      {loading ? (
        <div style={s.loading}>
          <div className="spin" style={{ fontSize: 24, color: '#00ffb3' }}>↻</div>
          <span style={{ color: 'var(--muted)', marginLeft: 12 }}>Loading AI-matched opportunities...</span>
        </div>
      ) : (
        <>
          {feed?.jobs?.length > 0 && (
            <Section title={user ? '🎯 AI-Matched Jobs' : '🔥 Latest Jobs'} to="/jobs" color="#00ffb3">
              {feed.jobs.map(j => <Card key={j.id} item={j} type="job" />)}
            </Section>
          )}
          {feed?.hackathons?.length > 0 && (
            <Section title="🏆 Active Hackathons" to="/hackathons" color="#ffd93d">
              {feed.hackathons.map(h => <Card key={h.id} item={h} type="hackathon" />)}
            </Section>
          )}
          {feed?.webinars?.length > 0 && (
            <Section title="🎙️ Upcoming Webinars" to="/webinars" color="#b794f4">
              {feed.webinars.map(w => <Card key={w.id} item={w} type="webinar" />)}
            </Section>
          )}
        </>
      )}
    </div>
  )
}

function Section({ title, to, color, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {title}
        </h2>
        <Link to={to} style={{ color, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.3px' }}>
          View all →
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: 1200 },

  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, padding: '32px 36px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 20, position: 'relative', overflow: 'hidden' },
  heroContent: { maxWidth: 500 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(0,255,179,0.08)', border: '1px solid rgba(0,255,179,0.2)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#00ffb3', marginBottom: 16, letterSpacing: '0.5px' },
  heroBadgeDot: { width: 6, height: 6, borderRadius: '50%', background: '#00ffb3', boxShadow: '0 0 8px #00ffb3', display: 'inline-block' },
  heroTitle: { fontSize: 38, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, color: 'var(--text)', marginBottom: 14, letterSpacing: '-1px' },
  heroSub: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24, maxWidth: 420 },
  heroBtns: { display: 'flex', gap: 12, alignItems: 'center' },
  heroBtn2: { padding: '12px 24px', borderRadius: 10, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  heroDecor: { position: 'relative', width: 200, height: 180, flexShrink: 0 },
  floatingChip: { position: 'absolute', padding: '6px 12px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, color: 'var(--text)', whiteSpace: 'nowrap', animation: 'float 3s ease infinite' },

  welcomeBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  welcomeTitle: { fontSize: 24, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' },
  welcomeSub: { color: 'var(--muted)', fontSize: 12, marginTop: 5 },
  aiChip: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(0,255,179,0.08)', border: '1px solid rgba(0,255,179,0.2)', borderRadius: 20 },
  aiChipDot: { width: 8, height: 8, borderRadius: '50%', background: '#00ffb3', boxShadow: '0 0 10px #00ffb3', animation: 'pulse 2s ease infinite' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 },
  statCard: { background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden', transition: 'transform 0.2s', textDecoration: 'none' },
  statIcon: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' },
  statLabel: { fontSize: 11, color: 'var(--muted)', fontWeight: 500 },
  statGlow: { position: 'absolute', inset: 0, pointerEvents: 'none' },

  bertBanner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'rgba(0,255,179,0.04)', border: '1px solid rgba(0,255,179,0.12)', borderRadius: 14, padding: '14px 20px', marginBottom: 28 },
  bertLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  bertIcon: { fontSize: 24 },
  bertTitle: { fontWeight: 700, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-display)', marginBottom: 3 },
  bertSub: { fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 },
  bertBadge: { padding: '4px 12px', background: 'rgba(0,255,179,0.15)', border: '1px solid rgba(0,255,179,0.3)', borderRadius: 6, fontSize: 10, fontWeight: 800, color: '#00ffb3', letterSpacing: '1px', flexShrink: 0 },

  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 },
}
