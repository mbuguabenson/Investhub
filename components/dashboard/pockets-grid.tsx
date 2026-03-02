'use client'

import { Plus, Umbrella, Plane, ShieldAlert, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

const pockets = [
  { name: 'Vacation', balance: 5200, icon: Plane, color: 'bg-blue-500' },
  { name: 'Emergency', balance: 12500, icon: ShieldAlert, color: 'bg-orange-500' },
  { name: 'Savings', balance: 35000, icon: Umbrella, color: 'bg-emerald-500' },
  { name: 'Gifts', balance: 1200, icon: Gift, color: 'bg-purple-500' },
]

export function PocketsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {pockets.map((pocket) => (
        <div key={pocket.name} className="card-premium group hover:scale-[1.02] transition-all duration-300">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-white", pocket.color)}>
            <pocket.icon size={20} />
          </div>
          <div>
            <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-1">{pocket.name}</p>
            <p className="text-xl font-black italic tracking-tighter text-foreground">
              KES {pocket.balance.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 flex items-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            +12% Monthly
          </div>
        </div>
      ))}
      <button className="card-premium border-dashed border-border/20 flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all duration-500 bg-muted/20">
        <div className="w-10 h-10 rounded-2xl bg-muted border border-border/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
          <Plus size={24} />
        </div>
        <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest group-hover:text-primary">New Pocket</p>
      </button>
    </div>
  )
}
