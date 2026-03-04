'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  Package, 
  Settings2, 
  Save, 
  RotateCcw,
  Percent,
  Clock,
  DollarSign
} from 'lucide-react'
import { getAdminInvestmentPlans, updateInvestmentPlan } from '@/lib/db'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>({})

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setLoading(true)
    const data = await getAdminInvestmentPlans()
    setPlans(data)
    setLoading(false)
  }

  const handleEditClick = (plan: any) => {
    setEditingId(plan.id)
    setEditFormData({ ...plan })
  }

  const handleSave = async (id: string) => {
    const success = await updateInvestmentPlan(id, editFormData)
    if (success) {
      toast.success('Plan updated successfully')
      setEditingId(null)
      fetchPlans()
    } else {
      toast.error('Failed to update plan')
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-blue-500/30 underline-offset-8">Package Modules</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60 leading-relaxed text-left">
            Configure system-wide investment yield parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {plans.map((plan) => {
          const isEditing = editingId === plan.id
          return (
            <Card key={plan.id} className={cn(
              "bg-[#0a0c10] border-[#1e2235] border-opacity-20 p-10 rounded-[40px] overflow-hidden relative group transition-all duration-500",
              isEditing ? "ring-2 ring-blue-600/30 border-blue-500/40 translate-y-[-4px]" : "hover:border-blue-500/10 shadow-2xl"
            )}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/[0.03] rounded-full blur-[80px] -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[24px] bg-linear-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-500 shadow-inner group-hover:rotate-6 transition-transform">
                        <Package size={32} />
                      </div>
                      <div>
                        <input 
                          disabled={!isEditing}
                          value={isEditing ? editFormData.name : plan.name}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          className="bg-transparent text-2xl font-black italic tracking-tighter text-white uppercase focus:outline-none focus:text-blue-500 disabled:opacity-100 placeholder:opacity-20 w-fit"
                        />
                        <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 w-fit shadow-inner">
                           <div className={cn("w-1.5 h-1.5 rounded-full", plan.is_active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]")} />
                           <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                              {plan.is_active ? 'Online' : 'Dormant'}
                           </span>
                        </div>
                      </div>
                   </div>
                   
                   {!isEditing ? (
                     <button 
                       onClick={() => handleEditClick(plan)}
                       className="p-3.5 bg-white/5 border border-[#1e2235] rounded-2xl hover:bg-white/10 transition-all text-muted-foreground hover:text-white border-opacity-50"
                     >
                       <Settings2 size={20} />
                     </button>
                   ) : (
                     <div className="flex gap-2.5">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl hover:bg-rose-500/10 transition-all text-rose-500"
                        >
                          <RotateCcw size={20} />
                        </button>
                        <button 
                          onClick={() => handleSave(plan.id)}
                          className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl hover:bg-emerald-500/10 transition-all text-emerald-500 shadow-lg shadow-emerald-500/5"
                        >
                          <Save size={20} />
                        </button>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#1e2235]/30 text-left">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground opacity-40">
                         <Percent size={14} className="text-blue-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Yield Multiplier</span>
                      </div>
                      <div className="flex items-end gap-1.5 px-4 py-3 bg-white/[0.02] border border-[#1e2235] rounded-2xl border-opacity-30 group-focus-within:border-blue-500/20 transition-all shadow-inner">
                        <input 
                          type="number"
                          step="0.1"
                          disabled={!isEditing}
                          value={isEditing ? editFormData.daily_return_rate : plan.daily_return_rate}
                          onChange={(e) => setEditFormData({...editFormData, daily_return_rate: Number(e.target.value)})}
                          className="bg-transparent text-2xl font-black text-white italic tracking-tighter w-full focus:outline-none tabular-nums"
                        />
                        <span className="text-[11px] font-black text-blue-500 uppercase mb-1.5 opacity-60">%</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground opacity-40">
                         <Clock size={14} className="text-indigo-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Maturity Horizon</span>
                      </div>
                      <div className="flex items-end gap-1.5 px-4 py-3 bg-white/[0.02] border border-[#1e2235] rounded-2xl border-opacity-30 group-focus-within:border-blue-500/20 transition-all shadow-inner">
                        <input 
                          type="number"
                          disabled={!isEditing}
                          value={isEditing ? editFormData.maturity_days : plan.maturity_days}
                          onChange={(e) => setEditFormData({...editFormData, maturity_days: Number(e.target.value)})}
                          className="bg-transparent text-2xl font-black text-white italic tracking-tighter w-full focus:outline-none tabular-nums"
                        />
                        <span className="text-[11px] font-black text-indigo-500 uppercase mb-1.5 italic opacity-60">Days</span>
                      </div>
                   </div>

                   <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center gap-2 text-muted-foreground opacity-40">
                         <DollarSign size={14} className="text-emerald-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Entry Threshold (Minimum Amount)</span>
                      </div>
                      <div className="flex items-end gap-3 px-5 py-4 bg-white/[0.02] border border-[#1e2235] rounded-2xl border-opacity-30 group-focus-within:border-blue-500/20 transition-all shadow-inner">
                        <span className="text-[11px] font-black text-muted-foreground uppercase opacity-40 mb-1.5">KES</span>
                        <input 
                          type="number"
                          disabled={!isEditing}
                          value={isEditing ? editFormData.minimum_amount : plan.minimum_amount}
                          onChange={(e) => setEditFormData({...editFormData, minimum_amount: Number(e.target.value)})}
                          className="bg-transparent text-3xl font-black text-white italic tracking-tighter w-full focus:outline-none tabular-nums"
                        />
                      </div>
                   </div>
                </div>

                {isEditing && (
                  <div className="flex items-center justify-between p-5 bg-blue-600/[0.03] border border-blue-500/10 rounded-3xl animate-in fade-in zoom-in-95 duration-500 border-dashed">
                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Visibility Status</span>
                     <button 
                       onClick={() => setEditFormData({...editFormData, is_active: !editFormData.is_active})}
                       className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        editFormData.is_active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 text-muted-foreground border border-white/10"
                       )}
                     >
                       {editFormData.is_active ? 'Public Access' : 'Internal Only'}
                     </button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {loading && (
          <div className="col-span-1 lg:col-span-2 py-40 text-center">
             <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-blue-500/20 shadow-glow" />
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] animate-pulse opacity-60">Synchronizing modules with cluster...</p>
          </div>
        )}
      </div>
    </div>
  )
}
