'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Loader2, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUserTransactions } from '@/lib/db'
import type { Transaction } from '@/lib/database.types'
import { cn } from '@/lib/utils'

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        const userTransactions = await getUserTransactions(user.id)
        setTransactions(userTransactions)
      } catch (err) {
        console.error('Error loading transactions:', err)
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [router])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />
      case 'return':
        return <DollarSign className="w-5 h-5 text-blue-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-emerald-900'
      case 'pending':
        return 'bg-yellow-500 text-yellow-900'
      case 'failed':
        return 'bg-red-500 text-red-900'
      default:
        return 'bg-slate-600 text-slate-100'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Transaction History</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">View all your deposits, returns, and withdrawals</p>
        </div>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/20 p-6 flex gap-3 rounded-[32px]">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-red-500 text-sm font-bold">{error}</p>
        </Card>
      )}

      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="card-premium border-border/20 p-6 group transition-all hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-muted/50 border border-border/20 p-4 rounded-2xl shadow-inner group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-black italic tracking-tighter text-lg text-foreground uppercase">{transaction.type}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className={cn(
                    "text-xl font-black italic tracking-tighter",
                    transaction.type === 'withdrawal' ? 'text-foreground' : 'text-emerald-500'
                  )}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                  </p>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border",
                    transaction.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    transaction.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  )}>
                    {transaction.status}
                  </span>
                </div>
              </div>
              {transaction.reference && (
                <div className="mt-4 pt-4 border-t border-border/10">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Reference: {transaction.reference}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-premium border-border/20 p-20 text-center shadow-inner">
          <div className="w-20 h-20 bg-muted/50 rounded-[2rem] flex items-center justify-center mx-auto text-muted-foreground/30 mb-6 shadow-inner">
             <DollarSign size={40} />
          </div>
          <p className="text-foreground font-black italic tracking-tighter text-xl uppercase">No transactions yet</p>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed">Your financial journey with InvestHub<br />will unfold here as you start investing.</p>
        </Card>
      )}
    </div>
  )
}
