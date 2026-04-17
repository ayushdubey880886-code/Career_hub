import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import api from '../api'

export default function ResumeUpload() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef(null)

  const [file,         setFile]         = useState(null)
  const [uploading,    setUploading]    = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadError,  setUploadError]  = useState('')
  const [recs,         setRecs]         = useState(null)
  const [recsLoading,  setRecsLoading]  = useState(false)
  const [dragOver,     setDragOver]     = useState(false)

  if (!user) {
    return (
      <div style={s.center}>
        <div style={{ fontSize: 56 }}>🔒</div>
        <h2 style={s.emptyH}>Login Required</h2>
        <p style={s.emptyP}>Resume upload aur AI recommendations ke liye login karo.</p>
        <button style={s.loginBtn} onClick={() => navigate('/login')}>Login karo →</button>
      </div>
    )
  }

  const handleFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf','doc','docx','txt'].includes(ext)) {
      setUploadError('Sirf PDF, DOC, DOCX, ya TXT files allowed hain.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setUploadError('File 5MB se bada nahi hona chahiye.')
      return
    }
    setFile(f); setUploadError(''); setUploadResult(null); setRecs(null)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const upload = async () => {
    if (!file) return
    setUploading(true); setUploadError(''); setUploadResult(null); setRecs(null)
    const form = new FormData()
    form.append('resume', file)
    try {
      const { data } = await api.post('/api/user/resume', form,
        { headers: { 'Content-Type': 'multipart/form-data' } })
      setUploadResult(data)
      fetchRecs()
    } catch (err) {
      setUploadError(err.response?.data?.error || 'Upload failed — backend chal raha hai?')
    } finally {
      setUploading(false)
    }
  }

  const fetchRecs = async () => {
    setRecsLoading(true)
    try {
      const { data } = await api.get('/api/user/resume/recommendations')
      setRecs(data)
    } catch (err) {
      setUploadError(err.response?.data?.error || 'Recommendations load nahi hui.')
    } finally {
      setRecsLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>📄 Resume Upload</h1>
          <p style={s.sub}>
            Resume upload karo → AI automatically skills detect karega → personalized recommendations milegi
          </p>
        </div>
        {uploadResult && (
          <div style={s.successBadge}>✅ Resume Uploaded</div>
        )}
      </div>

      {/* Upload Zone */}
      <div
        style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : {}) }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt"
          style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {file ? '📋' : '📁'}
        </div>
        {file ? (
          <>
            <div style={s.fileName}>{file.name}</div>
            <div style={s.fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
          </>
        ) : (
          <>
            <div style={s.dropTitle}>Resume drag karo ya click karke select karo</div>
            <div style={s.dropSub}>PDF, DOC, DOCX, TXT · Max 5MB</div>
          </>
        )}
      </div>

      {uploadError && <div style={s.errBox}>⚠️ {uploadError}</div>}

      {file && !uploadResult && (
        <button style={s.uploadBtn} onClick={upload} disabled={uploading}>
          {uploading ? (
            <span>↻ Uploading aur parsing...</span>
          ) : (
            <span>🚀 Upload karo aur AI Recommendations lo</span>
          )}
        </button>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div style={s.resultCard}>
          <div style={s.resultTitle}>✅ Resume Successfully Parsed!</div>
          <div style={s.resultGrid}>
            <div style={s.resultItem}>
              <span style={s.resultLabel}>File</span>
              <span style={s.resultVal}>{uploadResult.resume_filename}</span>
            </div>
            <div style={s.resultItem}>
              <span style={s.resultLabel}>Text extracted</span>
              <span style={s.resultVal}>{uploadResult.text_length?.toLocaleString()} characters</span>
            </div>
            <div style={s.resultItem}>
              <span style={s.resultLabel}>Skills detected</span>
              <span style={s.resultVal}>{uploadResult.skills_detected?.length || 0} skills</span>
            </div>
          </div>

          {uploadResult.skills_detected?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={s.skillsLabel}>🎯 Detected Skills:</div>
              <div style={s.skillsPills}>
                {uploadResult.skills_detected.map(sk => (
                  <span key={sk} style={s.skillPill}>{sk}</span>
                ))}
              </div>
            </div>
          )}

          {uploadResult.all_skills?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={s.skillsLabel}>📚 All Your Skills (profile updated):</div>
              <div style={s.skillsPills}>
                {uploadResult.all_skills.map(sk => (
                  <span key={sk} style={{ ...s.skillPill, ...s.skillPillAll }}>{sk}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recsLoading && (
        <div style={s.loadingBox}>
          <span style={{ fontSize: 28, color: '#00ffb3' }}>↻</span>
          <span style={{ marginLeft: 14, color: 'var(--muted)', fontSize: 14 }}>
            AI aapke resume ke liye best opportunities dhundh raha hai...
          </span>
        </div>
      )}

      {recs && !recsLoading && (
        <div style={{ marginTop: 32 }}>
          <div style={s.recHeader}>
            <div style={s.recTitle}>🤖 AI Recommendations — Based on Your Resume</div>
            <div style={s.recSub}>Skills used: {recs.skills_used?.join(', ')}</div>
          </div>

          {recs.jobs?.length > 0 && (
            <RecSection title="💼 Matched Jobs" color="#00ffb3" items={recs.jobs} type="job" navigate={navigate} to="/jobs" />
          )}
          {recs.internships?.length > 0 && (
            <RecSection title="🎓 Matched Internships" color="#ff6b8a" items={recs.internships} type="internship" navigate={navigate} to="/internships" />
          )}
          {recs.hackathons?.length > 0 && (
            <RecSection title="🏆 Recommended Hackathons" color="#ffd93d" items={recs.hackathons} type="hackathon" navigate={navigate} to="/hackathons" />
          )}
          {recs.webinars?.length > 0 && (
            <RecSection title="🎙️ Recommended Webinars" color="#b794f4" items={recs.webinars} type="webinar" navigate={navigate} to="/webinars" />
          )}

          {!recs.jobs?.length && !recs.internships?.length && !recs.hackathons?.length && (
            <div style={s.center}>
              <p style={{ color:'var(--muted)', fontSize:14 }}>
                Backend se data nahi aaya. JSearch API key check karo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Already has resume */}
      {user.has_resume && !uploadResult && !file && (
        <div style={s.existingBox}>
          <div style={{ fontSize: 20 }}>📋</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>Resume already uploaded hai</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3 }}>New file upload karo replace karne ke liye ya</div>
          </div>
          <button style={s.reloadBtn} onClick={fetchRecs}>
            {recsLoading ? '↻ Loading...' : 'Recommendations reload karo'}
          </button>
        </div>
      )}
    </div>
  )
}

function RecSection({ title, color, items, type, navigate, to }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <h2 style={{ fontSize:16, fontWeight:800, color:'var(--text)', display:'flex', alignItems:'center', gap:8 }}>
          {title}
          <span style={{ fontSize:11, padding:'2px 8px', background:`${color}20`, color, borderRadius:10, fontWeight:700 }}>
            {items.length}
          </span>
        </h2>
        <button onClick={() => navigate(to)} style={{ color, fontSize:12, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
          View all →
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {items.map(item => (
          <Card key={item.id || Math.random()} item={item} type={type} />
        ))}
      </div>
    </div>
  )
}

const s = {
  page:           { maxWidth: 1000 },
  header:         { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 },
  h1:             { fontSize:24, fontWeight:800, color:'var(--text)' },
  sub:            { fontSize:12, color:'var(--muted)', marginTop:5, lineHeight:1.6 },
  successBadge:   { padding:'6px 14px', background:'rgba(0,255,179,0.1)', border:'1px solid rgba(0,255,179,0.3)', borderRadius:20, fontSize:12, fontWeight:700, color:'#00ffb3' },

  dropZone:       { border:'2px dashed rgba(255,255,255,0.15)', borderRadius:16, padding:'48px 24px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', marginBottom:16, background:'var(--glass)' },
  dropZoneActive: { borderColor:'#00ffb3', background:'rgba(0,255,179,0.05)' },
  dropTitle:      { fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:8 },
  dropSub:        { fontSize:12, color:'var(--muted)' },
  fileName:       { fontSize:15, fontWeight:700, color:'#00ffb3', marginBottom:4 },
  fileSize:       { fontSize:12, color:'var(--muted)' },

  errBox:         { background:'rgba(255,107,138,0.08)', border:'1px solid rgba(255,107,138,0.25)', borderRadius:10, padding:'12px 16px', color:'#ff6b8a', fontSize:13, marginBottom:12 },

  uploadBtn:      { width:'100%', padding:'14px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#00ffb3,#00d4ff)', color:'#000', fontWeight:800, fontSize:15, cursor:'pointer', marginBottom:24, transition:'opacity 0.2s' },

  resultCard:     { background:'rgba(0,255,179,0.05)', border:'1px solid rgba(0,255,179,0.2)', borderRadius:16, padding:24, marginBottom:24 },
  resultTitle:    { fontSize:15, fontWeight:800, color:'#00ffb3', marginBottom:16 },
  resultGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 },
  resultItem:     { display:'flex', flexDirection:'column', gap:4 },
  resultLabel:    { fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.5px' },
  resultVal:      { fontSize:13, fontWeight:700, color:'var(--text)' },

  skillsLabel:    { fontSize:11, color:'var(--muted)', marginBottom:8, fontWeight:600 },
  skillsPills:    { display:'flex', flexWrap:'wrap', gap:6 },
  skillPill:      { padding:'4px 10px', borderRadius:20, background:'rgba(0,255,179,0.12)', border:'1px solid rgba(0,255,179,0.25)', color:'#00ffb3', fontSize:11, fontWeight:600 },
  skillPillAll:   { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--muted)' },

  loadingBox:     { display:'flex', alignItems:'center', justifyContent:'center', padding:60, background:'var(--glass)', borderRadius:16, marginTop:16 },

  recHeader:      { marginBottom:24, padding:'16px 20px', background:'rgba(0,255,179,0.04)', border:'1px solid rgba(0,255,179,0.12)', borderRadius:12 },
  recTitle:       { fontSize:17, fontWeight:800, color:'var(--text)', marginBottom:6 },
  recSub:         { fontSize:12, color:'var(--muted)' },

  existingBox:    { display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:12, marginTop:16 },
  reloadBtn:      { marginLeft:'auto', padding:'8px 16px', borderRadius:8, border:'1px solid rgba(0,255,179,0.3)', background:'rgba(0,255,179,0.08)', color:'#00ffb3', fontSize:12, fontWeight:700, cursor:'pointer' },

  center:         { textAlign:'center', padding:'60px 20px' },
  emptyH:         { fontSize:22, fontWeight:800, color:'var(--text)', margin:'16px 0 8px' },
  emptyP:         { fontSize:13, color:'var(--muted)', marginBottom:20 },
  loginBtn:       { padding:'12px 28px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#00ffb3,#00d4ff)', color:'#000', fontWeight:800, fontSize:14, cursor:'pointer' },
}
