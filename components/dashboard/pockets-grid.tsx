'use client'

import { useState, useEffect } from 'react'
import { Plus, Umbrella, Plane, ShieldAlert, Gift, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { getPockets } from '@/lib/db'

const iconMap: Record<string, any> = {
  Plane,
  ShieldAlert,
  Umbrella,
  Gift
}

export function PocketsGrid() {
  const [pockets, setPockets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    async function loadPockets() {
      try {
        const { data: { user } } = await Promise.race([
          supabase.auth.getUser(),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Pockets timeout')), 8000))
        ])

        if (user) {
          setStatus('Loading Assets...')
          const data = await getPockets(user.id)
          setPockets(data || [])
        }
      } catch (e) {
        console.error('Pockets load error:', e)
      } finally {
        setLoading(false)
      }
    }
    loadPockets()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {pockets.map((pocket) => {
        const Icon = iconMap[pocket.icon] || Umbrella
        return (
          <div key={pocket.id} className="card-premium group hover:scale-[1.02] transition-all duration-300">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg", pocket.color || 'bg-primary')}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-1">{pocket.name}</p>
              <p className="text-xl font-black italic tracking-tighter text-foreground">
                KES {Number(pocket.balance).toLocaleString()}
              </p>
            </div>
            {/* Real return data would come from history, placeholder for now is better than mock fixed values */}
            <div className="mt-4 flex items-center text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Active Target
            </div>
          </div>
        )
      })}
      <button className="card-premium border-dashed border-border/20 flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all duration-500 bg-muted/20">
        <div className="w-10 h-10 rounded-2xl bg-muted border border-border/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
          <Plus size={24} />
        </div>
        <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest group-hover:text-primary">New Pocket</p>
      </button>
    </div>
  )
}
