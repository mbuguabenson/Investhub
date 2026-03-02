'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, Chrome, ArrowRight, Star, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { createUserProfile, checkAccountExists } from '@/lib/db'

const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-url');
};

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    idNumber: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (googleError) throw googleError
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    // Handle Unconfigured Supabase (Test Mode)
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Simulating signup for Test Mode.')
      setTimeout(() => {
        setLoading(false)
        router.push('/dashboard')
      }, 1500)
      return
    }

    try {
      // Check if account with phone or ID already exists
      const exists = await checkAccountExists(formData.phoneNumber, formData.idNumber)
      if (exists) {
        setError('An account with this Phone Number or ID Number already exists.')
        setLoading(false)
        return
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (!authData.user) {
        setError('Failed to create account')
        return
      }

      // Create user profile
      const profileCreated = await createUserProfile(authData.user.id, {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        id_number: formData.idNumber,
        kyc_status: 'pending',
      } as any)

      if (!profileCreated) {
        setError('Failed to create user profile.')
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-primary/30">
      {/* Decorative Background Elements */}
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
           <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground">Join the <span className="text-gradient-bineo">Future</span>.</h1>
           <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">CREATE YOUR SECURE INVESTMENT ACCOUNT TODAY</p>
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
              <span className="bg-background px-4 text-muted-foreground/40">Secure Email Registration</span>
            </div>
          </div>

          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex gap-3 italic">
              <Star className="shrink-0 w-5 h-5 text-primary animate-pulse" />
              <p className="text-primary/80 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Running in TEST MODE. Signup will bypass server validation.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="YOUR LEGAL NAME"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold uppercase tracking-widest text-foreground placeholder-muted-foreground/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Phone</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold uppercase tracking-widest text-foreground placeholder-muted-foreground/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">ID Number</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  placeholder="KYC ID"
                  value={formData.idNumber}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold uppercase tracking-widest text-foreground placeholder-muted-foreground/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="INVESTOR@DOMAIN.COM"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold uppercase tracking-widest text-foreground placeholder-muted-foreground/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold text-foreground placeholder-muted-foreground/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Confirm</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-muted/50 border-border/20 rounded-2xl h-14 focus:ring-primary/50 text-xs font-bold text-foreground placeholder-muted-foreground/20"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-bineo hover:opacity-90 text-white font-black h-16 rounded-[1.5rem] mt-10 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(245,158,11,0.2)] group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="uppercase tracking-widest text-xs">Processing Authentication...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 uppercase tracking-widest text-xs">
                   <span>Initialize Account</span>
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest">
            Already a member?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors">
              Sign in to platform
            </Link>
          </p>
        </Card>

         <div className="flex items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">SSL Encrypted</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
            <div className="flex items-center gap-2">
              <Star size={14} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">FDIC Insured</span>
            </div>
         </div>
      </div>
    </div>
  )
}
