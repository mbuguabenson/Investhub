'use client'

import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WalletCardProps {
  balance: number
  currency?: string
  onDeposit?: () => void
  onTransfer?: () => void
  onWithdraw?: () => void
}

export function WalletCard({ balance, currency = 'KES', onDeposit, onTransfer, onWithdraw }: WalletCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="relative overflow-hidden card-premium bg-gradient-bineo aspect-[1.6/1] md:aspect-auto md:h-64 flex flex-col justify-between group shadow-[0_20px_40px_rgba(245,158,11,0.2)] border-white/10 transition-transform duration-500 hover:scale-[1.01]">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            GLOBAL TREASURY BALANCE
            <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white transition-colors">
              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </p>
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white">
            {showBalance ? `KES ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </h2>
        </div>
        <div className="p-2 glass border-white/20 rounded-full">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
            <span className="text-primary font-black text-xs">IH</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-3 mt-6">
        <Button 
          variant="outline" 
          className="flex-1 glass border-white/20 text-white hover:bg-white/10 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest"
          onClick={onDeposit}
        >
          <Plus className="w-4 h-4 mr-2" /> Deposit
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 glass border-white/20 text-white hover:bg-white/10 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest"
          onClick={onWithdraw}
        >
          <ArrowDownLeft className="w-4 h-4 mr-2" /> Withdraw
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 glass border-white/20 text-white hover:bg-white/10 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest"
          onClick={onTransfer}
        >
          <ArrowUpRight className="w-4 h-4 mr-2" /> Transfer
        </Button>
      </div>

      <div className="relative z-10 flex justify-between items-center mt-4">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-slate-800 overflow-hidden shadow-lg">
               <div className="w-full h-full bg-linear-to-br from-slate-400 to-slate-600" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/20 flex items-center justify-center text-[8px] font-black text-white shadow-lg">
            +12
          </div>
        </div>
        <p className="text-white/60 text-[9px] font-black tracking-[0.3em] uppercase">
          SECURE QUANTUM ENCRYTION
        </p>
      </div>
    </div>
  )
}
