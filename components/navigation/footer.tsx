'use client'

import Link from 'next/link'
import { Instagram, Twitter, Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/20 py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-bineo rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl italic">I</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground italic">InvestHub</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The future of digital investment. Secure, transparent, and built for your financial freedom.
          </p>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all group border border-border/20">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all group border border-border/20">
              <Instagram size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all group border border-border/20">
              <Linkedin size={18} />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Company</h4>
          <ul className="space-y-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Invest Blog</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Legal</h4>
           <ul className="space-y-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/compliance" className="hover:text-primary transition-colors">Compliance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Newsletter</h4>
          <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-widest">GET THE LATEST UPDATES</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.COM" 
              className="w-full bg-muted/50 border border-border/20 rounded-xl h-12 px-4 text-xs font-bold text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors" 
            />
            <button className="absolute right-2 top-2 h-8 px-4 bg-primary text-primary-foreground text-[10px] font-black rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity">
              JOIN
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 text-center md:text-left">
          &copy; 2024 INVESTHUB TECHNOLOGY LLC. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          <span>SECURED BY SSL</span>
          <span>INSURED BY FDIC</span>
        </div>
      </div>
    </footer>
  )
}
