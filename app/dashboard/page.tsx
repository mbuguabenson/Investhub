'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Loader2, Search, Bell, Settings as SettingsIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUserProfile, getUserInvestments, getInvestmentPlans } from '@/lib/db'
import type { UserProfile, Investment, InvestmentPlan } from '@/lib/database.types'
import { WalletCard } from '@/components/dashboard/wallet-card'
import { PocketsGrid } from '@/components/dashboard/pockets-grid'
import { DepositModal } from '@/components/dashboard/deposit-modal'
import { TransferModal } from '@/components/dashboard/transfer-modal'
import { useTestMode } from '@/hooks/use-test-mode'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { isTestMode, toggleTestMode } = useTestMode()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser()

        if (!currentUser && !isTestMode) {
          router.push('/auth/login')
          return
        }

        setUser(currentUser)

        const [userProfile, userInvestments, investmentPlans] = await Promise.all([
          currentUser ? getUserProfile(currentUser.id) : null,
          currentUser ? getUserInvestments(currentUser.id) : [],
          getInvestmentPlans(),
        ])

        setProfile(userProfile)
        setInvestments(userInvestments)
        setPlans(investmentPlans)
      } catch (err) {
        console.error('Error initializing dashboard:', err)
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [isTestMode, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Hello, {profile?.full_name?.split(' ')[0] || (isTestMode ? 'Maria' : 'User')}! 👋</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Welcome back to your premium dashboard.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-2xl border border-border/20">
           <div className="flex items-center gap-2 px-3 py-2">
            <Switch 
              id="test-mode" 
              checked={isTestMode} 
              onCheckedChange={toggleTestMode}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="test-mode" className="text-[10px] font-black uppercase tracking-widest cursor-pointer text-muted-foreground">
              Test Mode
            </Label>
          </div>
          <div className="h-8 w-px bg-border/20" />
          <button className="p-2 hover:bg-muted rounded-xl transition-colors relative">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </button>
          <div className="h-10 w-10 rounded-xl bg-gradient-purple flex items-center justify-center font-black text-sm text-white shadow-lg">
            {profile?.full_name?.[0] || (isTestMode ? 'M' : 'U')}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Wallet and Pockets */}
        <div className="lg:col-span-8 space-y-8">
          <WalletCard 
            balance={isTestMode ? 42982.00 : (profile?.account_balance || 0)} 
            onDeposit={() => setIsDepositOpen(true)}
            onTransfer={() => setIsTransferOpen(true)}
          />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-black italic tracking-tighter text-foreground uppercase">Pockets</h3>
              <Button variant="link" className="text-primary p-0 text-[10px] font-black uppercase tracking-widest">View All</Button>
            </div>
            <PocketsGrid />
          </div>
        </div>

        {/* Right Column: Quick Stats/Activity */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="card-premium h-full border-none p-8 flex flex-col shadow-2xl">
            <h3 className="text-xl font-black italic tracking-tighter text-foreground uppercase mb-8">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { title: 'Transfer to Maria', date: '20 May 2024', amount: -1500, type: 'transfer' },
                { title: 'Investment Return', date: '19 May 2024', amount: +450.50, type: 'return' },
                { title: 'Deposit via M-Pesa', date: '18 May 2024', amount: +10000, type: 'deposit' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Search size={20} className="text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{activity.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{activity.date}</p>
                  </div>
                  <p className={cn("font-black text-sm", activity.amount > 0 ? "text-emerald-500" : "text-foreground")}>
                    {activity.amount > 0 ? '+' : ''}KES {Math.abs(activity.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-8 bg-muted/50 hover:bg-muted text-foreground rounded-2xl h-12 border border-border/20 text-[10px] font-black uppercase tracking-widest">
              See All Transactions
            </Button>
          </Card>
        </div>
      </div>

      {/* Analytics/Market Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="card-premium border-none p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic tracking-tighter text-foreground uppercase">Market Trends</h3>
              <div className="px-3 py-1 glass bg-emerald-500/10 border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-500 shadow-sm">Live</div>
            </div>
            <div className="h-48 flex items-end gap-2 px-2">
              {[40, 60, 45, 90, 65, 80, 55, 70, 85, 40, 50, 75].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/20 rounded-t-lg relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom rounded-t-lg" />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest px-2">
              <span>Goal: KES 100,000</span>
              <span>24.5%</span>
            </div>
         </Card>

          <Card className="card-premium border-none bg-gradient-purple flex flex-col justify-between p-8 relative overflow-hidden group shadow-2xl shadow-purple-500/20">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
             <div className="relative z-10">
               <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">Safe to spend</h3>
               <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Based on your monthly budget of KES 30,000</p>
             </div>
             <div className="my-8 relative z-10">
                <h2 className="text-5xl font-black italic tracking-tighter text-white">KES 17,890.00</h2>
                <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden shadow-inner border border-white/5">
                   <div className="h-full bg-white w-[75%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>
             </div>
             <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-[20px] h-14 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/10 relative z-10">
               Adjust Budget
             </Button>
          </Card>
      </div>

      {/* Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
    </div>
  )
}
