import { useState } from 'react'
import Card from '../components/Card'
import api from '../api'

const QUICK_SEARCHES = [
  'React Developer','Python','Data Science','Machine Learning',
  'Android Developer','Flutter','Java','DevOps','Node.js','UI/UX',
  'Full Stack','Backend','Frontend','Data Analyst'
]

const ADZUNA_APP_ID  = '2b9b679f'
const ADZUNA_APP_KEY = '246ff6ced5fa8b3b3483f16bed4b71a7'

function stripHtml(t) { return (t||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim() }

function getTags(t) {
  const skills = ['Python','JavaScript','React','Node.js','Java','Flask','Django','AWS',
    'Docker','SQL','MongoDB','TypeScript','Flutter','Android','iOS','DevOps','Machine Learning','Data Science']
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

// ── Adzuna India Internships ──────────────────────────────────────────────────
async function fromAdzunaInternIndia(q) {
  try {
    // Search with "intern" keyword appended for better results
    const searchQuery = q.toLowerCase().includes('intern') ? q : `${q} intern`
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1` +
      `?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}` +
      `&results_per_page=20&what=${encodeURIComponent(searchQuery)}` +
      `&content-type=application/json`

    const r = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!r.ok) { console.warn('Adzuna internship error:', r.status); return [] }
    const d = await r.json()

    // Filter to only internship-like results
    const all = (d.results || [])
    const interns = all.filter(j => isIntern(j.title || '') || isIntern(j.description || ''))
    // If strict filter gives too few, use all results
    const final = interns.length >= 3 ? interns : all

    return final.map(j => ({
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
      type: 'internship',
      source: 'Adzuna 🇮🇳',
      logo: '',
      _score: 3
    }))
  } catch (e) { console.error('Adzuna intern fetch failed:', e); return [] }
}

// ── Himalayas Internships fallback ────────────────────────────────────────────
async function fromHimalayasInterns(q) {
  try {
    const r = await fetch(
      `https://himalayas.app/jobs/api/search?q=${encodeURIComponent(q)}&limit=20&employment_type=Intern`,
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
        type: 'internship',
        source: 'Himalayas',
        logo: j.companyLogo || '',
        _score: isIndia ? 3 : isRemote ? 1 : 0
      }
    })
  } catch { return [] }
}

export default function Internships() {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [query, setQuery]       = useState('')
  const [source, setSource]     = useState('')
  const [error, setError]       = useState('')
  const [searched, setSearched] = useState(false)

  const doSearch = async (q) => {
    const sq = (q ?? query).trim()
    if (!sq) return
    setLoading(true); setError(''); setSearched(true); setData([])

    // Try backend first (5s)
    let done = false
    try {
      const ctrl = new AbortController()
      setTimeout(() => ctrl.abort(), 5000)
      const { data: d } = await api.get(
        `/api/jobs/internships?q=${encodeURIComponent(sq)}`,
        { signal: ctrl.signal }
      )
      if ((d.results || []).length > 0) {
        setData(d.results.map(i => ({ ...i, type: 'internship' })))
        setSource(d.source || 'Backend')
        done = true
      }
    } catch {}

    if (!done) {
      // Primary: Adzuna India internships
      const adzunaJobs = await fromAdzunaInternIndia(sq)

      let allJobs = adzunaJobs

      // Supplement with Himalayas if Adzuna gave less than 5
      if (adzunaJobs.length < 5) {
        const himJobs = await fromHimalayasInterns(sq)
        const indiaRemote = himJobs.filter(j => (j._score || 0) >= 1)
        allJobs = [...adzunaJobs, ...indiaRemote]
      }

      // Deduplicate
      const seen = new Set()
      const deduped = allJobs.filter(item => {
        const k = (item.title + item.company).toLowerCase().slice(0, 60)
        if (seen.has(k)) return false
        seen.add(k); return true
      })

      deduped.sort((a, b) => (b._score || 0) - (a._score || 0))

      if (deduped.length > 0) {
        setData(deduped)
        setSource(adzunaJobs.length > 0 ? 'Adzuna 🇮🇳 India Internships' : 'Himalayas · Remote Internships')
      } else {
        setError('Koi internship nahi mila. Try: "python", "react", "data science", "software"')
      }
    }
    setLoading(false)
  }

  const quickPick = (q) => { setQuery(q); doSearch(q) }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.h1}>🎓 Internships</h1>
        <p style={s.sub}>🇮🇳 India pehle (Adzuna) · then 🌍 Remote (Himalayas fallback)</p>
      </div>

      <div style={s.row}>
        <input style={s.input}
          placeholder="Domain: React, Python, Data Science, ML, Android..."
          value={query} onChange={e => setQuery(e.target.value)}
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
          <span style={{ fontSize: 28, color: '#ff6b8a' }}>↻</span>
          <span style={{ marginLeft: 14, color: 'var(--muted)', fontSize: 14 }}>
            Fetching internships — India first (Adzuna)...
          </span>
        </div>
      )}

      {!loading && !searched && (
        <div style={s.empty}>
          <div style={{ fontSize: 56 }}>🎓</div>
          <h2 style={s.emptyH}>Real Internships Dhundho</h2>
          <p style={s.emptyP}>
            India ke internships pehle dikhenge 🇮🇳<br />
            Adzuna se direct India data · phir Remote 🌍
          </p>
        </div>
      )}

      {!loading && searched && (
        <>
          <p style={s.count}>{data.length} internships mile</p>
          <div style={s.grid}>
            {data.map(i => (
              <Card key={i.id} item={{ ...i, type: 'internship' }} type="internship" />
            ))}
          </div>
          {data.length === 0 && !error && (
            <div style={s.empty}>
              <p style={{ color: 'var(--muted)' }}>Koi internship nahi mila. Dusri query try karo.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const s = {
  header: { marginBottom: 20 },
  h1: { fontSize: 24, fontWeight: 800, color: 'var(--text)' },
  sub: { fontSize: 11, color: 'var(--muted)', marginTop: 4 },
  row: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  input: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 13, outline: 'none', flex: 1, minWidth: 150 },
  searchBtn: { padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#ff6b8a,#ff4d6d)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  pills: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  pill: { padding: '5px 13px', borderRadius: 20, border: '1px solid rgba(255,107,138,0.25)', background: 'rgba(255,107,138,0.05)', color: '#ff6b8a', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  sourceTag: { fontSize: 11, color: '#00ffb3', background: 'rgba(0,255,179,0.06)', border: '1px solid rgba(0,255,179,0.15)', borderRadius: 8, padding: '5px 12px', marginBottom: 12, display: 'inline-block' },
  errBox: { background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.25)', borderRadius: 10, padding: '10px 14px', color: '#ffd93d', fontSize: 12, marginBottom: 12, lineHeight: 1.6 },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 70 },
  count: { fontSize: 12, color: 'var(--muted)', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyH: { fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 },
  emptyP: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 },
}
