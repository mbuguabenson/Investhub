'use client'

import { useEffect, useState } from 'react'
import { getInvestmentPlans } from '@/lib/db'
import type { InvestmentPlan } from '@/lib/database.types'
import InvestmentPlansGrid from '@/components/dashboard/investment-plans-grid'
import { Loader2, TrendingUp, ShieldCheck, Zap } from 'lucide-react'


export default function ExchangePage() {

  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getInvestmentPlans()
        setPlans(data)
      } catch (error) {
        console.error('Error fetching plans:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Investment Plans</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Choose a plan that fits your financial goals.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Market Bullish</span>
          </div>
          <div className="h-8 w-px bg-border/20" />
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Insured</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-bineo rounded-[40px] p-8 md:p-16 relative overflow-hidden group shadow-2xl shadow-primary/20">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
         <div className="relative z-10 max-w-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner border border-white/20">
              <Zap size={32} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] italic tracking-tighter">
              MAXIMIZE YOUR RETURNS WITH PRECISION.
            </h2>
            <p className="text-white/80 mt-8 text-lg font-medium leading-relaxed">
              Our AI-driven strategies ensure your capital is always working in the most profitable markets. 
            </p>
         </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black italic tracking-tighter text-foreground uppercase">Available Strategies</h3>
          <p className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest">{plans.length} active plans</p>
        </div>
        <InvestmentPlansGrid plans={plans} />
      </div>

      <div className="p-8 glass bg-muted/30 border-border/20 rounded-[40px] flex flex-col md:flex-row items-center gap-10 shadow-sm">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary shrink-0 shadow-inner">
          <TrendingUp size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-2xl font-black italic tracking-tighter text-foreground uppercase">Compound your growth</h4>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-2 leading-relaxed">Reinvest your daily profits automatically to reach your targets faster and more efficiently.</p>
        </div>
        <button className="px-10 py-5 bg-muted/50 hover:bg-muted border border-border/20 text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
          Learn More
        </button>
      </div>
    </div>
  )
}
