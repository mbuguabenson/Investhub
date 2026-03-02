'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Filter,
  TrendingUp,
  CreditCard,
  Smartphone,
  Building2,
  Zap,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HistoryPage() {
  const [search, setSearch] = useState('')

  const transactions = [
    { id: '1', title: 'Transfer to Maria Garcia', date: '21 May 2024, 14:30', amount: -2500, type: 'transfer', status: 'completed', icon: ArrowUpRight, color: 'bg-muted/50 border border-border/20 text-foreground shadow-inner' },
    { id: '2', title: 'Investment: Bitcoin Growth', date: '20 May 2024, 09:15', amount: -15000, type: 'investment', status: 'completed', icon: Zap, color: 'bg-primary/10 border border-primary/20 text-primary shadow-sm' },
    { id: '3', title: 'M-Pesa Deposit', date: '19 May 2024, 18:45', amount: 50000, type: 'deposit', status: 'completed', icon: Smartphone, color: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-sm' },
    { id: '4', title: 'Daily Dividend: Real Estate', date: '19 May 2024, 00:01', amount: 450.75, type: 'dividend', status: 'completed', icon: TrendingUp, color: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 shadow-sm' },
    { id: '5', title: 'Withdrawal to Bank', date: '18 May 2024, 11:20', amount: -6000, type: 'withdrawal', status: 'pending', icon: ArrowDownLeft, color: 'bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-sm' },
    { id: '6', title: 'Card Payment: Amazon', date: '17 May 2024, 15:10', amount: -89.99, type: 'payment', status: 'completed', icon: CreditCard, color: 'bg-blue-500/10 border border-blue-500/20 text-blue-500 shadow-sm' },
  ]

  const filteredTransactions = transactions.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Review and filter your financial activity.</p>
        </div>
        
        <div className="flex gap-3">
           <Button variant="outline" className="bg-muted/50 border-border/20 text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-12">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
          <Button variant="outline" className="bg-muted/50 border-border/20 text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-12">
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="card-premium border-border/20 p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/10 space-y-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
            <Input
              placeholder="Search by name, type or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 pl-12 bg-muted/50 border-border/20 rounded-2xl focus:ring-primary/50 text-foreground text-xs font-bold uppercase tracking-widest placeholder-muted-foreground/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Deposits', 'Transfers', 'Investments', 'Withdrawals'].map((tab) => (
              <button
                key={tab}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                  tab === 'All' ? "bg-primary text-white shadow-primary/20" : "bg-muted/50 border border-border/20 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border/10">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-6 flex items-center gap-6 hover:bg-muted/30 transition-colors group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", tx.color)}>
                <tx.icon size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-lg italic tracking-tighter text-foreground group-hover:text-primary transition-colors">{tx.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xl font-black italic tracking-tighter",
                      tx.amount > 0 ? "text-emerald-500" : "text-foreground"
                    )}>
                      {tx.amount > 0 ? '+' : ''}KES {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2 inline-block shadow-sm",
                      tx.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    )}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>

              <button className="text-muted-foreground/10 hover:text-foreground transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          ))}
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
              <Search size={40} />
            </div>
            <p className="text-white/40 font-medium">No transactions found matching your criteria.</p>
          </div>
        )}
      </Card>
      
      <div className="text-center pb-8">
        <Button variant="link" className="text-muted-foreground/20 hover:text-primary text-[10px] font-black uppercase tracking-widest">
          LOADING MORE TRANSACTIONS
        </Button>
      </div>
    </div>
  )
}
