import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import api from '../api'

const SKILL_OPTIONS = [
  'Python','JavaScript','TypeScript','React','Node.js','SQL','MongoDB','PostgreSQL',
  'Machine Learning','Data Science','Flask','Django','FastAPI','AWS','Azure','GCP',
  'Docker','Kubernetes','TensorFlow','PyTorch','Deep Learning','NLP','Computer Vision',
  'Java','C++','Go','Rust','Flutter','Android','iOS','React Native',
  'Scikit-learn','Pandas','NumPy','Redis','Kafka','Elasticsearch','Git','DevOps','CI/CD',
]

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [form, setForm]         = useState({ name:'', college:'', degree:'BTech', graduation_yr:'', skills:[], resume_text:'' })
  const [saved, setSaved]       = useState([])
  const [msg, setMsg]           = useState('')
  const [loading, setLoading]   = useState(false)
  const [tab, setTab]           = useState('profile')
  const [delConfirm, setDelConfirm] = useState(false)

  // Resume upload state
  const [resumeText, setResumeText]           = useState('')
  const [resumeLoading, setResumeLoading]     = useState(false)
  const [resumeResult, setResumeResult]       = useState(null)
  const [resumeError, setResumeError]         = useState('')
  const [dragOver, setDragOver]               = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    if (user) setForm({
      name: user.name || '', college: user.college || '',
      degree: user.degree || 'BTech', graduation_yr: user.graduation_yr || '',
      skills: user.skills || [], resume_text: '',
    })
    api.get('/api/user/saved').then(r => setSaved(r.data.saved || [])).catch(()=>{})
  }, [user])

  const toggleSkill = sk => setForm(f => ({
    ...f, skills: f.skills.includes(sk) ? f.skills.filter(s=>s!==sk) : [...f.skills, sk]
  }))

  const save = async e => {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      const { data } = await api.put('/api/user/profile', form)
      updateUser(data.user)
      setMsg('✅ Profile updated!')
    } catch { setMsg('❌ Update failed.') }
    finally { setLoading(false) }
  }

  // ── Resume parsing ──────────────────────────────────────────────────────────
  const readFile = file => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setResumeText(e.target.result)
    reader.readAsText(file)
  }

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false)
    readFile(e.dataTransfer.files[0])
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) { setResumeError('Resume text khaali hai.'); return }
    setResumeLoading(true); setResumeError(''); setResumeResult(null)
    try {
      const { data } = await api.post('/api/recommendations/resume', { resume_text: resumeText })
      setResumeResult(data)
      // Also update profile resume_text
      await api.put('/api/user/profile', { resume_text: resumeText })
    } catch (err) {
      setResumeError(err.response?.data?.error || 'Backend se connect nahi ho pa raha. Python app.py chalao.')
    } finally { setResumeLoading(false) }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <h1 style={s.h1}>{user?.name}</h1>
          <p style={s.sub}>{user?.email} · {user?.college || 'College not set'} · {user?.degree}</p>
          {user?.skills?.length > 0 && (
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:6 }}>
              {user.skills.slice(0,6).map(sk => (
                <span key={sk} style={s.skillTag}>{sk}</span>
              ))}
              {user.skills.length > 6 && <span style={s.skillTag}>+{user.skills.length-6}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[
          { key:'profile',  label:'👤 Profile' },
          { key:'resume',   label:'📄 Resume Upload & AI' },
          { key:'saved',    label:`🔖 Saved (${saved.length})` },
          { key:'security', label:'🔐 Security' },
        ].map(t => (
          <button key={t.key}
            style={{ ...s.tab, ...(tab===t.key ? s.tabActive : {}) }}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <form onSubmit={save} style={s.form}>
          {msg && <div style={{ ...s.msg, ...(msg.includes('✅') ? s.msgOk : s.msgErr) }}>{msg}</div>}
          <div style={s.row}>
            <Field label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <Field label="College / University" value={form.college} onChange={e=>setForm({...form,college:e.target.value})} />
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Degree</label>
              <select style={s.input} value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})}>
                {['BTech','MTech','BCA','MCA','BSc','MSc','MBA','PhD','Diploma','BCS'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <Field label="Graduation Year" type="number" value={form.graduation_yr}
              onChange={e=>setForm({...form,graduation_yr:parseInt(e.target.value)})} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Your Skills ({form.skills.length} selected)</label>
            <div style={s.skillGrid}>
              {SKILL_OPTIONS.map(sk => (
                <button key={sk} type="button"
                  style={{ ...s.skillBtn, ...(form.skills.includes(sk) ? s.skillActive : {}) }}
                  onClick={() => toggleSkill(sk)}>
                  {sk}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}

      {/* ── RESUME UPLOAD + AI TAB ── */}
      {tab === 'resume' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={s.resumeCard}>
            <h3 style={s.sectionTitle}>📄 Resume Upload → AI Job Recommendations</h3>
            <p style={{ fontSize:12, color:'var(--muted)', marginBottom:16, lineHeight:1.7 }}>
              Apna resume upload karo ya text paste karo. AI tumhare skills detect karke
              best-matched <b style={{ color:'var(--text)' }}>Jobs, Internships, Hackathons aur Webinars</b> recommend karega.
            </p>

            {/* Drag & Drop Zone */}
            <div
              style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : {}) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx"
                style={{ display:'none' }}
                onChange={e => readFile(e.target.files[0])} />
              <div style={{ fontSize:36, marginBottom:8 }}>📁</div>
              <div style={{ fontWeight:700, color:'var(--text)', fontSize:14 }}>
                Click to upload or drag & drop
              </div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>
                .txt file best kaam karta hai • PDF/DOC ka text copy-paste karo niche
              </div>
            </div>

            {/* Manual text area */}
            <div style={s.field}>
              <label style={s.label}>
                Or paste your resume text here:
              </label>
              <textarea
                style={{ ...s.input, minHeight:180, resize:'vertical', fontSize:12, lineHeight:1.7 }}
                placeholder={`Name: Ayush Dubey\nSkills: Python, React, Machine Learning, Flask, MongoDB\nExperience: Built an AI-powered career platform using Flask and PostgreSQL...\nEducation: BTech CSE, IIIT Gorakhpur, 2026\n\nProjects:\n- CareerHub: AI job aggregator (Flask + React + BERT)\n- Resume Parser: NLP-based skill extractor`}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>

            {resumeError && <div style={{ ...s.msg, ...s.msgErr }}>{resumeError}</div>}

            <button style={{ ...s.btn, maxWidth:'100%', marginTop:4 }}
              onClick={analyzeResume} disabled={resumeLoading}>
              {resumeLoading
                ? '🧠 AI Analyzing Resume...'
                : '🚀 Analyze Resume & Get Recommendations'}
            </button>
          </div>

          {/* Results */}
          {resumeResult && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Detected Skills */}
              <div style={s.resumeCard}>
                <h3 style={s.sectionTitle}>🎯 Detected Skills from Resume</h3>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                  {resumeResult.detected_skills?.length > 0
                    ? resumeResult.detected_skills.map(sk => (
                        <span key={sk} style={s.detectedSkill}>{sk}</span>
                      ))
                    : <span style={{ color:'var(--muted)', fontSize:12 }}>
                        No skills detected. Resume mein technical skills add karo.
                      </span>
                  }
                </div>
              </div>

              {/* Jobs */}
              {resumeResult.jobs?.length > 0 && (
                <div>
                  <h3 style={{ ...s.sectionTitle, marginBottom:14 }}>
                    💼 Matched Jobs ({resumeResult.jobs.length})
                  </h3>
                  <div style={s.cardGrid}>
                    {resumeResult.jobs.map(j => (
                      <Card key={j.id} item={j} type="job" />
                    ))}
                  </div>
                </div>
              )}

              {/* Internships */}
              {resumeResult.internships?.length > 0 && (
                <div>
                  <h3 style={{ ...s.sectionTitle, marginBottom:14 }}>
                    🎓 Matched Internships ({resumeResult.internships.length})
                  </h3>
                  <div style={s.cardGrid}>
                    {resumeResult.internships.map(j => (
                      <Card key={j.id} item={{ ...j, type:'internship' }} type="internship" />
                    ))}
                  </div>
                </div>
              )}

              {/* Hackathons */}
              {resumeResult.hackathons?.length > 0 && (
                <div>
                  <h3 style={{ ...s.sectionTitle, marginBottom:14 }}>
                    🏆 Matched Hackathons ({resumeResult.hackathons.length})
                  </h3>
                  <div style={s.cardGrid}>
                    {resumeResult.hackathons.map(h => (
                      <Card key={h.id} item={h} type="hackathon" />
                    ))}
                  </div>
                </div>
              )}

              {/* Webinars */}
              {resumeResult.webinars?.length > 0 && (
                <div>
                  <h3 style={{ ...s.sectionTitle, marginBottom:14 }}>
                    🎙️ Matched Webinars ({resumeResult.webinars.length})
                  </h3>
                  <div style={s.cardGrid}>
                    {resumeResult.webinars.map(w => (
                      <Card key={w.id} item={w} type="webinar" />
                    ))}
                  </div>
                </div>
              )}

              {resumeResult.source && (
                <div style={{ fontSize:11, color:'var(--muted)', textAlign:'center' }}>
                  🟢 Job data: {resumeResult.source}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SAVED TAB ── */}
      {tab === 'saved' && (
        <div>
          {saved.length === 0
            ? <div style={{ textAlign:'center', padding:60, color:'var(--muted)' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🔖</div>
                <div>No saved items yet.</div>
                <div style={{ fontSize:12, marginTop:6 }}>Star any opportunity to save it here.</div>
              </div>
            : <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {saved.map(item => (
                  <div key={item.item_id} style={s.savedItem}>
                    <span style={{ fontSize:22 }}>
                      {item.item_type==='job'?'💼':item.item_type==='internship'?'🎓':item.item_type==='hackathon'?'🏆':'🎙️'}
                    </span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>{item.title || item.item_id}</div>
                      <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>
                        {item.company && <span>{item.company} · </span>}
                        <span style={{ textTransform:'capitalize' }}>{item.item_type}</span>
                        {' · '}Saved {new Date(item.saved_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <span style={{ ...s.skillTag, textTransform:'capitalize' }}>{item.item_type}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {tab === 'security' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[
            { icon:'🔐', title:'JWT Authentication', text:'Session uses JWT tokens (1hr expiry, auto-refresh). Secure localStorage storage.', badge:'Active' },
            { icon:'🛡️', title:'AES-256 Encryption', text:'Personal data encrypted at rest with AES-256. All API calls via SSL/TLS.', badge:'Active' },
            { icon:'📋', title:'GDPR / Indian IT Act', text:'Data consent collected at signup. Your data is never sold to third parties.', badge:'Compliant' },
            { icon:'🚦', title:'Rate Limiting', text:'300 requests/day, 60/hour per IP. Prevents abuse and DDoS attacks.', badge:'Active' },
          ].map(c => (
            <div key={c.title} style={s.secCard}>
              <span style={{ fontSize:20 }}>{c.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:'var(--text)', fontSize:13, marginBottom:3 }}>{c.title}</div>
                <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.6 }}>{c.text}</div>
              </div>
              <span style={s.secBadge}>{c.badge}</span>
            </div>
          ))}

          <div style={{ ...s.secCard, borderColor:'rgba(255,107,107,0.3)', marginTop:8 }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:'#ff6b6b', fontSize:13, marginBottom:3 }}>Delete Account</div>
              <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.6 }}>
                Permanently delete your account and all data (GDPR: Right to Erasure).
              </div>
            </div>
            {!delConfirm
              ? <button style={{ ...s.secBadge, background:'rgba(255,107,107,0.1)', color:'#ff6b6b', cursor:'pointer', border:'1px solid rgba(255,107,107,0.3)' }}
                  onClick={() => setDelConfirm(true)}>Delete</button>
              : <div style={{ display:'flex', gap:8 }}>
                  <button style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'#ff6b6b', color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer' }}
                    onClick={() => api.delete('/api/user/delete-account').then(logout)}>
                    Confirm
                  </button>
                  <button style={{ padding:'6px 14px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer' }}
                    onClick={() => setDelConfirm(false)}>Cancel</button>
                </div>
            }
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input style={s.input} {...props} />
    </div>
  )
}

const s = {
  header:       { display:'flex', alignItems:'center', gap:16, marginBottom:24 },
  avatar:       { width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,#00ffb3,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:24, color:'#0B0F1A', flexShrink:0 },
  h1:           { fontSize:22, fontWeight:800, color:'var(--text)' },
  sub:          { fontSize:12, color:'var(--muted)', marginTop:3 },
  skillTag:     { padding:'3px 9px', borderRadius:20, background:'rgba(0,255,179,0.1)', border:'1px solid rgba(0,255,179,0.2)', color:'#00ffb3', fontSize:10, fontWeight:600 },
  tabs:         { display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid var(--border)', flexWrap:'wrap' },
  tab:          { padding:'10px 16px', borderRadius:'8px 8px 0 0', border:'none', background:'transparent', color:'var(--muted)', fontWeight:600, fontSize:12, cursor:'pointer' },
  tabActive:    { background:'var(--bg2)', color:'#00ffb3', borderBottom:'2px solid #00ffb3' },
  form:         { display:'flex', flexDirection:'column', gap:18 },
  row:          { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  field:        { display:'flex', flexDirection:'column', gap:5 },
  label:        { fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.5px' },
  input:        { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', color:'var(--text)', fontSize:13, outline:'none', fontFamily:'inherit' },
  skillGrid:    { display:'flex', flexWrap:'wrap', gap:6, marginTop:4 },
  skillBtn:     { padding:'5px 12px', borderRadius:20, border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', fontSize:11, fontWeight:600, cursor:'pointer' },
  skillActive:  { borderColor:'#00ffb3', color:'#00ffb3', background:'rgba(0,255,179,0.1)' },
  btn:          { padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#00ffb3,#00d4ff)', color:'#0B0F1A', fontWeight:700, fontSize:14, cursor:'pointer', maxWidth:220 },
  msg:          { padding:'10px 14px', borderRadius:8, fontSize:13 },
  msgOk:        { background:'rgba(0,255,179,0.1)', color:'#00ffb3', border:'1px solid rgba(0,255,179,0.3)' },
  msgErr:       { background:'rgba(255,107,107,0.1)', color:'#ff6b6b', border:'1px solid rgba(255,107,107,0.3)' },
  resumeCard:   { background:'var(--glass)', border:'1px solid var(--border)', borderRadius:16, padding:24 },
  sectionTitle: { fontSize:16, fontWeight:800, color:'var(--text)', marginBottom:8 },
  dropZone:     { border:'2px dashed var(--border)', borderRadius:12, padding:'32px 20px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', marginBottom:16 },
  dropZoneActive:{ borderColor:'#00ffb3', background:'rgba(0,255,179,0.04)' },
  detectedSkill:{ padding:'4px 12px', borderRadius:20, background:'rgba(0,255,179,0.12)', border:'1px solid rgba(0,255,179,0.25)', color:'#00ffb3', fontSize:12, fontWeight:600 },
  cardGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 },
  savedItem:    { display:'flex', alignItems:'center', gap:14, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px' },
  secCard:      { display:'flex', alignItems:'center', gap:14, background:'var(--bg2)', border:'1px solid rgba(0,255,179,0.15)', borderRadius:12, padding:16 },
  secBadge:     { padding:'4px 12px', borderRadius:20, background:'rgba(0,255,179,0.12)', color:'#00ffb3', fontSize:11, fontWeight:700, flexShrink:0 },
}
