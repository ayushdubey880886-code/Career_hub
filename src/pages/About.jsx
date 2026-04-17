export default function About() {
  const team = [
    { name: 'Ayush Dubey', role: 'Full Stack + AI/ML', email: 'ayushdubey727272@gmail.com', avatar: 'A' },
    { name: 'Mohd Jabiullah Khan', role: 'Backend + Database', email: 'khanjabiullah649@gmail.com', avatar: 'M' },
    { name: 'Satyam Singh', role: 'Frontend + UI/UX', email: 'satyamsinghnigohi2404@gmail.com', avatar: 'S' },
  ]

  const tech = [
    { cat: 'Frontend', items: ['React 18', 'Vite', 'CSS-in-JS'], color: '#00ffb3' },
    { cat: 'Backend', items: ['Python', 'Flask 3.0', 'Gunicorn'], color: '#60a5fa' },
    { cat: 'Database', items: ['PostgreSQL', 'MongoDB', 'SQLAlchemy'], color: '#ffd93d' },
    { cat: 'AI / ML', items: ['BERT', 'TF-IDF', 'Scikit-learn', 'Cosine Similarity'], color: '#b794f4' },
    { cat: 'Security', items: ['AES-256', 'JWT', 'bcrypt', 'Rate Limiting'], color: '#ff6b8a' },
    { cat: 'APIs', items: ['JSearch', 'Ticketmaster', 'Eventbrite', 'Adzuna'], color: '#f6ad55' },
  ]

  const features = [
    { icon: '🎯', title: 'AI-Powered Matching', desc: 'BERT semantic engine matches you with opportunities based on contextual understanding, not just keywords.' },
    { icon: '💼', title: 'Real-Time Jobs', desc: 'Live job listings from LinkedIn, Indeed, Glassdoor via JSearch API — updated in real-time.' },
    { icon: '🏆', title: 'Hackathons', desc: '20+ curated hackathons from SIH, Infosys, Flipkart, Google, Microsoft and more.' },
    { icon: '🎙️', title: 'Webinars', desc: 'Free tech webinars from Google, AWS, GitHub, Scaler and industry experts.' },
    { icon: '🧠', title: 'Skill Gap Analyzer', desc: 'AI analyzes your skills vs job requirements and gives personalized learning roadmap.' },
    { icon: '🔐', title: 'Privacy First', desc: 'AES-256 encryption, JWT auth, GDPR compliance — your data is always protected.' },
  ]

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroBadge}>🎓 BTech Final Year Project 2026</div>
        <h1 style={s.h1}>About Career<span style={{ color: '#00ffb3' }}>Hub</span></h1>
        <p style={s.heroSub}>
          An AI-driven real-time opportunity aggregator for Jobs, Internships, Hackathons & Webinars.
          Built as a major project for B.Tech Data Science at BBDNITM Lucknow.
        </p>
        <div style={s.paperCard}>
          <span style={{ fontSize: 20 }}>📄</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Research Paper</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>"Career Hub: An AI-Driven Real-Time Opportunity Aggregator for Jobs, Internships, Webinars, and Hackathons"</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={s.sectionHeader}>
        <h2 style={s.h2}>✨ Key Features</h2>
      </div>
      <div style={s.featGrid}>
        {features.map(f => (
          <div key={f.title} style={s.featCard}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>{f.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div style={s.sectionHeader}>
        <h2 style={s.h2}>🛠️ Tech Stack</h2>
      </div>
      <div style={s.techGrid}>
        {tech.map(t => (
          <div key={t.cat} style={s.techCard}>
            <div style={{ ...s.techCat, color: t.color, borderBottom: `1px solid ${t.color}22` }}>{t.cat}</div>
            {t.items.map(item => (
              <div key={item} style={{ ...s.techItem, borderColor: `${t.color}20`, color: t.color + 'cc' }}>{item}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Team */}
      <div style={s.sectionHeader}>
        <h2 style={s.h2}>👥 Team</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>B.Tech CSE (Data Science) — BBDNITM Lucknow</p>
      </div>
      <div style={s.teamGrid}>
        {team.map(m => (
          <div key={m.name} style={s.teamCard}>
            <div style={s.teamAvatar}>{m.avatar}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: 12, color: '#00ffb3', marginBottom: 8 }}>{m.role}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>📧 {m.email}</div>
          </div>
        ))}
      </div>

      {/* Guide */}
      <div style={s.guideCard}>
        <div style={{ fontSize: 32 }}>👨‍🏫</div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>Project Guide</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Prof. Santosh Kumar Shukla</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Department of Computer Science, BBDNITM Lucknow</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>📧 santoshkumiet@gmail.com</div>
        </div>
      </div>

      {/* Institution */}
      <div style={s.instCard}>
        <div style={{ fontSize: 32 }}>🏛️</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Babu Banarasi Das Institute of Technology & Management</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Lucknow, Uttar Pradesh, India</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>B.Tech Computer Science Engineering — Data Science • Batch 2022-2026</div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: 900 },
  hero: { marginBottom: 28, padding: '32px', background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', background: 'rgba(0,255,179,0.08)', border: '1px solid rgba(0,255,179,0.15)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#00ffb3', marginBottom: 14 },
  h1: { fontSize: 32, fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne,sans-serif', letterSpacing: '-1px', marginBottom: 12 },
  heroSub: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 600, marginBottom: 20 },
  paperCard: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 12 },
  sectionHeader: { marginBottom: 16, marginTop: 32 },
  h2: { fontSize: 20, fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne,sans-serif' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 },
  featCard: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 },
  techCard: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 },
  techCat: { fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', paddingBottom: 10, marginBottom: 10 },
  techItem: { display: 'inline-flex', margin: '3px', padding: '4px 10px', borderRadius: 20, border: '1px solid', fontSize: 11, fontWeight: 600 },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 },
  teamCard: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' },
  teamAvatar: { width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#00ffb3,#b794f4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: '#060912', margin: '0 auto 12px' },
  guideCard: { display: 'flex', alignItems: 'center', gap: 20, padding: 24, background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, marginTop: 24 },
  instCard: { display: 'flex', alignItems: 'center', gap: 20, padding: 24, background: 'rgba(0,255,179,0.04)', border: '1px solid rgba(0,255,179,0.1)', borderRadius: 14, marginTop: 14 },
}
