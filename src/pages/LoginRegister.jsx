import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LiquidBackground from '../components/LiquidBackground'

const SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'Machine Learning',
  'Data Science', 'Flask', 'Django', 'AWS', 'Docker', 'TensorFlow', 'Deep Learning', 'NLP', 'Java', 'C++',
  'Pandas', 'NumPy', 'Scikit-learn', 'PyTorch', 'Git', 'TypeScript']

// ── Login ──────────────────────────────────────────────────────────────────────
export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('');

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/.test(form.password)) {
      setError('Password must be 8-15 chars, with upper, lowercase, and special character.')
      return
    }

    setLoading(true)
    try { await login(form.email.trim(), form.password); navigate('/') }
    catch (err) { setError(err.response?.data?.error || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <LiquidBackground />

      <div style={s.buddyContainer}>
        {/* Left Hero: Robot with Glows */}
        <div style={s.buddyHero}>
          <div className="glow-ring pulse" style={{ width: 420, height: 420, top: '5%', left: '-10%' }}></div>
          <div className="glow-ring pulse" style={{ width: 320, height: 320, bottom: '15%', right: '5%', animationDelay: '1.20s' }}></div>

          <div className="buddy-bubble" style={{ top: '62%', left: '8%' }}>
            Hello, Can you help me?
          </div>
          <div className="buddy-bubble" style={{ top: '75%', left: '28%', background: '#1c4d6b', animationDelay: '0.3s' }}>
            <span style={{ color: 'var(--accent)' }}>Buddy!</span><br />
            Sure, Buddy is ready to help you
          </div>

          <img src="/robot_buddy.png" alt="Buddy" className="crawl" style={s.buddyImg} />
        </div>

        {/* Right Form: Glass Navy */}
        <div style={s.buddyFormSide}>
          <div style={s.glassForm}>
            <div style={s.buddyLogoHeader}>
              <div style={s.avatarCircle}><img src="/robot_buddy.png" style={{ width: 32 }} /></div>
              <h2 style={s.buddyFormTitle}>Welcome to Login <span style={{ color: 'var(--accent)' }}>Buddy!</span></h2>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handle} style={s.form}>
              <Field icon="✉️" label="Email Address" type="email" required placeholder="name@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Field icon="🔒" label="Password" type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

              <button type="submit" style={s.buddySubmit} disabled={loading}>
                {loading ? <span className="spin">↻</span> : 'Sign In'}
              </button>
            </form>

            <p style={s.buddySwitch}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign Up</Link>
            </p>

            <div style={s.footerLinks}>
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Register ──────────────────────────────────────────────────────────────────
export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', degree: 'BTech', graduation_yr: new Date().getFullYear() + 1, skills: [], data_consent: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const toggleSkill = (sk) => setForm(f => ({ ...f, skills: f.skills.includes(sk) ? f.skills.filter(s => s !== sk) : [...f.skills, sk] }))

  const handle = async (e) => {
    e.preventDefault()
    setError('');

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/.test(form.password)) {
      setError('Password must be 8-15 chars, with upper, lowercase, and special character.')
      return
    }

    setLoading(true)
    try { await register({ ...form, email: form.email.trim() }); navigate('/') }
    catch (err) { setError(err.response?.data?.error || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <LiquidBackground />

      <div style={s.buddyContainer}>
        {/* Left Hero */}
        <div style={s.buddyHero}>
          <div className="glow-ring pulse" style={{ width: 440, height: 440, top: '8%', left: '-5%' }}></div>
          <div className="buddy-bubble" style={{ top: '65%', left: '10%' }}>
            Ready to join our AI Platform?
          </div>
          <div className="buddy-bubble" style={{ top: '78%', left: '30%', background: '#1c4d6b', animationDelay: '0.2s' }}>
            <span style={{ color: 'var(--accent)' }}>Buddy!</span><br />
            Registration is free & forever
          </div>
          <img src="/robot_buddy.png" alt="Buddy" className="crawl" style={s.buddyImg} />
        </div>

        {/* Right Form */}
        <div style={s.buddyFormSide}>
          <div style={s.glassForm}>
            <div style={s.buddyLogoHeader}>
              <div style={s.avatarCircle}><img src="/robot_buddy.png" style={{ width: 32 }} /></div>
              <h2 style={s.buddyFormTitle}>Sign Up <span style={{ color: 'var(--accent)' }}>Buddy!</span></h2>
            </div>

            <div style={s.steps}>
              <div style={{ ...s.step, ...(step === 1 ? s.stepActive : {}) }}>Info</div>
              <div style={{ ...s.step, ...(step === 2 ? s.stepActive : {}) }}>Skills</div>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handle} style={s.form}>
              {step === 1 && (
                <>
                  <Field icon="👤" label="Full Name" required placeholder="Ayush Dubey" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <Field icon="✉️" label="Email Address" type="email" required placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <Field icon="🔒" label="Password" type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

                  <button type="button" style={s.buddySubmit} onClick={() => { if (!form.name || !form.email || !form.password) return setError('Please fill all fields'); setError(''); setStep(2) }}>
                    Next Step
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div style={s.skillBox}>
                    <p style={{ ...s.label, marginBottom: 8 }}>Select Your Skills</p>
                    <div style={s.skillGrid}>
                      {SKILLS.map(sk => (
                        <button key={sk} type="button"
                          style={{ ...s.skillBtn, ...(form.skills.includes(sk) ? s.skillActive : {}) }}
                          onClick={() => toggleSkill(sk)}>
                          {sk}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label style={s.checkboxLabel}>
                    <input type="checkbox" checked={form.data_consent} onChange={e => setForm({ ...form, data_consent: e.target.checked })} />
                    <span>I agree to Terms & Conditions and Privacy Policy</span>
                  </label>

                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button type="button" style={{ ...s.btnOutline, flex: 1 }} onClick={() => setStep(1)}>Back</button>
                    <button type="submit" style={{ ...s.buddySubmit, flex: 1 }} disabled={loading || !form.data_consent}>
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </form>

            <p style={s.buddySwitch}>
              Already a Buddy?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon, ...props }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={s.inputWrap}>
        <span style={s.inputIcon}>{icon}</span>
        <input style={s.buddyInput} {...props} />
      </div>
    </div>
  )
}

export default Login

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    color: 'var(--text)',
    position: 'relative',
    padding: 24,
    fontFamily: 'var(--font-body)',
    overflowX: 'hidden'
  },

  buddyContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: 1100,
    minHeight: 620,
    zIndex: 1,
    gap: 20
  },

  buddyHero: {
    flex: 1.3,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buddyImg: {
    width: '100%',
    maxWidth: 480,
    mixBlendMode: 'screen',
    filter: 'drop-shadow(0 20px 40px rgba(56,189,248,0.2))',
    zIndex: 2,
    position: 'relative'
  },

  buddyFormSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  glassForm: {
    width: '100%',
    maxWidth: 440,
    background: 'var(--glass)',
    backdropFilter: 'blur(30px)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '44px 36px',
    boxShadow: 'var(--shadow)',
    animation: 'fadeUp 0.6s ease'
  },

  buddyLogoHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32
  },

  avatarCircle: {
    width: 64,
    height: 64,
    background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)'
  },

  buddyFormTitle: {
    fontSize: 24,
    fontWeight: 800,
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },

  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 700, color: 'var(--muted)' },

  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.8, fontSize: 16 },

  buddyInput: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '14px 14px 14px 44px',
    color: 'white',
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': { borderColor: 'var(--accent)', background: 'rgba(255, 255, 255, 0.08)' }
  },

  buddySubmit: {
    padding: 16,
    borderRadius: 12,
    border: 'none',
    background: '#ffffff',
    color: '#000000',
    fontWeight: 800,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 10,
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
  },

  buddySwitch: { textAlign: 'center', marginTop: 32, fontSize: 14, color: 'var(--muted)' },

  footerLinks: {
    marginTop: 36,
    display: 'flex',
    justifyContent: 'center',
    gap: 28,
    fontSize: 12,
    color: 'var(--muted)',
    opacity: 0.6
  },

  steps: { display: 'flex', gap: 20, marginBottom: 24, justifyContent: 'center' },
  step: { fontSize: 14, color: 'var(--muted)', padding: '4px 12px', borderRadius: 20, border: '1px solid transparent' },
  stepActive: {
    color: 'var(--accent)',
    borderColor: 'var(--accent)',
    background: 'rgba(56, 189, 248, 0.1)'
  },

  skillBox: {},
  skillGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  skillBtn: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  skillActive: { background: 'var(--accent)', color: 'black', borderColor: 'var(--accent)' },

  error: {
    background: 'rgba(255,50,50,0.1)',
    border: '1px solid rgba(255,50,50,0.2)',
    color: '#ff4d4d',
    padding: 16,
    borderRadius: 14,
    fontSize: 15,
    marginBottom: 20,
    fontWeight: 500
  },
}

