import { useEffect, useState } from 'react'
import Card from '../components/Card'

const STATIC_WEBINARS = [
  {id:"w1",title:"LLMs in Production: Prototype to Scale",host:"Google DeepMind",date:"2026-04-15",time:"6:00 PM IST",mode:"Online",platform:"YouTube Live",tags:["LLM","MLOps","GenAI","Python"],url:"https://developers.google.com/events",type:"webinar",free:true,category:"AI/ML",description:"Deploy large language models in production with real-world best practices from Google engineers."},
  {id:"w2",title:"Crack Data Science Interviews at FAANG",host:"Scaler",date:"2026-04-18",time:"5:00 PM IST",mode:"Online",platform:"Zoom",tags:["Data Science","Interview","ML"],url:"https://scaler.com/events",type:"webinar",free:true,category:"Career",description:"DS interview strategies and how to stand out from thousands of applicants."},
  {id:"w3",title:"Full Stack: Next.js 14 + Flask Backend",host:"Coding Ninjas",date:"2026-04-20",time:"7:00 PM IST",mode:"Online",platform:"Discord",tags:["Next.js","React","Python","Flask"],url:"https://www.codingninjas.com/events",type:"webinar",free:true,category:"Web Dev",description:"End-to-end full stack project with Next.js frontend and Python Flask backend."},
  {id:"w4",title:"AWS Cloud Free Bootcamp",host:"AWS India",date:"2026-04-22",time:"4:00 PM IST",mode:"Online",platform:"AWS Events",tags:["AWS","Cloud","DevOps","EC2"],url:"https://aws.amazon.com/events/india",type:"webinar",free:true,category:"Cloud",description:"Free 3-hour bootcamp covering EC2, S3, RDS, Lambda with hands-on demos."},
  {id:"w5",title:"Open Source Contribution — First PR Guide",host:"GitHub India",date:"2026-04-24",time:"6:30 PM IST",mode:"Online",platform:"GitHub Live",tags:["Git","GitHub","Open Source"],url:"https://github.com/events",type:"webinar",free:true,category:"Community",description:"Step-by-step guide to making your first open source contribution."},
  {id:"w6",title:"System Design Masterclass — FAANG Level",host:"AlgoUniversity",date:"2026-04-25",time:"7:00 PM IST",mode:"Online",platform:"YouTube",tags:["System Design","Backend","Scalability"],url:"https://www.algouniversity.com/events",type:"webinar",free:true,category:"Career",description:"Design YouTube, WhatsApp, Uber at scale. Interview-focused concepts."},
  {id:"w7",title:"Resume Building for Tech Freshers 2026",host:"Internshala",date:"2026-04-26",time:"5:00 PM IST",mode:"Online",platform:"Zoom",tags:["Resume","Career","Fresher","ATS"],url:"https://internshala.com/trainings",type:"webinar",free:true,category:"Career",description:"HR professionals review resumes live. Learn ATS optimization techniques."},
  {id:"w8",title:"Python for Data Science — Zero to Hero",host:"Analytics Vidhya",date:"2026-04-27",time:"6:00 PM IST",mode:"Online",platform:"YouTube Live",tags:["Python","Data Science","Pandas","NumPy"],url:"https://www.analyticsvidhya.com/events",type:"webinar",free:true,category:"AI/ML",description:"Complete Python data science bootcamp from basics to advanced ML concepts."},
  {id:"w9",title:"Docker & Kubernetes for Beginners",host:"KodeKloud",date:"2026-04-28",time:"7:00 PM IST",mode:"Online",platform:"Zoom",tags:["Docker","Kubernetes","DevOps","Cloud"],url:"https://kodekloud.com/events",type:"webinar",free:true,category:"Cloud",description:"Hands-on containerization workshop with real deployment exercises."},
  {id:"w10",title:"React JS Complete Masterclass 2026",host:"Traversy Media",date:"2026-04-29",time:"8:00 PM IST",mode:"Online",platform:"YouTube Live",tags:["React","JavaScript","Frontend","Hooks"],url:"https://www.youtube.com/@TraversyMedia",type:"webinar",free:true,category:"Web Dev",description:"Complete React JS course covering hooks, context API, Redux Toolkit."},
  {id:"w11",title:"How to Get Your First Tech Job in 2026",host:"LinkedIn India",date:"2026-04-30",time:"5:00 PM IST",mode:"Online",platform:"LinkedIn Live",tags:["Career","Job Search","LinkedIn","Networking"],url:"https://www.linkedin.com/events",type:"webinar",free:true,category:"Career",description:"LinkedIn India recruiters share insider tips on landing your first tech job."},
  {id:"w12",title:"Machine Learning with Scikit-Learn",host:"Kaggle",date:"2026-05-01",time:"6:30 PM IST",mode:"Online",platform:"YouTube Live",tags:["ML","Scikit-learn","Python","Classification"],url:"https://www.kaggle.com/learn/events",type:"webinar",free:true,category:"AI/ML",description:"Hands-on ML workshop using real Kaggle competition datasets."},
  {id:"w13",title:"Flutter App Development Bootcamp",host:"Google Flutter",date:"2026-05-03",time:"4:00 PM IST",mode:"Online",platform:"YouTube Live",tags:["Flutter","Dart","Android","iOS"],url:"https://flutter.dev/events",type:"webinar",free:true,category:"Web Dev",description:"Build cross-platform mobile apps with Flutter from scratch to deployment."},
  {id:"w14",title:"Generative AI for Developers — Azure OpenAI",host:"Microsoft Azure",date:"2026-05-05",time:"6:00 PM IST",mode:"Online",platform:"Teams Live",tags:["GenAI","Azure","OpenAI","ChatGPT"],url:"https://developer.microsoft.com/en-us/events",type:"webinar",free:true,category:"AI/ML",description:"Build GenAI applications using Azure OpenAI Service with hands-on labs."},
  {id:"w15",title:"DSA for Placements — Top 100 Problems",host:"Striver (takeUforward)",date:"2026-05-06",time:"8:00 PM IST",mode:"Online",platform:"YouTube Live",tags:["DSA","LeetCode","Arrays","Trees","Graphs"],url:"https://www.youtube.com/@takeUforward",type:"webinar",free:true,category:"Career",description:"Solve the most frequently asked DSA problems in FAANG placement interviews."},
  {id:"w16",title:"MongoDB Atlas + Node.js — Full Stack",host:"MongoDB",date:"2026-05-07",time:"6:00 PM IST",mode:"Online",platform:"MongoDB Live",tags:["MongoDB","Node.js","Atlas","Express"],url:"https://www.mongodb.com/events",type:"webinar",free:true,category:"Web Dev",description:"Build a complete MERN stack application with MongoDB Atlas cloud."},
  {id:"w17",title:"Power BI & Data Visualization Masterclass",host:"Microsoft",date:"2026-05-08",time:"4:00 PM IST",mode:"Online",platform:"Teams Live",tags:["Power BI","Data Visualization","Analytics"],url:"https://powerbi.microsoft.com/en-us/events",type:"webinar",free:true,category:"AI/ML",description:"Create stunning dashboards and reports using Microsoft Power BI."},
  {id:"w18",title:"Ethical Hacking & Cybersecurity Basics",host:"EC-Council",date:"2026-05-09",time:"7:00 PM IST",mode:"Online",platform:"Zoom",tags:["Cybersecurity","Ethical Hacking","Network Security"],url:"https://www.eccouncil.org/events",type:"webinar",free:true,category:"Community",description:"Introduction to ethical hacking and cybersecurity fundamentals."},
  {id:"w19",title:"Product Management for Engineers",host:"Product School",date:"2026-05-10",time:"5:30 PM IST",mode:"Online",platform:"Zoom",tags:["Product Management","Career","Strategy"],url:"https://productschool.com/events",type:"webinar",free:true,category:"Career",description:"How engineers can transition to product management roles."},
  {id:"w20",title:"Startup Funding 101 — For Tech Founders",host:"YCombinator",date:"2026-05-12",time:"9:00 PM IST",mode:"Online",platform:"YouTube Live",tags:["Startup","Funding","Entrepreneurship","VC"],url:"https://www.ycombinator.com/events",type:"webinar",free:true,category:"Community",description:"Y Combinator partners explain how to raise seed funding."},
]

// Fetch live webinars from Eventbrite (token already in backend)
// Since CORS blocks direct Eventbrite calls from browser, we use backend
// Fallback: lu.ma (Luma) events RSS — free tech events
async function fetchLumaEvents() {
  try {
    const r = await fetch(
      'https://lu.ma/api/discover/get-events?series_mode=sessions&pagination_limit=20',
      {
        headers: { Accept: 'application/json', 'x-luma-request-origin': 'https://lu.ma' },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!r.ok) return []
    const d = await r.json()
    const events = d.entries || d.events || []
    return events
      .filter(e => {
        const title = (e.event?.name || '').toLowerCase()
        const tags = (e.event?.tags || []).join(' ').toLowerCase()
        return ['tech','ai','ml','dev','code','web','data','cloud','python','react','hack'].some(k => title.includes(k) || tags.includes(k))
      })
      .slice(0, 10)
      .map(e => {
        const ev = e.event || e
        return {
          id:       `luma_${ev.api_id || Math.random()}`,
          title:    ev.name || '',
          host:     ev.host_name || 'Tech Community',
          date:     (ev.start_at || '').slice(0, 10),
          time:     (ev.start_at || '').slice(11, 16) + ' UTC',
          mode:     'Online',
          platform: 'Luma',
          tags:     ev.tags || ['Tech', 'Webinar'],
          url:      `https://lu.ma/${ev.url}` || ev.url || '#',
          type:     'webinar',
          free:     !ev.ticket_info?.is_paid,
          category: 'Tech',
          description: ev.description || '',
          source:   'Luma (Live)',
        }
      })
  } catch { return [] }
}

const CATS = ['All','AI/ML','Web Dev','Cloud','Career','Community','Tech']

export default function Webinars() {
  const [all, setAll]     = useState(STATIC_WEBINARS)
  const [show, setShow]   = useState(STATIC_WEBINARS)
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState(0)
  const [cat, setCat]     = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchLumaEvents().then(live => {
      const combined = [...live, ...STATIC_WEBINARS]
      const seen = new Set()
      const deduped = combined.filter(w => {
        const k = w.title.toLowerCase().slice(0, 40)
        if (seen.has(k)) return false
        seen.add(k); return true
      })
      setAll(deduped)
      setShow(deduped)
      setLiveCount(live.length)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let r = all
    if (cat !== 'All') r = r.filter(w => w.category === cat)
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(w => w.title.toLowerCase().includes(q) || (w.tags||[]).some(t=>t.toLowerCase().includes(q)))
    }
    setShow(r)
  }, [cat, search, all])

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.h1}>🎙️ Webinars</h1>
        <p style={s.sub}>
          Free webinars — learn from industry experts
          {liveCount > 0 && <span style={s.liveBadge}>🟢 {liveCount} live from Luma</span>}
        </p>
      </div>
      <div style={s.searchRow}>
        <input style={s.input} placeholder="Search webinars, topics (AI, React, DSA)..."
          value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div style={s.chips}>
        {CATS.map(c=>(
          <button key={c} style={{...s.chip,...(cat===c?s.chipP:{})}} onClick={()=>setCat(c)}>{c}</button>
        ))}
      </div>
      {loading ? (
        <div style={s.loading}>
          <span style={{fontSize:24,color:'#b794f4'}}>↻</span>
          <span style={{marginLeft:12,color:'var(--muted)'}}>Live webinars fetch ho rahe hain...</span>
        </div>
      ) : (
        <>
          <div style={s.count}>{show.length} webinars found</div>
          <div style={s.grid}>
            {show.map(w => <Card key={w.id} item={w} type="webinar"/>)}
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
  liveBadge:{padding:'2px 10px',background:'rgba(183,148,244,0.1)',border:'1px solid rgba(183,148,244,0.3)',borderRadius:20,color:'#b794f4',fontWeight:700,fontSize:11},
  searchRow:{marginBottom:14},
  input:{background:'var(--glass)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 14px',color:'var(--text)',fontSize:13,outline:'none',width:'100%'},
  chips:{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16},
  chip:{padding:'6px 14px',borderRadius:20,border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'var(--muted)',fontSize:11,fontWeight:600,cursor:'pointer'},
  chipP:{borderColor:'#b794f4',color:'#b794f4',background:'rgba(183,148,244,0.08)'},
  count:{fontSize:12,color:'var(--muted)',marginBottom:14},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16},
  loading:{display:'flex',alignItems:'center',justifyContent:'center',padding:60},
}
