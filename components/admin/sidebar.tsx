'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Payment Control', href: '/admin/payments', icon: CreditCard },
  { name: 'Investment Plans', href: '/admin/plans', icon: Package },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-[#0a0c14] border-r border-[#1e2235] flex flex-col h-screen sticky top-0 shadow-2xl overflow-y-auto scrollbar-hide">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Investhub</span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ml-[-8px] mr-[-8px]",
                  isActive 
                    ? "bg-blue-600/10 text-blue-500 border border-blue-600/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]" 
                    : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3 relative z-10 w-full">
                  <div className={cn(
                    "w-1 h-5 rounded-full absolute -left-4 transition-all duration-300",
                    isActive ? "bg-blue-500" : "bg-transparent"
                  )} />
                  <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-blue-500" : "group-hover:text-white transition-colors")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {!isActive && (
                   <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-[#1e2235]">
        <button className="flex items-center gap-3 px-4 py-3.5 w-full text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300 group">
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-left">Logout Session</span>
        </button>
      </div>
    </aside>
  )
}
