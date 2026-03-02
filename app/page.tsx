'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  Zap, 
  Target, 
  ShieldCheck, 
  Star, 
  BrainCircuit, 
  Globe, 
  ChevronRight, 
  Check 
} from 'lucide-react'
import { Header } from '@/components/navigation/header'
import { Footer } from '@/components/navigation/footer'
import { ThemeToggle } from '@/components/navigation/theme-toggle'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Header />

      <main>
        {/* Modern Hero Section */}
        <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] -ml-64 -mb-32 animate-pulse" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="flex flex-col items-center md:items-start space-y-8 max-w-2xl px-4 md:px-0">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Institutional Access Available</span>
               </div>
               
               <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] italic text-foreground text-center md:text-left">
                  WEALTH <br /> <span className="text-gradient-bineo">SIMPLIFIED.</span>
               </h1>
               
               <p className="text-sm md:text-lg font-bold text-muted-foreground max-w-lg leading-relaxed text-center md:text-left">
                  Experience institutional-grade investment management with InvestHub. Premium assets, transparent growth, and absolute security for your digital future.
               </p>

               <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-bineo text-white font-bold h-16 px-10 rounded-2xl text-lg hover:opacity-90 transition-all shadow-xl active:scale-95 group">
                      Get Started Now
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="glass border-white/5 text-white font-bold h-16 px-10 rounded-2xl text-lg hover:bg-white/10 transition-all">
                    View Performance
                  </Button>
               </div>

               <div className="pt-8 flex items-center justify-center md:justify-start gap-8 opacity-60">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-foreground">24k+</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Active Users</span>
                  </div>
                  <div className="h-8 w-px bg-border/20" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-foreground">KES 1.2b</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">AUM</span>
                  </div>
                  <div className="h-8 w-px bg-border/20" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-foreground">15%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Avg daily ROI</span>
                  </div>
               </div>
            </div>

            <div className="hidden lg:block relative animate-in fade-in zoom-in duration-1000 delay-300">
               <div className="relative z-10 p-2 glass rounded-[3rem] border-white/5 shadow-2xl overflow-hidden scale-110 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <div className="bg-[#121212] rounded-[2.8rem] aspect-4/5 overflow-hidden p-8 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-gradient-bineo rounded-2xl flex items-center justify-center shadow-lg">
                           <Zap size={32} />
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global Balance</p>
                           <p className="text-2xl md:text-3xl font-black mt-1 uppercase text-foreground">KES 42,982.00</p>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="p-6 bg-card rounded-[2rem] border border-border/20">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Live Investment Profit</p>
                           <div className="flex justify-between items-end pb-4 border-b border-border/20">
                              <span className="text-2xl font-black text-emerald-500">+KES 1,542.45</span>
                              <div className="flex -space-x-3">
                                 {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card shadow-xl" />
                                 ))}
                              </div>
                           </div>
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-4">Growth rate: 12.5% monthly</p>
                        </div>
                        
                        <div className="flex gap-4">
                           <div className="flex-1 h-32 bg-muted/50 rounded-[2rem] border border-border/10 flex flex-col items-center justify-center gap-2 shadow-inner">
                              <span className="text-2xl font-black italic tracking-tighter text-foreground">12.5%</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Goals</span>
                           </div>
                           <div className="flex-1 h-32 bg-gradient-bineo rounded-[2rem] flex flex-col items-center justify-center gap-2">
                              <ShieldCheck size={24} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Secured</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-[100px] -z-10" />
               <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/30 rounded-full blur-[100px] -z-10" />
            </div>
          </div>
        </section>

        {/* Dynamic Why Us Section */}
        <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Empowering your <span className="text-gradient-bineo">Future</span>.</h2>
             <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">WHY THOUSANDS OF INVESTORS CHOOSE INVESTHUB</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            { 
              title: "AI STRATEGIES", 
              desc: "Deep-learning algorithms that analyze market trends 24/7 to find profitable opportunities.",
              icon: BrainCircuit,
              color: "text-primary bg-primary/10"
            },
            { 
              title: "GLOBAL ACCESS", 
              desc: "Invest in international stocks, crypto, and local markets from a single premium dashboard.",
              icon: Globe,
              color: "text-purple-500 bg-purple-500/10"
            },
            { 
              title: "BANK-GRADE SECURITY", 
              desc: "Your assets are protected by multi-signature vaults and end-to-end encryption.",
              icon: ShieldCheck,
              color: "text-emerald-500 bg-emerald-500/10"
            }
          ].map((feature, i) => (
            <div key={i} className="card-premium group hover:scale-[1.02] transition-all duration-500 border border-border/10 shadow-sm p-10">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-inner", feature.color)}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-black italic mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                {feature.desc}
              </p>
                <div className="mt-8 pt-8 border-t border-border/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                LEARN MORE <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get Started Steps Section */}
      <section className="px-6 py-24 md:py-32 bg-primary/5 border-y border-border/10">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">EASY ONBOARDING</p>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-foreground uppercase">GET STARTED IN 3 SIMPLE STEPS</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "SIGNUP", desc: "Create your premium account in less than 60 seconds." },
            { step: "02", title: "DEPOSIT", desc: "Instantly fund your wallet via M-Pesa or Bank Transfer." },
            { step: "03", title: "INVEST", desc: "Choose a strategy and watch your capital grow daily." },
            { step: "04", title: "WITHDRAW", desc: "Access your profits instantly with $0 hidden fees." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="p-8 rounded-[40px] bg-card border border-border/10 shadow-xl hover:scale-[1.05] transition-all duration-500">
                <div className="text-6xl font-black text-primary/10 italic tracking-tighter mb-4 group-hover:text-primary/20 transition-colors">{item.step}</div>
                <h3 className="text-2xl font-black italic tracking-tighter text-foreground mb-4 uppercase">{item.title}</h3>
                <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">{item.desc}</p>
              </div>
              {i < 3 && <div className="hidden md:block absolute top-[40%] -right-4 w-8 h-px bg-border/20 z-0" />}
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section className="px-6 py-24 md:py-32 bg-muted/30 border-y border-border/10">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-foreground uppercase">INVESTMENT TIERS</h2>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">TAILORED STRATEGIES FOR EVERY CAPITAL SIZE</p>
        </div>
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                <div className="space-y-4 max-w-xl text-center md:text-left">
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-foreground italic">
              Premium <span className="text-gradient-bineo">Investment Plans</span>
            </h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.2em]">Select a strategy that matches your wealth goals.</p>
                </div>
                <div className="px-6 py-3 glass rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">
                   Updated live: 2 mins ago
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Micro Strategy', min: 'KES 1,000', roi: '2%', duration: '24 Hours', desc: 'Perfect for beginners. Institutional-grade yields with daily liquidity.' },
                { name: 'Alpha Growth', min: 'KES 5,000', roi: '5%', duration: '7 Days', desc: 'Balanced growth with higher compounding power and mid-term stability.', popular: true },
                { name: 'Institutional', min: 'KES 50,000', roi: '8%', duration: '30 Days', desc: 'Maximum leverage for serious capital deployment and priority execution.' }
              ].map((plan, i) => (
                <div key={i} className={cn(
                  "card-premium p-10 relative group hover:-translate-y-2 transition-all duration-500",
                  plan.popular ? "bg-gradient-bineo border-none" : "border-white/5"
                )}>
                  {plan.popular && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-white text-primary px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                       Most Popular
                    </div>
                  )}
                  <div className="space-y-8">
                     <div className="flex justify-between items-start">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">{plan.name}</h4>
                        <div className={cn(
                           "px-4 py-1.5 rounded-xl text-xs font-black italic",
                           plan.popular ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        )}>
                          ROI {plan.roi}
                        </div>
                     </div>
                     
                     <div className="space-y-2 font-black italic">
                        <p className={cn("text-[10px] uppercase tracking-widest", plan.popular ? "text-white/60" : "text-white/40")}>Starting from</p>
                        <p className="text-5xl">{plan.min}</p>
                     </div>

                     <p className={cn("text-sm font-medium leading-relaxed", plan.popular ? "text-white/80" : "text-white/40")}>
                        {plan.desc}
                     </p>

                     <div className="pt-8 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                           <span>Maturity period</span>
                           <span>{plan.duration}</span>
                        </div>
                        <Link href="/auth/signup" className="block">
                           <Button className={cn(
                             "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95",
                             plan.popular ? "bg-white text-primary hover:bg-white/90 shadow-2xl" : "bg-white/5 text-white hover:bg-white/10"
                           )}>
                             Choose Plan
                           </Button>
                        </Link>
                     </div>
                  </div>
                </div>
              ))}
             </div>
          </div>
        </section>

        {/* Interactive CTA Section */}
        <section className="px-6 py-24 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10" />
          <div className="max-w-4xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
                Ready for <span className="text-gradient-bineo">Financial</span> Freedom?
             </h2>
             <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px] leading-relaxed">
                Join our elite community of over 24,000 active investors and start building your legacy today.
             </p>
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/signup">
                  <Button className="bg-gradient-bineo text-white font-black h-20 px-16 rounded-[2rem] text-xl hover:opacity-90 transition-all shadow-[0_20px_50px_rgba(245,158,11,0.3)] active:scale-95 active:shadow-none uppercase tracking-widest">
                    Open Your Account
                  </Button>
                </Link>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">NO CREDIT CARD REQUIRED • SECURE ENCRYPTION • 24/7 SUPPORT</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
