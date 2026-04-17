export default function Terms() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.badge}>📋 Legal</div>
        <h1 style={s.h1}>Terms & Conditions</h1>
        <p style={s.sub}>Last updated: March 2026 • Effective immediately</p>
      </div>

      <div style={s.card}>
        <Section title="1. Acceptance of Terms">
          By accessing or using Career Hub ("Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. Career Hub is developed as an academic project by students of BBDNITM Lucknow under the guidance of Prof. Santosh Kumar Shukla.
        </Section>

        <Section title="2. Use of Platform">
          Career Hub provides aggregated listings of jobs, internships, hackathons, and webinars from third-party sources. You may use this platform for personal, non-commercial purposes only. You agree not to:
          <ul style={s.list}>
            <li>Use the platform for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the platform</li>
            <li>Scrape, copy, or redistribute content without permission</li>
            <li>Upload harmful, offensive, or misleading content</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Career Hub uses JWT-based authentication and AES-256 encryption to protect your data.
        </Section>

        <Section title="4. Third-Party Content">
          Career Hub aggregates job and event listings from third-party APIs including JSearch (RapidAPI), Ticketmaster, and Eventbrite. We do not guarantee the accuracy, completeness, or availability of these listings. Career Hub is not responsible for the content, policies, or practices of any third-party website or service linked from our platform.
        </Section>

        <Section title="5. AI-Powered Recommendations">
          Our platform uses machine learning algorithms (BERT-based semantic matching, TF-IDF cosine similarity) to provide personalized recommendations. These recommendations are algorithmic in nature and do not constitute professional career advice. Users should exercise their own judgment when applying for opportunities.
        </Section>

        <Section title="6. Intellectual Property">
          The Career Hub platform, including its design, code, and content created by our team, is protected by intellectual property laws. The BERT model and other open-source components are used under their respective licenses. Third-party trademarks and content belong to their respective owners.
        </Section>

        <Section title="7. Limitation of Liability">
          Career Hub is provided "as is" without any warranties. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to missed job opportunities, incorrect listings, or system downtime.
        </Section>

        <Section title="8. Data Security">
          We implement industry-standard security measures including AES-256 encryption, SSL/TLS transmission, JWT authentication, and rate limiting. However, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security of your data.
        </Section>

        <Section title="9. Termination">
          We reserve the right to terminate or suspend your account at any time for violation of these terms. You may also delete your account at any time through the Profile Settings page (GDPR: Right to Erasure). All your data will be permanently deleted upon account termination.
        </Section>

        <Section title="10. Changes to Terms">
          We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.
        </Section>

        <Section title="11. Governing Law">
          These terms are governed by the laws of India, including the Information Technology Act, 2000 and its amendments. Any disputes shall be subject to the exclusive jurisdiction of courts in Lucknow, Uttar Pradesh, India.
        </Section>

        <Section title="12. Contact">
          For questions about these Terms, contact us at:
          <div style={s.contact}>
            <div>📧 ayushdubey727272@gmail.com</div>
            <div>🏛️ BBDNITM, Lucknow, Uttar Pradesh, India</div>
            <div>📚 B.Tech Data Science — Final Year Project 2026</div>
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
  hero: { marginBottom: 28, padding: '28px 32px', background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(0,255,179,0.08)', border: '1px solid rgba(0,255,179,0.15)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#00ffb3', marginBottom: 12 },
  h1: { fontSize: 28, fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne,sans-serif', letterSpacing: '-0.5px', marginBottom: 8 },
  sub: { fontSize: 13, color: 'var(--muted)' },
  card: { background: 'var(--glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 0 },
  section: { padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  h2: { fontSize: 15, fontWeight: 700, color: '#00ffb3', fontFamily: 'Syne,sans-serif', marginBottom: 10 },
  text: { fontSize: 13, color: '#a0aec0', lineHeight: 1.8 },
  list: { paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 },
  contact: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 16px', background: 'rgba(0,255,179,0.05)', border: '1px solid rgba(0,255,179,0.1)', borderRadius: 10, fontSize: 12, color: 'var(--muted)' },
}
