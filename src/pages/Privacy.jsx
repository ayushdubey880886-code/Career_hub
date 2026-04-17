export default function Privacy() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.badge}>🔐 Privacy</div>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.sub}>Last updated: March 2026 • GDPR & Indian IT Act Compliant</p>
      </div>

      <div style={s.infoRow}>
        {[
          { icon: '🔒', title: 'AES-256 Encrypted', desc: 'All data encrypted at rest' },
          { icon: '🛡️', title: 'GDPR Compliant', desc: 'Your rights protected' },
          { icon: '🚫', title: 'Never Sold', desc: 'Data never shared with advertisers' },
          { icon: '🗑️', title: 'Right to Erasure', desc: 'Delete your data anytime' },
        ].map(item => (
          <div key={item.title} style={s.infoCard}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <Section title="1. Introduction">
          Career Hub ("we", "our", "platform") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information in compliance with the Indian Information Technology Act, 2000 and GDPR principles for international users.
        </Section>

        <Section title="2. Information We Collect">
          <strong style={{ color: 'var(--text)' }}>Account Information:</strong> Name, email address, password (bcrypt hashed), college, degree, graduation year.
          <br/><br/>
          <strong style={{ color: 'var(--text)' }}>Profile Data:</strong> Skills, resume text (for AI matching), interaction history (clicks, saves, applications).
          <br/><br/>
          <strong style={{ color: 'var(--text)' }}>Usage Data:</strong> Pages visited, search queries, time spent on listings, device information.
          <br/><br/>
          <strong style={{ color: 'var(--text)' }}>We DO NOT collect:</strong> Payment information, government IDs, biometric data, or sensitive personal information.
        </Section>

        <Section title="3. How We Use Your Data">
          <ul style={s.list}>
            <li><strong style={{ color: 'var(--text)' }}>Personalization:</strong> BERT semantic matching to rank opportunities relevant to your profile</li>
            <li><strong style={{ color: 'var(--text)' }}>Authentication:</strong> Secure login and session management via JWT tokens</li>
            <li><strong style={{ color: 'var(--text)' }}>Recommendations:</strong> Hybrid CBF+CF algorithm using your skills and interaction history</li>
            <li><strong style={{ color: 'var(--text)' }}>Improvement:</strong> Analyzing usage patterns to improve platform features</li>
            <li><strong style={{ color: 'var(--text)' }}>Communication:</strong> Sending important account and platform updates</li>
          </ul>
        </Section>

        <Section title="4. Data Storage & Security">
          <ul style={s.list}>
            <li><strong style={{ color: 'var(--text)' }}>PostgreSQL:</strong> Structured data (user profiles, interactions) stored with AES-256 encryption</li>
            <li><strong style={{ color: 'var(--text)' }}>MongoDB:</strong> Unstructured data (job descriptions, event details) for AI processing</li>
            <li><strong style={{ color: 'var(--text)' }}>Transmission:</strong> All data transmitted via SSL/TLS encryption</li>
            <li><strong style={{ color: 'var(--text)' }}>Passwords:</strong> Hashed using bcrypt (never stored in plain text)</li>
            <li><strong style={{ color: 'var(--text)' }}>Access Control:</strong> Role-based access, JWT token validation, rate limiting</li>
          </ul>
        </Section>

        <Section title="5. Data Sharing">
          We do not sell, rent, or share your personal data with third parties for commercial purposes. We only share data with:
          <ul style={s.list}>
            <li><strong style={{ color: 'var(--text)' }}>API Providers:</strong> JSearch, Ticketmaster, Eventbrite — only for fetching opportunity data (no personal data shared)</li>
            <li><strong style={{ color: 'var(--text)' }}>Legal Requirements:</strong> When required by Indian law or court order</li>
            <li><strong style={{ color: 'var(--text)' }}>Academic Research:</strong> Anonymized, aggregated data only for research purposes</li>
          </ul>
        </Section>

        <Section title="6. Your Rights (GDPR & Indian IT Act)">
          <ul style={s.list}>
            <li>✅ <strong style={{ color: 'var(--text)' }}>Right to Access:</strong> Request a copy of your personal data</li>
            <li>✅ <strong style={{ color: 'var(--text)' }}>Right to Rectification:</strong> Update incorrect data via Profile Settings</li>
            <li>✅ <strong style={{ color: 'var(--text)' }}>Right to Erasure:</strong> Delete your account and all data permanently</li>
            <li>✅ <strong style={{ color: 'var(--text)' }}>Right to Portability:</strong> Export your data in JSON format</li>
            <li>✅ <strong style={{ color: 'var(--text)' }}>Right to Object:</strong> Opt out of AI-based processing</li>
            <li>✅ <strong style={{ color: 'var(--text)' }}>Right to Withdraw Consent:</strong> Revoke data consent at any time</li>
          </ul>
        </Section>

        <Section title="7. Cookies & Tracking">
          Career Hub uses minimal cookies for:
          <ul style={s.list}>
            <li>Authentication session management (JWT tokens in localStorage)</li>
            <li>User preferences (theme, filters)</li>
          </ul>
          We do not use advertising cookies, cross-site tracking, or third-party analytics beyond basic usage statistics.
        </Section>

        <Section title="8. Data Retention">
          We retain your data for as long as your account is active. Upon account deletion:
          <ul style={s.list}>
            <li>Personal data is permanently deleted within 24 hours</li>
            <li>Anonymized usage statistics may be retained for research</li>
            <li>Backup data is purged within 30 days</li>
          </ul>
        </Section>

        <Section title="9. Children's Privacy">
          Career Hub is intended for users who are 18 years of age or older (college students and professionals). We do not knowingly collect data from minors under 18. If you are under 18, please do not create an account.
        </Section>

        <Section title="10. Changes to Privacy Policy">
          We may update this Privacy Policy periodically. We will notify users of material changes via email. Your continued use of the platform after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="11. Contact & Data Requests">
          For privacy-related requests or concerns:
          <div style={s.contact}>
            <div>📧 ayushdubey727272@gmail.com</div>
            <div>🏛️ BBDNITM, Lucknow, Uttar Pradesh — 226028, India</div>
            <div>⏱️ Response time: Within 72 hours</div>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={s.section}>
      <h2 style={s.h2}>{title}</h2>
      <div style={s.text}>{children}</div>
    </div>
  )
}

const s = {
  page: { maxWidth: 800 },
  hero: { marginBottom: 20, padding: '28px 32px', background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(183,148,244,0.08)', border: '1px solid rgba(183,148,244,0.15)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#b794f4', marginBottom: 12 },
  h1: { fontSize: 28, fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne,sans-serif', letterSpacing: '-0.5px', marginBottom: 8 },
  sub: { fontSize: 13, color: 'var(--muted)' },
  infoRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 },
  infoCard: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' },
  card: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 0 },
  section: { padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  h2: { fontSize: 15, fontWeight: 700, color: '#b794f4', fontFamily: 'Syne,sans-serif', marginBottom: 10 },
  text: { fontSize: 13, color: '#a0aec0', lineHeight: 1.8 },
  list: { paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 },
  contact: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 16px', background: 'rgba(183,148,244,0.05)', border: '1px solid rgba(183,148,244,0.1)', borderRadius: 10, fontSize: 12, color: 'var(--muted)' },
}
