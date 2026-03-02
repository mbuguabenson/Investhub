'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, Chrome, ShieldCheck, ArrowRight, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from '@/components/ui/input-otp'

const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-url');
};

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured()) {
      setError('Google Auth requires Supabase configuration. Entering Test Mode...')
      setTimeout(() => router.push('/dashboard'), 1500)
      return
    }

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (googleError) throw googleError
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Handle Unconfigured Supabase (Test Mode)
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Simulating login for Test Mode.')
      setTimeout(() => {
        setLoading(false)
        router.push('/dashboard')
      }, 1500)
      return
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        if (loginError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in. Check your inbox for the verification link.')
        } else {
          setError(loginError.message)
        }
        setLoading(false)
        return
      }

      // Check if 2FA is enabled for this user (Mock logic)
      const isTwoFactorEnabled = false

      if (isTwoFactorEnabled) {
        setShowTwoFactor(true)
        setLoading(false)
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    // Mock OTP verification
    if (otp === '123456') {
      router.push('/dashboard')
    } else {
      setError('Invalid verification code. Try 123456 for testing.')
      setLoading(false)
    }
  }

  if (showTwoFactor) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-primary/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
           <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <Card className="card-premium max-w-md w-full text-center space-y-10 p-10 border-border/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-inner">
            <ShieldCheck size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-foreground">Security Check</h2>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-relaxed">
              ENTER THE 6-DIGIT VERIFICATION CODE<br />SENT TO YOUR SECURE DEVICE.
            </p>
          </div>

          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value: string) => setOtp(value)}
            >
              <InputOTPGroup className="gap-3">
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-14 h-18 rounded-2xl bg-muted/50 border-border/20 text-3xl font-black text-primary transition-all data-[active=true]:border-primary/50 data-[active=true]:bg-primary/5"
                  />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator className="text-muted-foreground/20 mx-2" />
              <InputOTPGroup className="gap-3">
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-14 h-18 rounded-2xl bg-muted/50 border-border/20 text-3xl font-black text-primary transition-all data-[active=true]:border-primary/50 data-[active=true]:bg-primary/5"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest leading-tight text-left">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <Button
              className="w-full bg-gradient-bineo rounded-[1.5rem] h-16 font-black uppercase tracking-widest text-xs text-white shadow-[0_20px_40px_rgba(245,158,11,0.2)] active:scale-95 transition-all hover:opacity-90 group"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
            >
              {loading ? (
                 <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                   <span>Unlock Portfolio</span>
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            <button
              className="text-muted-foreground/30 text-[10px] font-black uppercase tracking-widest hover:text-foreground transition-colors"
              onClick={() => {
                setShowTwoFactor(false)
                setError('')
                setOtp('')
              }}
            >
              Return to login portal
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden selection:bg-primary/30">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
         <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-lg space-y-10 relative">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
           <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
             <div className="w-10 h-10 bg-gradient-bineo rounded-xl flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
               <span className="text-white font-black text-xl italic">I</span>
             </div>
             <span className="text-2xl font-black tracking-tighter text-foreground italic">InvestHub</span>
           </Link>
           <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground">Welcome <span className="text-gradient-bineo">Back</span>.</h1>
           <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">SECURE ACCESS TO YOUR DIGITAL PORTFOLIO</p>
        </div>

        <Card className="card-premium p-8 md:p-10 border-border/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Button
            variant="outline"
            className="w-full bg-muted/50 border-border/20 text-foreground font-bold h-14 rounded-2xl mb-8 relative transition-all hover:bg-muted active:scale-95"
            onClick={handleGoogleLogin}
          >
            <Chrome className="w-5 h-5 absolute left-6" />
            <span className="uppercase tracking-widest text-xs font-black">Continue with Google</span>
          </Button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/20" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
              <span className="bg-background px-4 text-muted-foreground/40">Authorized Email Login</span>
            </div>
          </div>

          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex gap-3 italic">
              <Star className="shrink-0 w-5 h-5 text-primary animate-pulse" />
              <p className="text-primary/80 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Running in TEST MODE. Login will bypass server validation.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <Label htmlFor="password" title="Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-left">Password</Label>
                <Link href="/auth/forgot-password" title="Forgot?" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline transition-colors">Forgot Access?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold text-foreground placeholder-muted-foreground/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-bineo hover:opacity-90 text-white font-black h-16 rounded-[1.5rem] mt-10 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(245,158,11,0.2)] group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="uppercase tracking-widest text-xs">Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 uppercase tracking-widest text-xs">
                   <span>Secure Sign In</span>
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest">
            New to the platform?{' '}
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 transition-colors">
              Open secure account
            </Link>
          </p>
        </Card>

         <div className="flex items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">AES-256 Bit Encryption</span>
            </div>
         </div>
      </div>
    </div>
  )
}
