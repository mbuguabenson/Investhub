'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, 
  XCircle, 
  Search,
  Calendar,
  ShieldAlert,
  Info,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react'
import { 
  getAllWithdrawalRequests, 
  updateWithdrawalStatus,
  getAdminPendingDeposits,
  approveDeposit
} from '@/lib/db'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminPayments() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [w, d] = await Promise.all([
      getAllWithdrawalRequests(),
      getAdminPendingDeposits()
    ])
    setWithdrawals(w)
    setDeposits(d)
    setLoading(false)
  }

  const handleWithdrawalStatus = async (id: string, status: 'completed' | 'rejected') => {
    const success = await updateWithdrawalStatus(id, status)
    if (success) {
      toast.success(`Withdrawal ${status} successfully`)
      fetchData()
    } else {
      toast.error('Failed to update status')
    }
  }

  const handleDepositApproval = async (id: string) => {
    const success = await approveDeposit(id)
    if (success) {
      toast.success('Deposit authorized and balance updated')
      fetchData()
    } else {
      toast.error('Authorization failed')
    }
  }

  const filteredWithdrawals = withdrawals.filter(r => 
    r.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user_profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDeposits = deposits.filter(r => 
    r.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user_profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-blue-500/40 underline-offset-8">Payment Control</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60 leading-relaxed text-left">
            Authorization gateway for system-wide capital flows
          </p>
        </div>
        <div className="relative w-full md:w-96 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
           <input 
             type="text"
             placeholder="Filter by ID or Name..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-[#0a0c10] border border-[#1e2235] border-opacity-30 rounded-2xl pl-12 pr-4 h-12 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-blue-500/20 text-white transition-all shadow-inner"
           />
        </div>
      </div>

      <Tabs defaultValue="withdrawals" className="w-full">
        <TabsList className="bg-[#0a0c10] border border-[#1e2235] border-opacity-30 p-1 h-14 rounded-2xl mb-10 w-full justify-start max-w-md">
          <TabsTrigger value="withdrawals" className="flex-1 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest gap-2">
            <ArrowUpCircle size={14} /> Withdrawals ({withdrawals.filter(w => w.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="deposits" className="flex-1 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest gap-2">
            <ArrowDownCircle size={14} /> Deposits ({deposits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals" className="space-y-6">
           {filteredWithdrawals.map((req) => (
             <Card key={req.id} className={cn(
               "bg-[#0a0c10] border-[#1e2235] border-opacity-20 p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:bg-white/3 hover:border-blue-500/10 relative group overflow-hidden rounded-[32px] shadow-xl",
               req.status === 'pending' ? "border-l-[6px] border-l-blue-600 shadow-blue-500/2" : ""
             )}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform pointer-events-none" />
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center relative z-10">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Vector ID</p>
                      <p className="text-[12px] font-black text-white tabular-nums tracking-widest font-mono">#{req.id.slice(0, 8)}</p>
                   </div>
                   <div className="flex items-center gap-4 lg:col-span-1.5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-[20px] bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center font-black text-lg text-blue-500 shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                        {req.user_profiles?.full_name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-white uppercase tracking-widest truncate">{req.user_profiles?.full_name}</p>
                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest mt-1.5 lowercase opacity-60 italic flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          @{req.user_profiles?.username}
                        </p>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Payout sum</p>
                      <p className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2 underline decoration-emerald-500/20 underline-offset-8 decoration-2">
                        <span className="text-[10px] not-italic opacity-40 underline-none">KES</span> 
                        {req.amount?.toLocaleString()}
                      </p>
                   </div>
                   <div className="space-y-2 lg:col-span-1.5 border-l border-[#1e2235] pl-6 hidden lg:block border-opacity-50 min-w-0">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 text-left">Metadata</p>
                      <div className="flex flex-col gap-1.5 text-left">
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-widest line-clamp-1 flex items-center gap-1.5">
                          <Info size={12} className="text-blue-500 shrink-0" />
                          {req.reason || 'General Payout'}
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold tracking-widest uppercase opacity-60">
                          <Calendar size={12} className="shrink-0" />
                          {new Date(req.requested_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center justify-end gap-3 md:col-span-4 lg:col-span-1 border-t md:border-t-0 pt-6 md:pt-0 border-[#1e2235] border-opacity-30">
                      {req.status === 'pending' ? (
                        <div className="flex gap-3">
                           <button 
                             onClick={() => handleWithdrawalStatus(req.id, 'rejected')}
                             className="flex items-center gap-2 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 px-5 py-3 rounded-2xl border border-rose-500/10 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 group/btn"
                           >
                             <XCircle size={14} className="group-hover/btn:rotate-12 transition-transform" /> 
                             <span className="hidden sm:inline">Reject</span>
                           </button>
                           <button 
                             onClick={() => handleWithdrawalStatus(req.id, 'completed')}
                             className="flex items-center gap-2 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 px-5 py-3 rounded-2xl border border-emerald-500/10 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/5 group/btn"
                           >
                             <CheckCircle2 size={14} className="group-hover/btn:scale-125 transition-transform" /> 
                             <span className="hidden sm:inline">Approve</span>
                           </button>
                        </div>
                      ) : (
                        <div className={cn(
                          "flex items-center gap-2 px-5 py-3 bg-white/2 rounded-2xl border border-[#1e2235] text-[9px] font-black uppercase tracking-widest border-opacity-30 shadow-inner",
                          req.status === 'completed' ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {req.status === 'completed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {req.status}
                        </div>
                      )}
                   </div>
                </div>
             </Card>
           ))}

           {filteredWithdrawals.length === 0 && !loading && (
             <div className="text-center py-40 bg-[#0a0c10]/20 border border-[#1e2235] border-opacity-40 rounded-[40px] border-dashed">
               <ShieldAlert size={60} className="text-blue-500/10 mx-auto mb-8" />
               <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase opacity-20 underline decoration-blue-500/20 underline-offset-12">Queue Cleared</h3>
               <p className="text-[10px] font-black text-muted-foreground uppercase mt-6 tracking-[0.3em] opacity-30">No transaction vectors matched your authorization scope.</p>
             </div>
           )}
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
           {filteredDeposits.map((tx) => (
             <Card key={tx.id} className="bg-[#0a0c10] border-[#1e2235] border-opacity-20 p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:bg-white/3 hover:border-emerald-500/10 relative group overflow-hidden rounded-[32px] shadow-xl border-l-[6px] border-l-emerald-600 shadow-emerald-500/2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform pointer-events-none" />
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center relative z-10">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Tx Reference</p>
                      <p className="text-[12px] font-black text-white tabular-nums tracking-widest font-mono truncate max-w-[100px]">#{tx.reference?.slice(-8) || tx.id.slice(0, 8)}</p>
                   </div>
                   <div className="flex items-center gap-4 lg:col-span-1.5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-[20px] bg-linear-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 flex items-center justify-center font-black text-lg text-emerald-500 shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                        {tx.user_profiles?.full_name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-white uppercase tracking-widest truncate">{tx.user_profiles?.full_name}</p>
                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest mt-1.5 lowercase opacity-60 italic flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          @{tx.user_profiles?.username}
                        </p>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Entry sum</p>
                      <p className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2 underline decoration-emerald-500/20 underline-offset-8 decoration-2">
                        <span className="text-[10px] not-italic opacity-40 underline-none">KES</span> 
                        {tx.amount?.toLocaleString()}
                      </p>
                   </div>
                   <div className="space-y-2 lg:col-span-1.5 border-l border-[#1e2235] pl-6 hidden lg:block border-opacity-50 min-w-0">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 text-left">Arrival Data</p>
                      <div className="flex flex-col gap-1.5 text-left">
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-widest line-clamp-1 flex items-center gap-1.5">
                          <Info size={12} className="text-emerald-500 shrink-0" />
                           M-Pesa External Deposit
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold tracking-widest uppercase opacity-60">
                          <Calendar size={12} className="shrink-0" />
                          {new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center justify-end gap-3 md:col-span-4 lg:col-span-1 border-t md:border-t-0 pt-6 md:pt-0 border-[#1e2235] border-opacity-30">
                      <button 
                        onClick={() => handleDepositApproval(tx.id)}
                        className="flex items-center gap-2 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 px-6 py-3.5 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/5 group/btn"
                      >
                        <CheckCircle2 size={16} className="group-hover/btn:scale-125 transition-transform" /> 
                        Clear Funds
                      </button>
                   </div>
                </div>
             </Card>
           ))}

           {filteredDeposits.length === 0 && !loading && (
             <div className="text-center py-40 bg-[#0a0c10]/20 border border-[#1e2235] border-opacity-40 rounded-[40px] border-dashed">
               <ShieldAlert size={60} className="text-emerald-500/10 mx-auto mb-8" />
               <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase opacity-20 underline decoration-emerald-500/20 underline-offset-12">Ledger Synced</h3>
               <p className="text-[10px] font-black text-muted-foreground uppercase mt-6 tracking-[0.3em] opacity-30">No pending entry vectors detected in the system.</p>
             </div>
           )}
        </TabsContent>
        
        {loading && (
          <div className="py-40 text-center">
             <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-blue-500/20" />
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] animate-pulse opacity-60 font-mono">Synchronizing financial vectors...</p>
          </div>
        )}
      </Tabs>
    </div>
  )
}
