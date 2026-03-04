'use client'

import { Card } from '@/components/ui/card'
import { Shield, Bell, Database, Globe, Lock } from 'lucide-react'

export default function AdminSettings() {
  const sections = [
    { title: 'Security Protocol', desc: 'Manage administrative access and root keys', icon: Shield },
    { title: 'System Notifications', desc: 'Configure global alert vectors and webhooks', icon: Bell },
    { title: 'Ledger Aggregation', desc: 'Database maintenance and backup scheduling', icon: Database },
    { title: 'Global Localization', desc: 'Currency overrides and regional constraints', icon: Globe },
    { title: 'Privacy & Compliance', desc: 'KYC thresholds and identity verification rules', icon: Lock },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 text-left">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-blue-500/40 underline-offset-8">Core Configurations</h1>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60">System-wide parameters and security constraints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((s, i) => (
          <Card key={i} className="bg-[#0a0c10] border-[#1e2235] border-opacity-20 p-8 rounded-[32px] overflow-hidden relative group transition-all hover:bg-white/[0.03] hover:border-blue-500/10 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                 <s.icon size={28} />
               </div>
               <div>
                  <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">{s.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-2 opacity-60 uppercase">{s.desc}</p>
               </div>
            </div>
            <div className="mt-8 flex justify-end relative z-10">
               <button className="px-5 py-2.5 bg-white/5 border border-[#1e2235] border-opacity-40 rounded-xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all">Configure Module</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
