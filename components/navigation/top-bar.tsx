'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, User, Wallet, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabase'
import { getUserProfile } from '@/lib/db'
import type { UserProfile } from '@/lib/database.types'

export function TopBar() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getUserProfile(user.id)
        setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
    
    // Listen for balance updates if needed (simplified for now)
  }, [])

  return (
    <header className="sticky top-0 z-30 w-full bg-background/60 backdrop-blur-xl border-b border-border/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative group hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="w-full h-10 pl-10 pr-4 bg-muted/40 border border-border/10 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Balance Display */}
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 px-4 py-2 rounded-2xl shadow-sm">
            <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Wallet size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">Available Balance</span>
              <span className="text-sm font-black italic tracking-tighter text-foreground leading-none">
                KES {profile?.account_balance?.toLocaleString() || '0.00'}
              </span>
            </div>
            <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-primary/20 transition-colors ml-1">
                <ChevronDown size={14} className="text-primary" />
            </Button>
          </div>

          <div className="h-8 w-px bg-border/20 mx-2 hidden sm:block" />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl border border-border/10 hover:bg-muted group">
            <Bell size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>

          {/* User Profile */}
          <Button variant="ghost" className="flex items-center gap-3 px-2 py-2 h-10 rounded-xl border border-border/10 hover:bg-muted group">
            <div className="w-7 h-7 bg-gradient-bineo rounded-lg flex items-center justify-center text-white ring-2 ring-background border border-white/10 overflow-hidden shadow-lg">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors hidden md:block">
                {profile?.full_name?.split(' ')[0] || 'Member'}
            </span>
            <ChevronDown size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </div>
      </div>
    </header>
  )
}
