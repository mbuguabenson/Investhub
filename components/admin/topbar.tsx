'use client'

import { Search, Bell, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function AdminTopbar() {
  return (
    <header className="h-20 bg-[#0a0c10]/80 backdrop-blur-xl border-b border-[#1e2235] px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm shadow-blue-500/5">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 transition-colors group-focus-within:text-blue-500" />
          <Input 
            placeholder="Search system activities..." 
            className="bg-white/5 border-[#1e2235] rounded-2xl pl-12 h-11 text-[10px] font-bold uppercase tracking-widest focus-visible:ring-blue-500/20 group-hover:bg-white/10 transition-all shadow-inner border-opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 bg-white/5 border border-[#1e2235] rounded-xl hover:bg-white/10 transition-all group group-hover:border-blue-500/20">
          < Bell size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full ring-[3px] ring-[#0a0c10] shadow-glow-blue" />
        </button>

        <div className="flex items-center gap-4 border-l border-[#1e2235] pl-6 ml-2">
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Super Admin</p>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-60">Management Tier</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 border border-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
