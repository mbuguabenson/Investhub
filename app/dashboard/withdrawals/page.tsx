'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AlertCircle, Loader2, Plus, TrendingUp, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUserProfile, getUserInvestments } from '@/lib/db'
import type { UserProfile, Investment } from '@/lib/database.types'
import DashboardHeader from '@/components/dashboard/header'
import WithdrawalForm from '@/components/dashboard/withdrawal-form'

export default function WithdrawalsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        const [userProfile, userInvestments] = await Promise.all([
          getUserProfile(user.id),
          getUserInvestments(user.id),
        ])

        setProfile(userProfile)
        setInvestments(userInvestments)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const maturedInvestments = investments.filter((inv) => inv.status === 'matured')
  const totalAvailableForWithdrawal = maturedInvestments.reduce((sum, inv) => {
    return sum + inv.amount + inv.accrued_returns
  }, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Manage Withdrawals</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Withdraw funds from your matured investments</p>
        </div>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20 p-6 flex gap-3 rounded-[32px]">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-red-500 text-sm font-bold">{error}</p>
        </Card>
      )}

      {/* Withdrawal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-premium border-border/20 p-8 shadow-sm group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">Account Balance</p>
              <p className="text-3xl font-black italic tracking-tighter text-foreground mt-2">
                KES {profile?.account_balance.toLocaleString()}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
          </div>
        </Card>

        <Card className="card-premium border-border/20 p-8 shadow-sm group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">Available for Withdrawal</p>
              <p className="text-3xl font-black italic tracking-tighter text-foreground mt-2">
                KES {totalAvailableForWithdrawal.toLocaleString()}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
              <LogOut size={28} />
            </div>
          </div>
        </Card>
      </div>

      {/* Matured Investments */}
      <div className="space-y-6">
        <h2 className="text-xl font-black italic tracking-tighter text-foreground px-2 uppercase">Matured Investments</h2>
        {maturedInvestments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {maturedInvestments.map((investment) => (
              <Card key={investment.id} className="card-premium border-border/20 p-8 space-y-8 relative overflow-hidden group">
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">Investment ID</p>
                    <p className="text-foreground font-black font-mono tracking-wider">{investment.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">Total Amount</p>
                    <p className="text-emerald-500 font-black text-2xl italic tracking-tighter">
                      KES {(investment.amount + investment.accrued_returns).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 relative z-10">
                  <div className="space-y-1">
                    <p className="text-muted-foreground/60 text-[8px] font-black uppercase tracking-widest">Principal</p>
                    <p className="text-foreground font-black text-sm italic">
                      KES {investment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground/60 text-[8px] font-black uppercase tracking-widest">Returns</p>
                    <p className="text-foreground font-black text-sm italic">
                      KES {investment.accrued_returns.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground/60 text-[8px] font-black uppercase tracking-widest">Status</p>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm inline-block">
                      {investment.status}
                    </span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full h-14 bg-primary text-white hover:opacity-90 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-95 relative z-10">
                      <Plus className="w-4 h-4 mr-2" />
                      Request Withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border/20 text-foreground max-w-md p-8 rounded-[32px] shadow-2xl">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-center">Withdrawal Request</DialogTitle>
                    </DialogHeader>
                    <WithdrawalForm investment={investment} />
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-premium border-border/20 p-20 text-center shadow-inner">
            <div className="w-20 h-20 bg-muted/50 rounded-[2rem] flex items-center justify-center mx-auto text-muted-foreground/30 mb-6 shadow-inner">
               <TrendingUp size={40} />
            </div>
            <p className="text-foreground font-black italic tracking-tighter text-xl uppercase">No matured investments</p>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed">Your matured investments ready for checkout<br />will appear in this highly secured vault.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
