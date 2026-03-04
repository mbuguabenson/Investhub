'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Plus
} from 'lucide-react'
import { getAdminStats, getAdminRecentTransactions } from '@/lib/db'
import { cn } from '@/lib/utils'

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, t] = await Promise.all([
          getAdminStats(),
          getAdminRecentTransactions(6)
        ])
        setStats(s)
        setTransactions(t)
      } catch (e) {
        console.error("Dashboard error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { 
      label: 'System Users', 
      value: stats?.userCount || 0, 
      change: '+12%', 
      isUp: true, 
      icon: Users,
      color: 'bg-[#7c3aed]', // Deep Purple
      glow: 'shadow-purple-500/20'
    },
    { 
      label: 'Pooled Capital', 
      value: `KES ${stats?.totalBalance?.toLocaleString() || 0}`, 
      change: '+8.4%', 
      isUp: true, 
      icon: Wallet,
      color: 'bg-[#0ea5e9]', // Sky Blue
      glow: 'shadow-sky-500/20'
    },
    { 
      label: 'Active Liquidity', 
      value: `KES ${stats?.totalActiveInvestments?.toLocaleString() || 0}`, 
      change: '+22%', 
      isUp: true, 
      icon: TrendingUp,
      color: 'bg-[#06b6d4]', // Cyan
      glow: 'shadow-cyan-500/20'
    },
    { 
      label: 'Pending Payouts', 
      value: stats?.pendingWithdrawals || 0, 
      change: '-5%', 
      isUp: false, 
      icon: Clock,
      color: 'bg-[#f43f5e]', // Rose
      glow: 'shadow-rose-500/20'
    },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">System Overview</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Real-time Performance & Insights</p>
        </div>
        <div className="flex gap-3">
          <button className="h-11 px-5 rounded-xl bg-white/5 border border-[#1e2235] text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2 border-opacity-50">
            <Filter size={14} /> Filter Range
          </button>
          <button className="h-11 px-5 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2">
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Card key={i} className={cn(
            "relative overflow-hidden border-none p-6 flex flex-col justify-between h-44 transition-all hover:scale-[1.02] cursor-pointer group",
            card.color,
            card.glow
          )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10",
                card.isUp ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
              )}>
                {card.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {card.change}
              </div>
            </div>
            <div className="relative z-10 mt-4">
              <h2 className="text-2xl font-black italic tracking-tighter text-white">{card.value}</h2>
              <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">{card.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Performance Chart Placeholder */}
        <Card className="lg:col-span-8 bg-[#0a0c14] border-[#1e2235] border-opacity-50 p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black italic tracking-tighter text-white uppercase underline decoration-blue-500/30 underline-offset-8">Activity Curve</h3>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-3">Monthly Transaction Volume</p>
            </div>
            <div className="flex gap-2">
              {['Deposits', 'Returns', 'Withdrawals'].map((label, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-[#1e2235] border-opacity-50">
                  <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-blue-500" : i === 1 ? "bg-purple-500" : "bg-rose-500")} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-3 px-2 relative z-10 mt-10">
            {Array.from({ length: 15 }).map((_, i) => (
               <div key={i} className="flex-1 flex flex-col gap-1 h-full justify-end group/bar">
                  <div className="w-full bg-blue-500/10 rounded-t-lg transition-all duration-500 group-hover/bar:bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" style={{ height: `${20 + Math.random() * 50}%` }} />
                  <div className="w-full bg-purple-500/20 rounded-t-lg transition-all duration-700 group-hover/bar:bg-purple-500/40 shadow-[0_0_10px_rgba(147,51,234,0.1)]" style={{ height: `${10 + Math.random() * 30}%` }} />
               </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] px-2">
            <span>Jan 01</span>
            <span>Jan 08</span>
            <span>Jan 15</span>
            <span>Jan 22</span>
            <span>Jan 29</span>
          </div>
        </Card>

        {/* Right Stats Sidebar */}
        <Card className="lg:col-span-4 bg-[#0a0c10] border-[#1e2235] border-opacity-50 p-8 flex flex-col shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-10">System Health</h3>
          <div className="space-y-10 relative z-10 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active nodes</span>
                <span className="text-xl font-black text-white italic tracking-tighter">98.4%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-[#1e2235] shadow-inner">
                <div className="h-full bg-emerald-500 w-[98.4%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">KYC Pipeline</span>
                <span className="text-xl font-black text-white italic tracking-tighter">142/150</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-[#1e2235] shadow-inner">
                <div className="h-full bg-blue-500 w-[85%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payout Queue</span>
                <span className="text-xl font-black text-white italic tracking-tighter">04:22 <span className="text-[9px] opacity-40 italic">ETA</span></span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-[#1e2235] shadow-inner">
                <div className="h-full bg-purple-600 w-[40%] rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Table Area */}
      <div className="space-y-4 mt-12">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">System Activity Log</h3>
           <button className="text-blue-500 text-[9px] font-black uppercase tracking-widest transition-all hover:tracking-[0.2em]">View Detailed Logs</button>
        </div>
        <Card className="bg-[#0a0c10] border-[#1e2235] border-opacity-30 overflow-hidden shadow-2xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e2235] bg-white/[0.02]">
                  {['Reference', 'Account Holder', 'Category', 'Action Data', 'Authorized By', 'Status'].map((h, i) => (
                    <th key={i} className="px-8 py-5 text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2235]/40 text-left">
                {transactions.map((t, i) => (
                  <tr key={t.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-black text-white tabular-nums tracking-widest opacity-80 group-hover:opacity-100">#{t.id.slice(0, 8)}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-black text-[10px] text-blue-500">{t.user_profiles?.full_name?.[0]}</div>
                         <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-widest">{t.user_profiles?.full_name}</p>
                           <p className="text-[9px] text-muted-foreground font-bold tracking-widest mt-1 opacity-60 lowercase">@{t.user_profiles?.username}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                        t.type === 'deposit' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        t.type === 'withdrawal' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-black text-white italic tracking-tighter">KES {t.amount.toLocaleString()}</td>
                    <td className="px-8 py-5 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">Automated System</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <div className={cn("w-1.5 h-1.5 rounded-full", t.status === 'completed' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]")} />
                         <span className={cn("text-[9px] font-black uppercase tracking-widest", t.status === 'completed' ? "text-emerald-500" : "text-blue-500")}>{t.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && !loading && (
                  <tr>
                     <td colSpan={6} className="px-8 py-24 text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Zero transaction vectors detected in the log.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                     <td colSpan={6} className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Syncing with remote ledger...</p>
                        </div>
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
