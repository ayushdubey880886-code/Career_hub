import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import api from '../api'

const QUICK_SEARCHES = [
  'React Developer','Python Developer','Data Scientist','Backend Engineer',
  'DevOps Engineer','Android Developer','Machine Learning Engineer',
  'Full Stack Developer','Java Developer','Node.js Developer',
  'Cloud Engineer','UI/UX Designer','Flutter Developer','Golang Developer'
]

const ADZUNA_APP_ID  = '2b9b679f'
const ADZUNA_APP_KEY = '246ff6ced5fa8b3b3483f16bed4b71a7'

function stripHtml(t) { return (t||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim() }

function getTags(t) {
  const skills = ['Python','JavaScript','React','Node.js','Java','Flask','Django','AWS',
    'Docker','Kubernetes','SQL','MongoDB','TypeScript','Angular','Flutter','Android',
    'iOS','DevOps','Machine Learning','Data Science','TensorFlow','Golang','C++','Rust']
  return skills.filter(s => t.toLowerCase().includes(s.toLowerCase())).slice(0,5)
}

function isIntern(t) { return /intern|trainee|apprentice/i.test(t||'') }

function formatSalary(min, max) {
  if (!min && !max) return null
  const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${Math.round(n/1000)}K`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${fmt(min)}+`
  return null
}

// ── Adzuna India ──────────────────────────────────────────────────────────────
async function fromAdzunaIndia(q, page = 1) {
  try {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}` +
      `?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}` +
      `&results_per_page=20&what=${encodeURIComponent(q)}` +
      `&content-type=application/json`

    const r = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!r.ok) { console.warn('Adzuna error:', r.status); return [] }
    const d = await r.json()

    return (d.results || []).map(j => ({
      id: `az_${j.id || Math.random()}`,
      title: j.title || '',
      company: j.company?.display_name || '',
      location: '🇮🇳 ' + (j.location?.display_name || 'India'),
      description: stripHtml(j.description || '').slice(0, 400),
      salary_min: j.salary_min || null,
      salary_max: j.salary_max || null,
      salary_label: formatSalary(j.salary_min, j.salary_max),
      url: j.redirect_url || '#',
      tags: getTags((j.title || '') + ' ' + (j.description || '')),
      posted: j.created || '',
      type: isIntern(j.title) ? 'internship' : 'job',
      source: 'Adzuna 🇮🇳',
      logo: '',
      _score: 3
    }))
  } catch (e) { console.error('Adzuna fetch failed:', e); return [] }
}

// ── Himalayas fallback ────────────────────────────────────────────────────────
async function fromHimalayas(q) {
  try {
    const r = await fetch(
      `https://himalayas.app/jobs/api/search?q=${encodeURIComponent(q)}&limit=20`,
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }
    )
    if (!r.ok) return []
    const d = await r.json()
    return (d.jobs || []).map(j => {
      const locs = (j.locationRestrictions || []).join(', ')
      const desc = stripHtml(j.shortDescription || j.description || '')
      const locLower = locs.toLowerCase()
      const isIndia = locLower.includes('india') || locLower.includes('bangalore') ||
        locLower.includes('mumbai') || locLower.includes('delhi') || locLower.includes('hyderabad')
      const isRemote = ['worldwide','anywhere','global','remote'].some(w => locLower.includes(w))
      return {
        id: `hm_${j.id || Math.random()}`,
        title: j.title || '',
        company: j.companyName || '',
        location: isIndia ? '🇮🇳 ' + locs : isRemote ? '🌍 Remote / Worldwide' : locs || 'Remote',
        description: desc.slice(0, 400),
        salary_min: j.salaryMin || null,
        salary_max: j.salaryMax || null,
        url: j.applicationLink || `https://himalayas.app/jobs/${j.slug || ''}`,
        tags: getTags((j.title||'') + ' ' + (j.skills||[]).join(' ')),
        posted: j.createdAt || '',
        type: isIntern(j.title) ? 'internship' : 'job',
        source: 'Himalayas',
        logo: j.companyLogo || '',
        _score: isIndia ? 3 : isRemote ? 1 : 0
      }
    })
  } catch { return [] }
}

async function searchAllAPIs(q) {
  // Primary: Adzuna India
  const adzunaJobs = await fromAdzunaIndia(q)

  let allJobs = adzunaJobs

  // If Adzuna gave less than 5 results, also fetch Himalayas as supplement
  if (adzunaJobs.length < 5) {
    const himJobs = await fromHimalayas(q)
    // Only add Remote/India ones from Himalayas
    const filtered = himJobs.filter(j => (j._score || 0) >= 1)
    allJobs = [...adzunaJobs, ...filtered]
  }

  // Deduplicate
  const seen = new Set()
  const deduped = allJobs.filter(job => {
    const k = (job.title + job.company).toLowerCase().slice(0, 60)
    if (seen.has(k)) return false
    seen.add(k); return true
  })

  // Sort: India (3) → Remote (1) → Foreign (0)
  deduped.sort((a, b) => (b._score || 0) - (a._score || 0))

  const src = adzunaJobs.length > 0 ? 'Adzuna 🇮🇳 India' : 'Himalayas · Remote'
  return { jobs: deduped, source: src }
}

export default function Jobs() {
  const { user } = useAuth()
  const [jobs, setJobs]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [query, setQuery]       = useState('')
  const [location, setLocation] = useState('india')
  const [source, setSource]     = useState('')
  const [error, setError]       = useState('')
  const [searched, setSearched] = useState(false)
  const [gapJob, setGapJob]     = useState(null)
  const [gapResult, setGapResult] = useState(null)
  const [gapLoading, setGapLoading] = useState(false)

  const doSearch = async (q, loc) => {
    const sq = (q ?? query).trim()
    if (!sq) return
    setLoading(true); setError(''); setSearched(true); setJobs([])

    // Try backend first (5s timeout)
    let done = false
    try {
      const ctrl = new AbortController()
      setTimeout(() => ctrl.abort(), 5000)
      const { data } = await api.get(
        `/api/jobs/?q=${encodeURIComponent(sq)}&location=${encodeURIComponent(loc ?? location)}`,
        { signal: ctrl.signal }
      )
      const results = (data.results || []).filter(j => j.type !== 'internship')
      if (results.length > 0) {
        setJobs(results); setSource(data.source || 'Backend'); done = true
      }
    } catch {}

    // Direct browser APIs
    if (!done) {
      const { jobs: direct, source: src } = await searchAllAPIs(sq)
      const filtered = direct.filter(j => j.type !== 'internship')
      if (filtered.length > 0) {
        setJobs(filtered); setSource(src)
      } else {
        setError('Koi result nahi mila. Try: "python developer", "react developer", "software engineer"')
      }
    }
    setLoading(false)
  }

  const quickPick = (q) => { setQuery(q); doSearch(q) }

  const analyzeGap = async (job) => {
    if (!user) return alert('Skill Gap ke liye pehle login karo')
    setGapJob(job); setGapResult(null); setGapLoading(true)
    try {
      const { data } = await api.post('/api/jobs/skill-gap', {
        job_tags: job.tags || [], job_description: job.description || ''
      })
      setGapResult(data)
    } catch { setGapResult({ error: 'Backend nahi chal raha' }) }
    finally { setGapLoading(false) }
  }

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>💼 Jobs</h1>
          <p style={s.sub}>🇮🇳 India pehle (Adzuna) · then 🌍 Remote · Himalayas fallback</p>
        </div>
        {user && <div style={s.badge}><span style={s.dot}/>AI Ranked</div>}
      </div>

      <div style={s.row}>
        <input style={s.input}
          placeholder="Role: React Developer, Data Scientist, Python Developer..."
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()} />
        <input style={{ ...s.input, maxWidth: 160 }} placeholder="Location"
          value={location} onChange={e => setLocation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()} />
        <button style={s.searchBtn} onClick={() => doSearch()}>Search →</button>
      </div>

      <div style={s.pills}>
        {QUICK_SEARCHES.map(q => (
          <button key={q} style={s.pill} onClick={() => quickPick(q)}>{q}</button>
        ))}
      </div>

      {source && !error && <div style={s.sourceTag}>🟢 <b>{source}</b></div>}
      {error && <div style={s.errBox}>⚠️ {error}</div>}

      {loading && (
        <div style={s.center}>
          <span style={{ fontSize: 28, color: '#00ffb3' }}>↻</span>
          <span style={{ marginLeft: 14, color: 'var(--muted)', fontSize: 14 }}>
            Fetching jobs — India first (Adzuna)...
          </span>
        </div>
      )}

      {!loading && !searched && (
        <div style={s.empty}>
          <div style={{ fontSize: 56 }}>🔍</div>
          <h2 style={s.emptyH}>Real Jobs Dhundho</h2>
          <p style={s.emptyP}>
            India ke jobs pehle dikhenge 🇮🇳<br />
            Adzuna se direct India data · phir Remote 🌍
          </p>
        </div>
      )}

      {!loading && searched && (
        <>
          <p style={s.count}>{jobs.length} jobs mile</p>
          <div style={s.grid}>
            {jobs.map(j => (
              <div key={j.id} style={{ position: 'relative' }}>
                <Card item={j} type={j.type || 'job'} />
                {user && (
                  <button style={s.gapBtn} onClick={() => analyzeGap(j)}>🧠 Skill Gap</button>
                )}
              </div>
            ))}
          </div>
          {jobs.length === 0 && !error && (
            <div style={s.empty}>
              <p style={{ color: 'var(--muted)' }}>Koi job nahi mila. Dusri query try karo.</p>
            </div>
          )}
        </>
      )}

      {gapJob && (
        <div style={s.overlay} onClick={() => { setGapJob(null); setGapResult(null) }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 14, color: 'var(--text)', fontSize: 15 }}>
              🧠 Skill Gap: {gapJob.title}
            </h3>
            {gapLoading && <p style={{ color: '#00ffb3' }}>Analyzing...</p>}
            {gapResult && !gapResult.error && (
              <>
                {[
                  { label: 'Match', val: <b style={{ color: '#00ffb3', fontSize: 22 }}>{gapResult.match_percentage}%</b> },
                  { label: '✅ Tumhare paas', val: <span style={{ color: '#00ffb3', fontSize: 12 }}>{gapResult.matched_skills?.join(', ') || 'None'}</span> },
                  { label: '❌ Missing', val: <span style={{ color: '#ff6b8a', fontSize: 12 }}>{gapResult.missing_skills?.join(', ') || 'None'}</span> },
                ].map(({ label, val }) => (
                  <div key={label} style={s.gapRow}>
                    <span style={s.gapLabel}>{label}</span>{val}
                  </div>
                ))}
                <p style={{ color: '#ffd93d', marginTop: 12, fontSize: 13 }}>
                  💡 {gapResult.recommendation}
                </p>
              </>
            )}
            {gapResult?.error && <p style={{ color: '#ff6b8a' }}>{gapResult.error}</p>}
            <button style={s.closeBtn} onClick={() => { setGapJob(null); setGapResult(null) }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  h1: { fontSize: 24, fontWeight: 800, color: 'var(--text)' },
  sub: { fontSize: 11, color: 'var(--muted)', marginTop: 4 },
  badge: { display: 'flex', alignItems: 'center', gap: 7, padding: '5px 13px', background: 'rgba(0,255,179,0.08)', border: '1px solid rgba(0,255,179,0.2)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#00ffb3' },
  dot: { display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#00ffb3', boxShadow: '0 0 6px #00ffb3' },
  row: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  input: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 13, outline: 'none', flex: 1, minWidth: 150 },
  searchBtn: { padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#00ffb3,#00d4ff)', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },
  pills: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  pill: { padding: '5px 13px', borderRadius: 20, border: '1px solid rgba(0,255,179,0.25)', background: 'rgba(0,255,179,0.05)', color: '#00ffb3', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  sourceTag: { fontSize: 11, color: '#00ffb3', background: 'rgba(0,255,179,0.06)', border: '1px solid rgba(0,255,179,0.15)', borderRadius: 8, padding: '5px 12px', marginBottom: 12, display: 'inline-block' },
  errBox: { background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.25)', borderRadius: 10, padding: '10px 14px', color: '#ffd93d', fontSize: 12, marginBottom: 12, lineHeight: 1.6 },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 70 },
  count: { fontSize: 12, color: 'var(--muted)', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyH: { fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 },
  emptyP: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 },
  gapBtn: { position: 'absolute', bottom: 52, right: 16, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(0,255,179,0.3)', background: 'rgba(0,255,179,0.08)', color: '#00ffb3', fontSize: 11, cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: 'var(--bg2,#1a1a1a)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, minWidth: 320, maxWidth: 460 },
  gapRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: 12 },
  gapLabel: { fontSize: 12, color: 'var(--muted)', minWidth: 90 },
  closeBtn: { marginTop: 16, padding: '7px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' },
}
