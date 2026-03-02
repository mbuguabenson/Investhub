'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TrendingUp, Zap, Clock, Target, ArrowRight } from 'lucide-react'
import type { InvestmentPlan } from '@/lib/database.types'
import InvestmentForm from './investment-form'
import { cn } from '@/lib/utils'

interface InvestmentPlansGridProps {
  plans: InvestmentPlan[]
}

export default function InvestmentPlansGrid({ plans }: InvestmentPlansGridProps) {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan, i) => (
        <Card 
          key={plan.id} 
          className={cn(
            "card-premium border-none relative overflow-hidden group hover:scale-[1.02] transition-all duration-500",
            i === 1 ? "bg-gradient-bineo" : ""
          )}
        >
          {i === 1 && (
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-[0.2em] backdrop-blur-md shadow-sm border border-white/10">
              Most Popular
            </div>
          )}
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                i === 1 ? "bg-white text-primary" : "bg-muted/50 border border-border/20 text-primary shadow-inner"
              )}>
                <Zap size={28} />
              </div>
              <div className="text-right">
                <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", i === 1 ? "text-white/60" : "text-muted-foreground/40")}>Daily ROI</p>
                <p className={cn("text-3xl font-black italic tracking-tighter mt-1", i === 1 ? "text-white" : "text-foreground")}>{plan.daily_return_rate}%</p>
              </div>
            </div>

            <div>
              <h3 className={cn("text-2xl font-black italic tracking-tighter uppercase", i === 1 ? "text-white" : "text-foreground")}>{plan.name}</h3>
              <p className={cn("text-[10px] font-black uppercase tracking-widest leading-relaxed mt-4 line-clamp-2", i === 1 ? "text-white/80" : "text-muted-foreground/60")}>
                {plan.description || "Grow your wealth with our premium investment strategy."}
              </p>
            </div>

            <div className={cn("space-y-4 pt-6 border-t", i === 1 ? "border-white/10" : "border-border/10")}>
              <div className="flex justify-between items-center">
                <div className={cn("flex items-center gap-2 text-[8px] font-black uppercase tracking-widest", i === 1 ? "text-white/60" : "text-muted-foreground/60")}>
                  <Target size={14} />
                  <span>Min. Deposit</span>
                </div>
                <span className={cn("font-black italic tracking-tighter text-sm", i === 1 ? "text-white" : "text-foreground")}>KES {plan.minimum_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className={cn("flex items-center gap-2 text-[8px] font-black uppercase tracking-widest", i === 1 ? "text-white/60" : "text-muted-foreground/60")}>
                  <Clock size={14} />
                  <span>Duration</span>
                </div>
                <span className={cn("font-black italic tracking-tighter text-sm", i === 1 ? "text-white" : "text-foreground")}>{plan.maturity_days} Days</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 group/btn shadow-lg",
                    i === 1 
                      ? "bg-white text-primary hover:bg-white/90 shadow-white/10" 
                      : "bg-primary text-white hover:opacity-90 shadow-primary/20"
                  )}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Invest Now
                  <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border/20 text-foreground max-w-md p-0 overflow-hidden rounded-[32px] shadow-2xl">
                <div className="p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-center">Invest in {plan.name}</DialogTitle>
                  </DialogHeader>
                  {selectedPlan && <InvestmentForm plan={selectedPlan} />}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      ))}
    </div>
  )
}
