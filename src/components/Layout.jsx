import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../api'
import LiquidBackground from './LiquidBackground'

const NAV = [
  { to: '/',            icon: '⊹', label: 'Dashboard', end: true },
  { to: '/jobs',        icon: '◈', label: 'Jobs' },
  { to: '/internships', icon: '◎', label: 'Internships' },
  { to: '/hackathons',  icon: '◆', label: 'Hackathons' },
  { to: '/webinars',    icon: '◉', label: 'Webinars' },
  { to: '/resume',      icon: '📄', label: 'Resume AI' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setResults(null) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const { data } = await api.get(`/api/recommendations/search?q=${encodeURIComponent(query)}`)
      setResults(data)
    } catch { setResults(null) }
    finally { setSearching(false) }
  }

  return (
    <>
      <LiquidBackground />
      <div style={s.root}>
        {/* Sidebar */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <span style={{ fontSize: 18 }}>⬡</span>
          </div>
          <div>
            <div style={s.logoText}>Career<span style={{ color: 'var(--green)' }}>Hub</span></div>
            <div style={s.logoSub}>AI-Powered Platform</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          <div style={s.navSection}>MENU</div>
          {NAV.map((n, i) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              style={({ isActive }) => ({
                ...s.navLink,
                ...(isActive ? s.navActive : {}),
                animationDelay: `${i * 0.05}s`,
              })}>
              {({ isActive }) => (
                <>
                  <span style={s.navIconWrap}>{n.icon}</span>
                  <span>{n.label}</span>
                  {isActive && <div style={s.navDot} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={s.sidebarBottom}>
          {/* AI Status */}
          <div style={s.aiStatus}>
            <div style={s.aiDot} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>BERT Engine</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Semantic matching active</div>
            </div>
          </div>

          {user ? (
            <div style={s.userCard}>
              <div style={s.userAvatar}>{user.name?.[0]?.toUpperCase()}</div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={s.userName}>{user.name}</div>
                <div style={s.userRole}>{user.degree || 'Student'}</div>
              </div>
              <button style={s.logoutBtn} onClick={logout} title="Logout">⎋</button>
            </div>
          ) : (
            <button style={s.loginBtn} onClick={() => navigate('/login')}>
              Sign In →
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={s.main}>
        {/* Topbar */}
        <header style={s.topbar}>
          <div ref={searchRef} style={s.searchWrap}>
            <form onSubmit={handleSearch} style={s.searchForm}>
              <span style={s.searchIcon}>⌕</span>
              <input
                style={s.searchInput}
                placeholder="Search jobs, hackathons, webinars, skills..."
                value={query}
                onChange={e => { setQuery(e.target.value); if (!e.target.value) setResults(null) }}
              />
              {searching
                ? <span className="spin" style={{ color: 'var(--green)', fontSize: 16 }}>↻</span>
                : query && <button type="submit" style={s.searchSubmit}>↵</button>
              }
            </form>

            {results && (
              <div style={s.searchDropdown}>
                <div style={s.dropHeader}>
                  <span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700 }}>
                    {results.total} results
                  </span>
                </div>
                {results.total === 0
                  ? <div style={s.noResults}>No results found for "{query}"</div>
                  : <>
                    {results.jobs?.slice(0, 3).map(j => (
                      <DropItem key={j.id} icon="◈" color="var(--green)" title={j.title} sub={j.company}
                        onClick={() => { navigate('/jobs'); setResults(null); setQuery('') }} />
                    ))}
                    {results.hackathons?.map(h => (
                      <DropItem key={h.id} icon="◆" color="var(--yellow)" title={h.title} sub={h.organizer}
                        onClick={() => { navigate('/hackathons'); setResults(null); setQuery('') }} />
                    ))}
                    {results.webinars?.map(w => (
                      <DropItem key={w.id} icon="◉" color="var(--purple)" title={w.title} sub={w.host}
                        onClick={() => { navigate('/webinars'); setResults(null); setQuery('') }} />
                    ))}
                  </>
                }
              </div>
            )}
          </div>

          <div style={s.topbarRight}>
            <button onClick={toggleTheme} style={s.themeBtn} title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {!user ? (
              <>
                <button style={s.topBtn} onClick={() => navigate('/login')}>Login</button>
                <button className="btn-neon" onClick={() => navigate('/register')}>Get Started</button>
              </>
            ) : (
              <NavLink to="/profile" style={s.profileBtn}>
                <div style={s.profileAvatar}>{user.name?.[0]?.toUpperCase()}</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
              </NavLink>
            )}
          </div>
        </header>

        <main style={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
    </>
  )
}

function DropItem({ icon, color, title, sub, onClick }) {
  return (
    <div style={s.dropItem} onClick={onClick}>
      <span style={{ color, fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
      </div>
    </div>
  )
}

const s = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 },

  sidebar: {
    width: 230,
    background: 'var(--glass)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 14px',
    flexShrink: 0,
    backdropFilter: 'blur(20px)',
  },

  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 },
  logoIcon: { width: 36, height: 36, borderRadius: 10, background: 'var(--glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoText: { fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.3px' },
  logoSub: { fontSize: 9, color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: 1 },

  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navSection: { fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '1.5px', padding: '8px 12px 4px', textTransform: 'uppercase' },

  navLink: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 10,
    color: 'var(--muted)', fontWeight: 500, fontSize: 13,
    transition: 'all 0.2s', position: 'relative',
    fontFamily: 'var(--font-body)',
  },
  navActive: {
    background: 'rgba(0,255,179,0.08)',
    color: 'var(--green)',
    fontWeight: 600,
    borderLeft: '2px solid var(--green)',
    paddingLeft: 10,
  },
  navIconWrap: { fontSize: 15, width: 20, textAlign: 'center' },
  navDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', marginLeft: 'auto', boxShadow: '0 0 8px var(--green)' },

  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 8 },

  aiStatus: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(0,255,179,0.05)', border: '1px solid rgba(0,255,179,0.1)', borderRadius: 10 },
  aiDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)', animation: 'pulse 2s ease infinite', flexShrink: 0 },

  userCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 10 },
  userAvatar: { width: 30, height: 30, borderRadius: '50%', background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: 'var(--bg)', flexShrink: 0 },
  userName: { fontSize: 12, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: 10, color: 'var(--muted)', marginTop: 1 },
  logoutBtn: { background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 2, flexShrink: 0 },

  loginBtn: { padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--green), var(--green2))', color: '#000000', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-display)', letterSpacing: '0.3px' },

  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 },

  topbar: { background: 'var(--glass)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 },

  searchWrap: { flex: 1, maxWidth: 560, position: 'relative' },
  searchForm: { display: 'flex', alignItems: 'center', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 16px', gap: 10, transition: 'border-color 0.2s' },
  searchIcon: { color: 'var(--muted)', fontSize: 20 },
  searchInput: { background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, padding: '11px 0', flex: 1, '::placeholder': { color: 'var(--muted)' } },
  searchSubmit: { background: 'transparent', border: 'none', color: 'var(--green)', fontSize: 18, cursor: 'pointer', fontWeight: 700 },

  searchDropdown: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg2)', backdropFilter: 'blur(20px)', border: '1px solid var(--border2)', borderRadius: 14, boxShadow: 'var(--shadow)', zIndex: 100, overflow: 'hidden' },
  dropHeader: { padding: '10px 16px 6px', borderBottom: '1px solid var(--border)' },
  dropItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', cursor: 'pointer', transition: 'background 0.15s' },
  noResults: { padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 },

  topbarRight: { display: 'flex', alignItems: 'center', gap: 10 },
  themeBtn: { background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'var(--text)', transition: 'all 0.2s' },
  topBtn: { padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  profileBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--glass)', cursor: 'pointer', color: 'var(--text)' },
  profileAvatar: { width: 26, height: 26, borderRadius: '50%', background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: 'var(--bg)' },

  content: { flex: 1, overflowY: 'auto', padding: '28px 28px' },
}
