'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from './supabase'

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [ahpra, setAhpra] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { first_name: firstName, last_name: lastName, ahpra_number: ahpra, role } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (role === 'provisional') { router.push('/provisional') } else { router.push('/registered') }
  }

  const panels = {
    1: { sub: "Let's get you set up." },
    2: { sub: 'Just a few more details.' },
    3: { sub: 'Your AHPRA number keeps the platform trusted.' },
    4: { sub: 'Your role shapes what you see.' },
    5: { sub: 'Your data is yours.' },
  }

  const panel = panels[step]
  const progress = (step / 5) * 100

  const inputStyle = { width:'100%', fontFamily:'Inter,system-ui,sans-serif', fontSize:'1rem', color:'#1A1A1A', background:'#FFFFFF', border:'1px solid #E8E2D9', borderRadius:'8px', padding:'12px 16px', outline:'none', marginTop:'6px' }
  const labelStyle = { fontFamily:'Inter,system-ui,sans-serif', fontSize:'0.875rem', fontWeight:600, color:'#1A1A1A' }
  const nextBtn = { fontFamily:'Inter,system-ui,sans-serif', fontSize:'0.9375rem', fontWeight:700, color:'#FFFFFF', background:'#120DA6', border:'none', borderRadius:'8px', padding:'12px 28px', cursor:'pointer' }
  const backBtn = { fontFamily:'Inter,system-ui,sans-serif', fontSize:'0.9375rem', fontWeight:500, color:'#6B6568', background:'none', border:'none', cursor:'pointer' }
  const serif = { fontFamily:"'Playfair Display',Georgia,serif" }
  const h1Style = { ...serif, fontSize:'clamp(1.75rem,5vw,2.5rem)', fontWeight:700, color:'#1A1A1A', marginBottom:'32px', lineHeight:1.05, letterSpacing:'-0.02em' }

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#F2F0EB', display:'flex', flexDirection:'column', fontFamily:'Inter,system-ui,sans-serif'}}>

      <div style={{padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{...serif, fontSize:'1.25rem', fontWeight:700, color:'#1A1A1A'}}>ProvisLog</div>
        <span style={{fontSize:'0.8125rem', color:'#6B6568'}}>Step {step} of 5</span>
      </div>

      <div style={{height:'3px', backgroundColor:'#E8E2D9'}}>
        <div style={{height:'3px', backgroundColor:'#120DA6', width:`${progress}%`, transition:'width 0.4s ease'}}></div>
      </div>

      <div style={{padding:'24px 24px 0', maxWidth:'480px', margin:'0 auto', width:'100%'}}>
        <p style={{fontSize:'0.9375rem', color:'#6B6568', lineHeight:1.6}}>{panel.sub}</p>
      </div>

      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
        <div style={{width:'100%', maxWidth:'480px'}}>

          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); if(firstName && lastName) setStep(2) }}>
              <h1 style={h1Style}>What's your name?</h1>
              <div style={{marginBottom:'16px'}}>
                <label style={labelStyle}>First name</label>
                <input style={inputStyle} type="text" value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus required />
              </div>
              <div style={{marginBottom:'32px'}}>
                <label style={labelStyle}>Last name</label>
                <input style={inputStyle} type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
              <div style={{display:'flex', justifyContent:'flex-end'}}>
                <button style={nextBtn} type="submit">Next →</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={e => { e.preventDefault(); if(email) setStep(3) }}>
              <h1 style={h1Style}>Your email address?</h1>
              <div style={{marginBottom:'32px'}}>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <button style={backBtn} type="button" onClick={() => setStep(1)}>← Back</button>
                <button style={nextBtn} type="submit">Next →</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={e => { e.preventDefault(); if(ahpra) setStep(4) }}>
              <h1 style={{...h1Style, marginBottom:'8px'}}>Your AHPRA number?</h1>
              <p style={{fontSize:'0.9375rem', color:'#6B6568', marginBottom:'32px', lineHeight:1.6}}>This verifies your registration with the board.</p>
              <div style={{marginBottom:'32px'}}>
                <label style={labelStyle}>AHPRA number</label>
                <input style={inputStyle} type="text" placeholder="PSY0123456" value={ahpra} onChange={e => setAhpra(e.target.value)} autoFocus required />
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <button style={backBtn} type="button" onClick={() => setStep(2)}>← Back</button>
                <button style={nextBtn} type="submit">Next →</button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div>
              <h1 style={{...h1Style, marginBottom:'8px'}}>Which describes you?</h1>
              <p style={{fontSize:'0.9375rem', color:'#6B6568', marginBottom:'32px', lineHeight:1.6}}>This shapes your experience on the platform.</p>
              <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'32px'}}>
                {[
                  {value:'provisional', label:'Provisional Psychologist'},
                  {value:'registered', label:'Registered Psychologist'}
                ].map(r => (
                  <button key={r.value} type="button" onClick={() => { setRole(r.value); setStep(5) }}
                    style={{width:'100%', padding:'18px 20px', fontFamily:'Inter,system-ui,sans-serif', fontSize:'1rem', fontWeight:600, textAlign:'left', background: role === r.value ? '#C4E5F2' : '#FFFFFF', border: role === r.value ? '1px solid #120DA6' : '1px solid #E8E2D9', borderRadius:'10px', color: role === r.value ? '#120DA6' : '#1A1A1A', cursor:'pointer'}}>
                    {r.label}
                  </button>
                ))}
              </div>
              <button style={backBtn} type="button" onClick={() => setStep(3)}>← Back</button>
            </div>
          )}

          {step === 5 && (
            <form onSubmit={handleSubmit}>
              <h1 style={{...h1Style, marginBottom:'8px'}}>Create a password.</h1>
              <p style={{fontSize:'0.9375rem', color:'#6B6568', marginBottom:'32px', lineHeight:1.6}}>At least 8 characters.</p>
              {error && <div style={{background:'#F2F2F2', border:'1px solid #6B6568', borderRadius:'8px', padding:'12px 16px', marginBottom:'24px', fontSize:'0.875rem', color:'#6B6568'}}>{error}</div>}
              <div style={{marginBottom:'32px'}}>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoFocus required minLength={8} />
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <button style={backBtn} type="button" onClick={() => setStep(4)}>← Back</button>
                <button style={{...nextBtn, opacity: loading ? 0.7 : 1}} type="submit" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account →'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      <div style={{padding:'20px 24px', textAlign:'center'}}>
        <span style={{fontSize:'0.8125rem', color:'#6B6568'}}>Already have an account? <a href="#" style={{color:'#120DA6', fontWeight:600}}>Sign in</a></span>
      </div>

    </div>
  )
}