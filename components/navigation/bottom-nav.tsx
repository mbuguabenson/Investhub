'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from './nav-config'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="glass rounded-full flex items-center justify-around p-2 border border-border/20 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-500",
                isActive ? "text-primary bg-primary/10 shadow-inner" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110")} />
              <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_oklch(0.65_0.25_45)]" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
