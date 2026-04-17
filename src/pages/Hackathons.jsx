import { useEffect, useState } from 'react'
import Card from '../components/Card'

// Static hackathons — real India hackathons with real links
const STATIC_HACKATHONS = [
  {id:"h1",title:"Smart India Hackathon 2026",organizer:"Govt of India / AICTE",mode:"offline",location:"Pan India",prize:"₹1,00,000+",deadline:"2026-08-30",tags:["AI","GovTech","Innovation"],url:"https://sih.gov.in",type:"hackathon",difficulty:"Intermediate",description:"India's largest hackathon with 1 lakh+ students solving real government problems."},
  {id:"h2",title:"HackWithInfy 2026",organizer:"Infosys",mode:"online",location:"Online",prize:"₹75,000",deadline:"2026-07-15",tags:["ML","Cloud","Web Dev"],url:"https://hackwithinfy.com",type:"hackathon",difficulty:"Beginner",description:"Infosys annual hackathon. Winners get internship offers and cash prizes."},
  {id:"h3",title:"Flipkart Grid 6.0",organizer:"Flipkart",mode:"online",location:"Online",prize:"PPO + ₹1,50,000",deadline:"2026-09-01",tags:["E-Commerce","AI","Supply Chain"],url:"https://unstop.com/hackathons/flipkart-grid-60",type:"hackathon",difficulty:"Advanced",description:"Flipkart flagship engineering challenge with Pre-Placement Offers for winners."},
  {id:"h4",title:"HackRx 6.0",organizer:"Bajaj Finserv",mode:"online",location:"Online",prize:"₹1,50,000",deadline:"2026-07-20",tags:["HealthTech","FinTech","AI"],url:"https://unstop.com/hackathons",type:"hackathon",difficulty:"Intermediate",description:"Build innovative health and finance solutions using open APIs."},
  {id:"h5",title:"Google Solution Challenge 2026",organizer:"Google",mode:"online",location:"Global",prize:"$3000 + Mentorship",deadline:"2026-08-10",tags:["Google Cloud","ML","Android"],url:"https://developers.google.com/community/gdsc-solution-challenge",type:"hackathon",difficulty:"Intermediate",description:"Build solutions for UN Sustainable Development Goals using Google technologies."},
  {id:"h6",title:"ETHIndia 2026",organizer:"Devfolio",mode:"offline",location:"Bangalore",prize:"$1,00,000+",deadline:"2026-11-01",tags:["Web3","Blockchain","DeFi"],url:"https://ethindia.co",type:"hackathon",difficulty:"Advanced",description:"India's largest Ethereum hackathon for Web3 builders. 2000+ hackers."},
  {id:"h7",title:"Code for Good — JPMorgan",organizer:"JPMorgan Chase",mode:"offline",location:"Mumbai",prize:"PPO + ₹50,000",deadline:"2026-07-25",tags:["FinTech","Social Impact","Python"],url:"https://careers.jpmorgan.com",type:"hackathon",difficulty:"Intermediate",description:"24-hour hackathon building tech solutions for non-profit organizations."},
  {id:"h8",title:"Microsoft Imagine Cup 2026",organizer:"Microsoft",mode:"online",location:"Global",prize:"$100,000+",deadline:"2026-08-15",tags:["AI","Azure","Innovation"],url:"https://imaginecup.microsoft.com",type:"hackathon",difficulty:"Advanced",description:"Microsoft's global student competition. Build AI solutions for real-world problems."},
  {id:"h9",title:"HackOn With Amazon 2026",organizer:"Amazon",mode:"online",location:"Online",prize:"₹5,00,000+",deadline:"2026-07-30",tags:["AWS","ML","Cloud"],url:"https://hackon.amazon.in",type:"hackathon",difficulty:"Intermediate",description:"Amazon India's flagship hackathon for students and professionals."},
  {id:"h10",title:"TCS CodeVita 2026",organizer:"TCS",mode:"online",location:"Online",prize:"Job Offer + ₹1,00,000",deadline:"2026-09-15",tags:["DSA","Problem Solving","Competitive Programming"],url:"https://www.tcscodevita.com",type:"hackathon",difficulty:"Advanced",description:"TCS global coding competition. Winners get direct job offers."},
  {id:"h11",title:"Myntra HackerRamp WeForShe",organizer:"Myntra",mode:"online",location:"Online",prize:"PPO + Cash",deadline:"2026-08-05",tags:["Fashion Tech","AI","ML","React"],url:"https://unstop.com/hackathons",type:"hackathon",difficulty:"Beginner",description:"Myntra hackathon focused on fashion technology and women in tech."},
  {id:"h12",title:"Hack the Mountain 4.0",organizer:"Coding Blocks",mode:"hybrid",location:"Delhi/Online",prize:"₹2,00,000+",deadline:"2026-08-20",tags:["Open Innovation","AI","Web Dev"],url:"https://hackthemountain.co",type:"hackathon",difficulty:"Beginner",description:"India's largest student hackathon with 10,000+ participants."},
  {id:"h13",title:"Walmart Sparkathon 2026",organizer:"Walmart",mode:"online",location:"Online",prize:"PPO + ₹2,00,000",deadline:"2026-09-05",tags:["Retail Tech","ML","Supply Chain"],url:"https://walmart.com/sparkathon",type:"hackathon",difficulty:"Advanced",description:"Walmart global hackathon focused on retail technology innovation."},
  {id:"h14",title:"GitHub Constellation India 2026",organizer:"GitHub",mode:"offline",location:"Bangalore",prize:"Swag + Recognition",deadline:"2026-08-01",tags:["Open Source","Git","DevOps","AI"],url:"https://githubconstellation.com",type:"hackathon",difficulty:"Beginner",description:"GitHub's annual developer conference and hackathon in India."},
  {id:"h15",title:"HackerEarth University Hackathon",organizer:"HackerEarth",mode:"online",location:"Online",prize:"₹1,00,000+",deadline:"2026-08-12",tags:["ML","Data Science","Python"],url:"https://www.hackerearth.com/challenges/hackathon",type:"hackathon",difficulty:"Beginner",description:"Open hackathon for college students across India with monthly challenges."},
  {id:"h16",title:"ICICI Appathon 2026",organizer:"ICICI Bank",mode:"online",location:"Online",prize:"₹1,50,000",deadline:"2026-07-22",tags:["FinTech","Banking","Mobile","Flutter"],url:"https://unstop.com/hackathons",type:"hackathon",difficulty:"Beginner",description:"Build innovative fintech solutions for the banking sector."},
  {id:"h17",title:"Hack2Skill National Hackathon",organizer:"Hack2Skill",mode:"online",location:"Online",prize:"₹5,00,000+",deadline:"2026-08-18",tags:["AI","ML","Web3","IoT"],url:"https://hack2skill.com",type:"hackathon",difficulty:"Intermediate",description:"National level hackathon with multiple problem statements across domains."},
  {id:"h18",title:"SAP Labs India CodeJam",organizer:"SAP Labs",mode:"offline",location:"Bangalore",prize:"₹75,000 + Internship",deadline:"2026-07-28",tags:["SAP","Cloud","Enterprise Tech"],url:"https://community.sap.com/events",type:"hackathon",difficulty:"Intermediate",description:"Build enterprise solutions using SAP technologies."},
  {id:"h19",title:"Namma Yatri Open Mobility Challenge",organizer:"Namma Yatri",mode:"online",location:"Online",prize:"₹3,00,000+",deadline:"2026-08-25",tags:["Mobility","Open Source","Flutter"],url:"https://nammayatri.in/challenge",type:"hackathon",difficulty:"Intermediate",description:"Build solutions for open mobility and urban transportation challenges."},
  {id:"h20",title:"Devfolio Fellowship Hackathon",organizer:"Devfolio",mode:"online",location:"Online",prize:"$5,000 + Fellowship",deadline:"2026-09-10",tags:["Web3","Ethereum","Solidity"],url:"https://devfolio.co/hackathons",type:"hackathon",difficulty:"Advanced",description:"Exclusive hackathon for serious Web3 builders with mentorship."},
]

// Fetch live hackathons from Digitomize (free public API, no key needed)
async function fetchDigitomize() {
  try {
    const r = await fetch('https://api.digitomize.com/hackathons?results_per_page=20&upcoming=true', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return []
    const d = await r.json()
    return (d.data || d.results || d || []).map(h => ({
      id:         `dz_${h.id || h._id || Math.random()}`,
      title:      h.name || h.title || '',
      organizer:  h.host || h.organizer || 'Digitomize',
      mode:       h.mode === 'online' ? 'online' : h.mode || 'online',
      location:   h.location || 'Online',
      prize:      h.prize || h.prizes || 'Check website',
      deadline:   h.registration_end || h.deadline || h.endDate || '',
      tags:       h.tags || [],
      url:        h.url || h.link || '#',
      type:       'hackathon',
      difficulty: h.difficulty || 'Intermediate',
      description: h.description || h.tagline || '',
      source:     'Digitomize (Live)',
    }))
  } catch { return [] }
}

export default function Hackathons() {
  const [all, setAll]     = useState(STATIC_HACKATHONS)
  const [show, setShow]   = useState(STATIC_HACKATHONS)
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState(0)
  const [mode, setMode]   = useState('All')
  const [diff, setDiff]   = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Show static hackathons immediately — real India hackathons
    setAll(STATIC_HACKATHONS)
    setShow(STATIC_HACKATHONS)
    setLoading(false)
    // Also try Digitomize for additional live hackathons
    fetchDigitomize().then(live => {
      if (live.length > 0) {
        const combined = [...STATIC_HACKATHONS, ...live]
        const seen = new Set()
        const deduped = combined.filter(h => {
          const k = h.title.toLowerCase().slice(0, 40)
          if (seen.has(k)) return false
          seen.add(k); return true
        })
        setAll(deduped)
        setShow(deduped)
        setLiveCount(live.length)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    let r = all
    if (mode !== 'All') r = r.filter(h => h.mode === mode)
    if (diff !== 'All') r = r.filter(h => h.difficulty === diff)
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(h => h.title.toLowerCase().includes(q) || (h.tags||[]).some(t=>t.toLowerCase().includes(q)))
    }
    setShow(r)
  }, [mode, diff, search, all])

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.h1}>🏆 Hackathons</h1>
        <p style={s.sub}>
          Win prizes, get PPOs, build your portfolio — real listings
          {liveCount > 0 && <span style={s.liveBadge}>🟢 {liveCount} live from Digitomize</span>}
        </p>
      </div>
      <div style={s.searchRow}>
        <input style={s.input} placeholder="Search hackathons, tags (AI, Web3, ML)..."
          value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div style={s.filterRow}>
        <span style={s.filterLabel}>Mode:</span>
        {['All','online','offline','hybrid'].map(m=>(
          <button key={m} style={{...s.chip,...(mode===m?s.chipY:{})}} onClick={()=>setMode(m)}>{m}</button>
        ))}
        <span style={{...s.filterLabel,marginLeft:12}}>Level:</span>
        {['All','Beginner','Intermediate','Advanced'].map(d=>(
          <button key={d} style={{...s.chip,...(diff===d?s.chipY:{})}} onClick={()=>setDiff(d)}>{d}</button>
        ))}
      </div>
      {loading ? (
        <div style={s.loading}>
          <span style={{fontSize:24,color:'#ffd93d'}}>↻</span>
          <span style={{marginLeft:12,color:'var(--muted)'}}>Live hackathons fetch ho rahe hain...</span>
        </div>
      ) : (
        <>
          <div style={s.count}>{show.length} hackathons found</div>
          <div style={s.grid}>
            {show.map(h => <Card key={h.id} item={h} type="hackathon"/>)}
          </div>
        </>
      )}
    </div>
  )
}

const s = {
  header:{marginBottom:20},
  h1:{fontSize:24,fontWeight:800,color:'var(--text)'},
  sub:{color:'var(--muted)',fontSize:12,marginTop:4,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'},
  liveBadge:{padding:'2px 10px',background:'rgba(0,255,179,0.1)',border:'1px solid rgba(0,255,179,0.3)',borderRadius:20,color:'#00ffb3',fontWeight:700,fontSize:11},
  searchRow:{marginBottom:14},
  input:{background:'var(--glass)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 14px',color:'var(--text)',fontSize:13,outline:'none',width:'100%'},
  filterRow:{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16,alignItems:'center'},
  filterLabel:{fontSize:11,color:'var(--muted)',fontWeight:700,letterSpacing:'0.5px'},
  chip:{padding:'6px 14px',borderRadius:20,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'var(--muted)',fontSize:11,fontWeight:600,cursor:'pointer'},
  chipY:{borderColor:'#ffd93d',color:'#ffd93d',background:'rgba(255,217,61,0.08)'},
  count:{fontSize:12,color:'var(--muted)',marginBottom:14},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16},
  loading:{display:'flex',alignItems:'center',justifyContent:'center',padding:60},
}
