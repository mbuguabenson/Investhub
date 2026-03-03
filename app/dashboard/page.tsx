'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Loader2, Search, Bell, Settings as SettingsIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUserProfile, getUserInvestments, getInvestmentPlans, getUserTransactions } from '@/lib/db'
import type { UserProfile, Investment, InvestmentPlan, Transaction } from '@/lib/database.types'
import { WalletCard } from '@/components/dashboard/wallet-card'
import { PocketsGrid } from '@/components/dashboard/pockets-grid'
import { DepositModal } from '@/components/dashboard/deposit-modal'
import { TransferModal } from '@/components/dashboard/transfer-modal'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const depositStatus = searchParams.get('status')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  useEffect(() => {
    const initializeDashboard = async () => {
      console.log('Initializing Dashboard...')
      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser()

        console.log('Dashboard Auth check:', { user: !!currentUser, error: userError })

        if (!currentUser) {
          console.log('No user found, redirecting to login...')
          router.push('/auth/login')
          return
        }

        setUser(currentUser)

        console.log('Fetching profile and data...')
        let userProfile = currentUser ? await getUserProfile(currentUser.id) : null

        // Auto-initialize profile if missing (common for Google OAuth)
        if (currentUser && !userProfile) {
          console.log('Profile missing, auto-initializing...')
          try {
            const response = await fetch('/api/auth/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: currentUser.id,
                profileData: {
                  full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Investor',
                  username: currentUser.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, '_') || `user_${currentUser.id.slice(0, 5)}`,
                  phone_number: 'PENDING',
                  id_number: 'PENDING',
                }
              })
            })
            if (response.ok) {
              const initResult = await response.json()
              userProfile = initResult.profile
              console.log('Profile auto-initialized successfully')
            }
          } catch (initErr) {
            console.error('Failed to auto-initialize profile:', initErr)
          }
        }

        const [userInvestments, investmentPlans, userTransactions] = await Promise.all([
          currentUser ? getUserInvestments(currentUser.id) : [],
          getInvestmentPlans(),
          currentUser ? getUserTransactions(currentUser.id) : [],
        ])

        console.log('Data fetched:', { 
          profile: !!userProfile, 
          investments: userInvestments.length, 
          plans: investmentPlans.length,
          transactions: userTransactions.length
        })

        setProfile(userProfile)
        setInvestments(userInvestments)
        setPlans(investmentPlans)
        setTransactions(userTransactions.slice(0, 3)) // Show only last 3
      } catch (err) {
        console.error('Error initializing dashboard:', err)
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [router, depositStatus])

  useEffect(() => {
    let profileChannel: any
    let transactionChannel: any

    const setupRealtime = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      // Listen for profile changes (balance)
      profileChannel = supabase
        .channel(`public:user_profiles:${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_profiles',
            filter: `id=eq.${currentUser.id}`
          },
          async (payload) => {
            console.log('Dashboard: Profile update detected, re-fetching...')
            const data = await getUserProfile(currentUser.id)
            if (data) setProfile(data)
          }
        )
        .subscribe()

      // Listen for new transactions
      transactionChannel = supabase
        .channel(`public:transactions:${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${currentUser.id}`
          },
          async () => {
            console.log('Real-time transaction update, re-fetching...')
            const latest = await getUserTransactions(currentUser.id)
            setTransactions(latest.slice(0, 3))
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (profileChannel) supabase.removeChannel(profileChannel)
      if (transactionChannel) supabase.removeChannel(transactionChannel)
    }
  }, [])

  useEffect(() => {
    // Fallback polling for deposit success if redirecting with status=completed
    if (depositStatus === 'completed') {
      const interval = setInterval(async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          const userProfile = await getUserProfile(currentUser.id)
          if (userProfile) setProfile(userProfile)
          
          const userTransactions = await getUserTransactions(currentUser.id)
          setTransactions(userTransactions.slice(0, 3))
        }
      }, 5000)
      
      const timeout = setTimeout(() => clearInterval(interval), 20000)
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [depositStatus])

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
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Hello, {profile?.full_name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Welcome back to your premium dashboard.</p>
        </div>
        
        {depositStatus === 'completed' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Deposit Received - Updating Balance</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-2xl border border-border/20">

          <div className="h-8 w-px bg-border/20" />
          <button className="p-2 hover:bg-muted rounded-xl transition-colors relative">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </button>
          <div className="h-10 w-10 rounded-xl bg-gradient-purple flex items-center justify-center font-black text-sm text-white shadow-lg">
            {profile?.full_name?.[0] || 'U'}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Wallet and Pockets */}
        <div className="lg:col-span-8 space-y-8">
          <WalletCard 
            balance={profile?.account_balance || 0} 
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
              {transactions.length > 0 ? (
                transactions.map((activity, i) => (
                  <div key={activity.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/dashboard/transactions')}>
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Search size={20} className="text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground capitalize">{activity.type} {activity.status === 'pending' ? '(Pending)' : ''}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        {new Date(activity.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <p className={cn(
                      "font-black text-sm", 
                      activity.type === 'deposit' || activity.type === 'return' ? "text-emerald-500" : "text-foreground"
                    )}>
                      {activity.type === 'deposit' || activity.type === 'return' ? '+' : '-'}KES {activity.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">No recent activity</p>
                </div>
              )}
            </div>
            <Button 
              className="w-full mt-8 bg-muted/50 hover:bg-muted text-foreground rounded-2xl h-12 border border-border/20 text-[10px] font-black uppercase tracking-widest"
              onClick={() => router.push('/dashboard/transactions')}
            >
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
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        initialPhoneNumber={profile?.phone_number}
      />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
