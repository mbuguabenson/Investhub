'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { ThemeToggle } from './theme-toggle'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-4 left-0 right-0 z-50 transition-all duration-500 px-4",
      scrolled ? "translate-y-0" : "translate-y-2"
    )}>
      <div className={cn(
        "max-w-5xl mx-auto flex items-center justify-between px-2 py-2 rounded-full transition-all duration-500",
        "glass border border-border/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        scrolled ? "bg-card/90" : "bg-card/40"
      )}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 pl-4">
           <div className="w-8 h-8 bg-gradient-bineo rounded-lg flex items-center justify-center shadow-lg">
             <span className="text-white font-black text-lg italic">I</span>
           </div>
           <span className="text-xl font-black tracking-tighter text-foreground italic hidden sm:block">InvestHub</span>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <Link href="/dashboard/exchange" className="hover:text-primary transition-colors">Invest</Link>
           <Link href="/about" className="hover:text-primary transition-colors">About</Link>
           <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
        </nav>

        {/* Actions Area */}
        <div className="flex items-center gap-2 pr-1">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-10 px-4 hidden sm:flex">
              Log In
            </Button>
          </Link>
          <Link href="/auth/signup">
             <Button className="bg-gradient-bineo text-white text-[11px] font-black uppercase tracking-widest h-10 px-6 rounded-full hover:opacity-90 transition-all shadow-lg active:scale-95">
               Get Started
             </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
