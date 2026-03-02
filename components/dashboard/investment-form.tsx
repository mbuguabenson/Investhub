'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, CheckCircle2, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { createInvestment, createTransaction } from '@/lib/db'
import type { InvestmentPlan } from '@/lib/database.types'
import { useTestMode } from '@/hooks/use-test-mode'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { getUserProfile } from '@/lib/db'
import { useEffect } from 'react'
import type { UserProfile } from '@/lib/database.types'

interface InvestmentFormProps {
  plan: InvestmentPlan
}

export default function InvestmentForm({ plan }: InvestmentFormProps) {
  const { isTestMode } = useTestMode()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getUserProfile(user.id)
        setProfile(data)
      }
    }
    loadProfile()
  }, [])

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const investmentAmount = parseFloat(amount)

    if (!amount || isNaN(investmentAmount)) {
      setError('Please enter a valid amount')
      return
    }

    if (investmentAmount < plan.minimum_amount) {
      setError(`Minimum investment is KES ${plan.minimum_amount.toLocaleString()}`)
      return
    }

    if (profile && profile.account_balance < investmentAmount && !isTestMode) {
      setError(`Insufficient balance. You need KES ${(investmentAmount - profile.account_balance).toLocaleString()} more to activate this strategy.`);
      return
    }

    setLoading(true)

    try {
      if (isTestMode) {
        // Mock success for test mode
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSuccess(true)
        setAmount('')
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('User not found. Please log in again.')
        return
      }

      // Create investment logic...
      const maturityDate = new Date()
      maturityDate.setDate(maturityDate.getDate() + plan.maturity_days)
      const maturityDateStr = maturityDate.toISOString().split('T')[0]

      const investment = await createInvestment(
        user.id,
        plan.id,
        investmentAmount,
        maturityDateStr
      )

      if (!investment) throw new Error('Failed to create investment')

      await createTransaction(
        user.id,
        'deposit',
        investmentAmount,
        `Investment: ${plan.name}`
      )

      setSuccess(true)
      setAmount('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-black italic tracking-tighter text-foreground uppercase">Investment Active!</h3>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2">Your funds are now working for you.</p>
        <div className="mt-8 p-6 glass bg-emerald-500/5 rounded-[32px] border border-emerald-500/10 shadow-inner">
           <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">Expected Daily Profit</span>
            <span className="text-emerald-500 font-black italic tracking-tighter text-lg">+KES {(parseFloat(amount || '0') * (plan.daily_return_rate / 100)).toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleInvest} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-3 animate-in fade-in zoom-in duration-300">
          <div className="flex gap-3">
            <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
          </div>
          {error.includes('Insufficient balance') && (
            <Button 
              onClick={() => router.push('/dashboard/wallet')}
              className="w-full bg-red-500 text-white h-10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
            >
              Deposit Funds Now
            </Button>
          )}
        </div>
      )}

      <div className="space-y-4">
        <Label htmlFor="amount" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
          Amount to Invest (KES)
        </Label>
        <div className="relative group">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-black italic tracking-tighter transition-colors group-focus-within:text-primary">KES</span>
          <Input
            id="amount"
            type="number"
            placeholder={`Min: ${plan.minimum_amount.toLocaleString()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            className="h-20 pl-20 bg-muted/30 border-border/10 rounded-[24px] focus:ring-primary/50 text-foreground font-black italic tracking-tighter text-2xl shadow-inner transition-all hover:bg-muted/50"
            step="100"
          />
        </div>
        <div className="flex gap-2 px-1">
           {[1000, 5000, 10000].map((val) => (
             <button
               key={val}
               type="button"
               onClick={() => setAmount(val.toString())}
               className="px-4 py-2 rounded-xl bg-muted/50 border border-border/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:border-primary/50 transition-all active:scale-95"
             >
               +KES {val.toLocaleString()}
             </button>
           ))}
        </div>
      </div>

      <div className="p-8 glass bg-muted/20 border-border/10 rounded-[32px] space-y-6 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex justify-between items-center text-sm relative z-10">
          <div className="space-y-1">
            <span className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest block">Estimated Daily ROI</span>
            <span className="text-[8px] font-bold text-primary italic uppercase tracking-widest">Fixed {plan.daily_return_rate}% Daily</span>
          </div>
          <span className="font-black italic tracking-tighter text-emerald-500 text-2xl">
            {amount ? `+KES ${(parseFloat(amount) * (plan.daily_return_rate / 100)).toLocaleString()}` : 'KES 0.00'}
          </span>
        </div>
        
        <div className="h-px bg-border/10 w-full" />
        
        <div className="flex justify-between items-center text-sm relative z-10">
          <div className="flex flex-col">
            <span className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">Total Maturity</span>
            <span className="text-muted-foreground/40 text-[8px] font-black uppercase tracking-widest">After {plan.maturity_days} {plan.maturity_days === 1 ? 'day' : 'days'}</span>
          </div>
          <span className="font-black italic tracking-tighter text-primary text-2xl">
            {amount ? `KES ${(parseFloat(amount) * (1 + (plan.daily_return_rate / 100) * plan.maturity_days)).toLocaleString()}` : 'KES 0.00'}
          </span>
        </div>
      </div>

      {isTestMode && (
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-pulse">
          <TrendingUp size={20} className="text-primary" />
          <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Test Mode Active: Simulating Real-Time Growth</p>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading || !amount || parseFloat(amount) < plan.minimum_amount} 
        className="w-full h-20 bg-gradient-bineo hover:opacity-90 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-[24px] shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        {loading ? (
          <div className="flex items-center gap-3 relative z-10">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>AUTHORIZING TRANSACTION...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 relative z-10">
             DEPLOY CAPITAL
             <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </Button>
    </form>
  )
}
