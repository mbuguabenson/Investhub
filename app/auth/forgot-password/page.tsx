'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) throw resetError
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-primary/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
         <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-lg space-y-10 relative">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
           <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
             <div className="w-10 h-10 bg-gradient-bineo rounded-xl flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
               <span className="text-white font-black text-xl italic">I</span>
             </div>
             <span className="text-2xl font-black tracking-tighter text-foreground italic">InvestHub</span>
           </Link>
           <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground">Forgot <span className="text-gradient-bineo">Access</span>?</h1>
           <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">SECURE PASSWORD RECOVERY SYSTEM</p>
        </div>

        <Card className="card-premium p-8 md:p-10 border-border/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {success ? (
            <div className="text-center space-y-8 py-4">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary animate-bounce">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Recovery Sent</h2>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed">
                  We've sent a recovery link to <span className="text-primary">{email}</span>. Click the link in the email to set a new password.
                </p>
              </div>
              <Button asChild className="w-full h-14 rounded-2xl border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 bg-muted/50 text-foreground border">
                <Link href="/auth/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex gap-3 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-red-200 text-xs font-bold uppercase tracking-widest leading-tight">{error}</p>
                </div>
              )}

              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest text-center mb-8 leading-relaxed">
                Enter the email address associated with your account<br />to receive a secure reset link.
              </p>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="INVESTOR@DOMAIN.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold uppercase tracking-widest text-foreground placeholder-muted-foreground/20"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-bineo hover:opacity-90 text-white font-black h-16 rounded-[1.5rem] mt-10 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(245,158,11,0.2)] group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                     <span>Send Recovery Link</span>
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              <p className="mt-8 text-center text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest">
                Remembered your password?{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
