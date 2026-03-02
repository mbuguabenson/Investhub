'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) throw updateError
      
      // Successfully updated
      router.push('/auth/login?message=Password updated successfully')
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
           <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground">Secure <span className="text-gradient-bineo">Reset</span></h1>
           <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">UPDATE YOUR ACCOUNT PASSWORD</p>
        </div>

        <Card className="card-premium p-8 md:p-10 border-border/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex gap-3 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-200 text-xs font-bold uppercase tracking-widest leading-tight">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" title="New Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">New Password</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" title="Confirm Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                   <span>Update Password</span>
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
