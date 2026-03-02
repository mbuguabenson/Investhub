'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from './nav-config'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-background border-r border-border/20 p-6">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-bineo rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-lg italic">I</span>
        </div>
        <h1 className="text-xl font-black italic tracking-tighter text-foreground">InvestHub</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110")} />
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_oklch(0.65_0.25_45)]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/20">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-300 group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  )
}
