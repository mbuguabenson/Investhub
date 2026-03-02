'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  initialPhoneNumber?: string
}

type Step = 'method' | 'amount' | 'confirm' | 'success'
type Method = 'mpesa' | 'card' | 'bank'

export function DepositModal({ isOpen, onClose, initialPhoneNumber }: DepositModalProps) {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method | null>(null)
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMethodSelect = (m: Method) => {
    setMethod(m)
    setStep('amount')
  }

  const handleDeposit = async () => {
    if (!amount || !method) return
    
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/payments/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          method,
          phoneNumber 
        })
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to initiate deposit')
      
      // Pesapal Redirect
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        setStep('success')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setStep('method')
    setMethod(null)
    setAmount('')
    setError('')
    setLoading(false)
    onClose()
  }

  const methods = [
    { id: 'mpesa', name: 'M-Pesa Express', icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 border-none bg-[#121212] overflow-hidden rounded-[32px]">
        <div className="p-8">
          {step !== 'success' && (
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-4">
                {step !== 'method' && (
                  <button 
                    onClick={() => setStep(step === 'confirm' ? 'amount' : 'method')}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <DialogTitle className="text-2xl font-bold">Deposit Funds</DialogTitle>
                  <DialogDescription className="text-white/40">Add money to your investment wallet.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <Label className="text-xs font-bold text-white/40 px-1">SELECT PAYMENT METHOD</Label>
              <div className="grid gap-3">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleMethodSelect(m.id as Method)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", m.bg, m.color)}>
                        <m.icon size={24} />
                      </div>
                      <span className="font-bold text-lg">{m.name}</span>
                    </div>
                    <ChevronRight size={20} className="text-white/20 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'amount' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold text-white/40 px-1">ENTER AMOUNT</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-white/20">KES</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-20 pl-12 pr-6 text-4xl font-bold bg-white/5 border-none rounded-3xl focus-visible:ring-primary/50"
                  />
                </div>
                <div className="flex gap-2">
                  {[50, 100, 500, 1000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-bold hover:border-primary/50 transition-all"
                    >
                      +KES {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-white/40 px-1 uppercase tracking-wider">Mobile Number to Use</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">
                    <Smartphone size={20} />
                  </span>
                  <Input
                    type="tel"
                    placeholder="e.g. 2547XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-14 pl-14 bg-white/5 border-none rounded-2xl focus-visible:ring-primary/50 font-bold"
                  />
                </div>
                <p className="text-[10px] text-white/20 italic px-1">Specify the number where the payment prompt will be sent.</p>
              </div>

              <Button 
                onClick={() => setStep('confirm')}
                disabled={!amount || parseFloat(amount) <= 0 || !phoneNumber}
                className="w-full h-14 bg-gradient-bineo rounded-2xl font-bold text-white text-lg"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-8">
              <div className="rounded-3xl bg-white/5 p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/40">Amount</span>
                  <span className="font-bold">KES {parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Method</span>
                  <span className="font-bold uppercase">{method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Phone Number</span>
                  <span className="font-bold">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Fee</span>
                  <span className="font-bold text-emerald-400">Free</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between">
                  <span className="text-white/60 font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">KES {parseFloat(amount).toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={handleDeposit}
                disabled={loading}
                className="w-full h-14 bg-gradient-bineo rounded-2xl font-bold text-white text-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Deposit'}
              </Button>
               {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 animate-in fade-in zoom-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Deposit Successful!</h2>
                <p className="text-white/40">Your balance has been updated instantly.</p>
              </div>
              <div className="text-4xl font-bold text-emerald-400 py-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                +KES {parseFloat(amount).toLocaleString()}
              </div>
              <Button 
                onClick={resetAndClose}
                className="w-full h-14 glass text-white rounded-2xl font-bold border-white/10 hover:bg-white/5"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
