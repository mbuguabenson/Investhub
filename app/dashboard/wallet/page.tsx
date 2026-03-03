'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  Copy,
  Check,
  Loader2,
  ArrowDownLeft,
  DollarSign
} from 'lucide-react'
import { WalletCard } from '@/components/dashboard/wallet-card'
import { DepositModal } from '@/components/dashboard/deposit-modal'
import { TransferModal } from '@/components/dashboard/transfer-modal'
import { WalletWithdrawalModal } from '@/components/dashboard/wallet-withdrawal-modal'

import { supabase } from '@/lib/supabase'
import { getUserProfile, getUserTransactions } from '@/lib/db'
import type { UserProfile, Transaction } from '@/lib/database.types'
import { cn } from '@/lib/utils'

function WalletContent() {
  const searchParams = useSearchParams()
  const depositStatus = searchParams.get('status')

  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add global listener for withdrawal button in WalletCard
    (window as any).dispatchWithdrawal = () => setIsWithdrawOpen(true)

    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const [profileData, transactionsData] = await Promise.all([
            getUserProfile(user.id),
            getUserTransactions(user.id)
          ])
          setProfile(profileData)
          setTransactions(transactionsData.slice(0, 5)) // Show last 5
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      delete (window as any).dispatchWithdrawal
    }
  }, [])

  useEffect(() => {
    let profileChannel: any
    let transactionChannel: any

    const setupRealtime = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      // Listen for profile changes
      profileChannel = supabase
        .channel(`wallet_profile:${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_profiles',
            filter: `id=eq.${currentUser.id}`
          },
          (payload) => {
            console.log('Real-time wallet profile update:', payload.new)
            setProfile(payload.new as UserProfile)
          }
        )
        .subscribe()

      // Listen for transactions
      transactionChannel = supabase
        .channel(`wallet_transactions:${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${currentUser.id}`
          },
          async () => {
            console.log('Real-time wallet transaction update')
            const latest = await getUserTransactions(currentUser.id)
            setTransactions(latest.slice(0, 5))
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

  const accountId = 'IH-7782-9910-4589'

  const handleCopy = () => {
    navigator.clipboard.writeText(accountId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">My Wallet</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Manage your funds and connected accounts.</p>
        </div>

        {depositStatus === 'completed' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Deposit Successful! Updating balance...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <WalletCard
            balance={profile?.account_balance || 0}
            onDeposit={() => setIsDepositOpen(true)}
            onTransfer={() => setIsTransferOpen(true)}
          />

          <Card className="card-premium border-border/20 p-8 space-y-6">
            <h3 className="text-xl font-black italic tracking-tighter text-foreground">Account Details</h3>
            <div className="space-y-4">
               <div className="p-4 bg-muted/50 border border-border/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/60 text-[10px] uppercase font-black tracking-[0.2em]">Account Number</p>
                  <p className="text-lg font-black mt-1 text-foreground font-mono tracking-wider">{accountId}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-3 hover:bg-muted rounded-xl transition-colors text-primary"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 border border-border/20 rounded-2xl">
                  <p className="text-muted-foreground/60 text-[10px] uppercase font-black tracking-[0.2em]">Account Type</p>
                  <p className="text-sm font-black uppercase tracking-widest mt-1 text-foreground">Premium Investment</p>
                </div>
                <div className="p-4 bg-muted/50 border border-border/20 rounded-2xl">
                  <p className="text-muted-foreground/60 text-[10px] uppercase font-black tracking-[0.2em]">Currency</p>
                  <p className="text-sm font-black uppercase tracking-widest mt-1 text-foreground">KES (Shillings)</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-premium border-border/20 p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black italic tracking-tighter text-foreground uppercase">Recent Transactions</h3>
              <Button 
                variant="link" 
                className="text-primary text-[10px] font-black uppercase tracking-widest p-0"
                onClick={() => (window as any).location.href = '/dashboard/transactions'}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-6">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between group cursor-pointer" onClick={() => (window as any).location.href = '/dashboard/transactions'}>
                    <div className="flex items-center gap-5">
                      <div className="bg-muted/50 border border-border/20 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                        {transaction.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5 text-emerald-500" /> : 
                         transaction.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5 text-red-500" /> : 
                         <DollarSign className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div>
                        <p className="font-black italic tracking-tighter text-foreground uppercase text-sm">{transaction.type}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-0.5">
                          {new Date(transaction.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-black italic tracking-tighter",
                        transaction.type === 'withdrawal' ? 'text-foreground' : 'text-emerald-500'
                      )}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">{transaction.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">No transactions yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <Card className="card-premium border-border/20 p-8 space-y-6">
            <h3 className="text-xl font-black italic tracking-tighter text-foreground">Connected Methods</h3>
            <div className="space-y-4">
              {[
                { name: 'M-Pesa Express', detail: '+254 712 *** 789', icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { name: 'Visa Platinum', detail: '**** 4589', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { name: 'Equity Bank', detail: 'Account ending in 901', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              ].map((method, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.bg} ${method.color} shadow-sm`}>
                    <method.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{method.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{method.detail}</p>
                  </div>
                  <button className="text-muted-foreground/20 group-hover:text-primary transition-colors">
                    <SettingsIcon size={18} />
                  </button>
                </div>
              ))}
              <Button className="w-full h-12 bg-muted/50 hover:bg-muted text-foreground border border-border/20 rounded-xl mt-4 text-[10px] font-black uppercase tracking-widest">
                <Plus size={18} className="mr-2" /> Add New Method
              </Button>
            </div>
          </Card>

          <Card className="card-premium border-white/10 bg-gradient-bineo p-8 text-white shadow-[0_20px_40px_rgba(245,158,11,0.2)]">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                   <Wallet size={24} />
                </div>
                <h4 className="text-xl font-black italic tracking-tighter uppercase">Virtual card coming soon</h4>
             </div>
             <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed mb-8">
               We're building a seamless way for you to spend your investment profits anywhere in the world.
             </p>
             <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] h-12 shadow-lg active:scale-95 transition-all">
               Get Notified
             </Button>
          </Card>
        </div>
      </div>

      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        initialPhoneNumber={profile?.phone_number}
      />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <WalletWithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={profile?.account_balance || 0}
        initialPhoneNumber={profile?.phone_number}
      />
    </div>
  )
}

export default function WalletPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <WalletContent />
    </Suspense>
  )
}

function SettingsIcon({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.72V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.17a2 2 0 0 1 1-1.74l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
