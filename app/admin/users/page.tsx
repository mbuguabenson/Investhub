'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  Search,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  Clock,
  ArrowUpRight
} from 'lucide-react'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setUsers(data)
    setLoading(false)
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1 text-left">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-indigo-500/40 underline-offset-8 text-left">User Management</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60 leading-relaxed text-left">
            Identity & Portfolio Overseer
          </p>
        </div>
        <div className="relative w-full md:w-96 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-indigo-500" />
           <input 
             type="text"
             placeholder="Search by Name, Alias or Phone..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-[#0a0c10] border border-[#1e2235] border-opacity-30 rounded-2xl pl-12 pr-4 h-12 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-indigo-500/20 text-white transition-all shadow-inner"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUsers.map((u) => (
          <Card key={u.id} className="bg-[#0a0c10] border-[#1e2235] border-opacity-20 p-8 rounded-[36px] overflow-hidden relative group transition-all hover:bg-white/[0.03] hover:border-indigo-500/10 shadow-2xl shadow-indigo-500/[0.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />
            <div className="flex justify-between items-start relative z-10 mb-8">
               <div className="w-14 h-14 rounded-[22px] bg-linear-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center font-black text-xl text-indigo-500 shadow-inner group-hover:scale-110 transition-transform">
                 {u.full_name?.[0]}
               </div>
               <div className="flex gap-2">
                 {u.is_admin && (
                   <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[8px] font-black uppercase text-indigo-500 tracking-widest shadow-inner">Root</span>
                 )}
                 <button className="p-2.5 bg-white/5 border border-[#1e2235] rounded-xl text-muted-foreground hover:text-white transition-all border-opacity-40 hover:bg-white/10">
                   <MoreVertical size={16} />
                 </button>
               </div>
            </div>
            <div className="space-y-6 relative z-10 text-left">
               <div>
                  <h3 className="text-lg font-black italic tracking-tighter text-white uppercase truncate">{u.full_name}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-1.5 lowercase opacity-60 flex items-center gap-2 font-mono">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    @{u.username}
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#1e2235]/30 border-opacity-50">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Portfolio Balance</p>
                     <p className="text-sm font-black text-white italic tracking-widest tabular-nums">KES {Number(u.account_balance || 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Yield Performance</p>
                     <p className="text-sm font-black text-emerald-500 italic tracking-widest tabular-nums">+KES {Number(u.total_returns || 0).toLocaleString()}</p>
                  </div>
               </div>
               <div className="flex items-center justify-between pt-4 group/stats">
                  <div className="flex items-center gap-2 opacity-60 group-hover/stats:opacity-100 transition-opacity">
                     <Clock size={12} className="text-indigo-400" />
                     <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Joined {new Date(u.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border border-[#1e2235] rounded-lg text-muted-foreground hover:text-white transition-all group/btn border-opacity-30 hover:bg-white/10">
                    <span className="text-[8px] font-black uppercase tracking-widest">Inspect</span>
                    <ExternalLink size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="py-40 text-center">
           <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-indigo-500/20" />
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] animate-pulse opacity-60">Decrypting identity clusters...</p>
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-40 bg-white/[0.02] border border-[#1e2235] border-opacity-20 rounded-[40px] border-dashed">
            <ShieldAlert size={60} className="text-indigo-500/10 mx-auto mb-8" />
            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase opacity-20">Identity Missing</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase mt-6 tracking-[0.3em] opacity-30">No account profiles matched your current search vectors.</p>
        </div>
      )}
    </div>
  )
}
