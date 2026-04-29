import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LiquidBackground from '../components/LiquidBackground'

const SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'Machine Learning',
  'Data Science', 'Flask', 'Django', 'AWS', 'Docker', 'TensorFlow', 'Deep Learning', 'NLP', 'Java', 'C++',
  'Pandas', 'NumPy', 'Scikit-learn', 'PyTorch', 'Git', 'TypeScript']

// ── Login ──────────────────────────────────────────────────────────────────────
export function Login() {
  const { sendOTP, verifyOTP } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(0) // 0: Email, 1: OTP
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await sendOTP(email.trim())
      setStep(1)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP.')
      return
    }

    setLoading(true)
    try {
      await verifyOTP(email.trim(), otp)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP.')
      setLoading(false)
    }
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
            {step === 0 ? "Login with OTP is faster!" : "Check your email for the code!"}
          </div>
          <div className="buddy-bubble" style={{ top: '75%', left: '28%', background: '#1c4d6b', animationDelay: '0.3s' }}>
            <span style={{ color: 'var(--accent)' }}>Buddy!</span><br />
            Security is our priority.
          </div>

          <img src="/robot_buddy.png" alt="Buddy" className="crawl" style={s.buddyImg} />
        </div>

        {/* Right Form: Glass Navy */}
        <div style={s.buddyFormSide}>
          <div style={s.glassForm}>
            <div style={s.buddyLogoHeader}>
              <div style={s.avatarCircle}><img src="/robot_buddy.png" style={{ width: 32 }} /></div>
              <h2 style={s.buddyFormTitle}>
                {step === 0 ? "Welcome Back " : "Verify OTP "} 
                <span style={{ color: 'var(--accent)' }}>Buddy!</span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', marginTop: -8 }}>
                {step === 0 ? "Login securely via Email OTP" : `OTP sent to ${email}`}
              </p>
            </div>

            {error && <div style={s.error}>{error}</div>}

            {step === 0 ? (
              <form onSubmit={handleSendOTP} style={s.form}>
                <Field icon="✉️" label="Email Address" type="email" required placeholder="name@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
                
                <button type="submit" style={{ ...s.buddySubmit, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} disabled={loading}>
                  {loading ? <span className="spin">↻</span> : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} style={s.form}>
                <div style={s.field}>
                  <label style={s.label}>Enter 6-Digit OTP</label>
                  <div style={s.otpContainer}>
                    <input 
                      style={s.otpInput} 
                      type="text" 
                      maxLength="6" 
                      placeholder="000000"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" style={{ ...s.buddySubmit, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} disabled={loading}>
                  {loading ? <span className="spin">↻</span> : 'Verify & Sign In'}
                </button>
                
                <button type="button" style={{ ...s.btnOutline, marginTop: 10 }} onClick={() => setStep(0)}>
                  Change Email
                </button>
              </form>
            )}

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
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', degree: 'BTech', graduation_yr: new Date().getFullYear() + 1, skills: [], data_consent: false, mock: true })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const toggleSkill = (sk) => setForm(f => ({ ...f, skills: f.skills.includes(sk) ? f.skills.filter(s => s !== sk) : [...f.skills, sk] }))

  const mockRegister = async (payload) => {
    // Simulate backend success response
    const fakeToken = btoa(`user:${payload.email}:${Date.now()}`).replace(/=/g, '')
    const fakeUser = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      college: payload.college || '',
      degree: payload.degree,
      skills: payload.skills || [],
      created_at: new Date().toISOString()
    }
    
    localStorage.setItem('access_token', fakeToken)
    localStorage.setItem('refresh_token', fakeToken)
    
    // Update AuthContext state (bypassing API)
    const event = new CustomEvent('mockAuthSuccess', { detail: { user: fakeUser } })
    window.dispatchEvent(event)
    
    return { access_token: fakeToken, refresh_token: fakeToken, user: fakeUser }
  }

  const handle = async (e) => {
    e.preventDefault()
    setError('');

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/.test(form.password)) {
      setError('Password must be 8-15 chars, with upper, lowercase, and special character.')
      return
    }

    setLoading(true)
    try {
      if (form.mock) {
        await mockRegister({ ...form, email: form.email.trim() })
      } else {
        await register({ ...form, email: form.email.trim() })
      }
      navigate('/')
    }
    catch (err) { 
      setError(err.response?.data?.error || 'Registration failed') 
    }
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
                  
                  <details style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                    <summary>Mock Mode (Dev Only)</summary>
                    <label style={{ display: 'block', marginTop: 8 }}>
                      <input 
                        type="checkbox" 
                        checked={form.mock}
                        onChange={e => setForm({ ...form, mock: e.target.checked })}
                      /> 
                      Mock Registration (no backend needed)
                    </label>
                  </details>

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

  btnOutline: {
    padding: 14,
    borderRadius: 12,
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text)',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  otpContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10
  },

  otpInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 12,
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 14,
    color: 'var(--accent)',
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': { borderColor: 'var(--accent)', background: 'rgba(255, 255, 255, 0.08)' }
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

