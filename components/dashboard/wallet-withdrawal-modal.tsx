'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  CreditCard, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WalletWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  balance: number
  initialPhoneNumber?: string
}

export function WalletWithdrawalModal({ isOpen, onClose, balance, initialPhoneNumber }: WalletWithdrawalModalProps) {
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const withdrawAmount = parseFloat(amount)
    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount')
      setLoading(false)
      return
    }

    if (!phoneNumber) {
      setError('Please enter a mobile number for the withdrawal')
      setLoading(false)
      return
    }

    if (withdrawAmount > balance) {
      setError('Insufficient balance in your wallet.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/payments/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: withdrawAmount, 
          phoneNumber,
          reason 
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Withdrawal failed')

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setAmount('')
    setPhoneNumber('')
    setReason('')
    setSuccess(false)
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 border-none bg-[#121212] overflow-hidden rounded-[32px]">
        <div className="p-8">
          {!success ? (
            <>
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold">Withdraw Funds</DialogTitle>
                <DialogDescription className="text-white/40">Request a withdrawal to your connected M-Pesa account.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleWithdraw} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 animate-in fade-in zoom-in duration-300">
                    <AlertCircle className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-white/40 px-1 uppercase tracking-wider">Amount to Withdraw (KES)</Label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/20">KES</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-20 pl-20 pr-6 text-3xl font-bold bg-white/5 border-none rounded-3xl focus-visible:ring-primary/50"
                    />
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest px-1">
                    Available: KES {balance.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-white/40 px-1 uppercase tracking-wider">Mobile Number (M-Pesa)</Label>
                  <Input
                    type="tel"
                    placeholder="e.g. 2547XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-14 bg-white/5 border-none rounded-2xl focus-visible:ring-primary/50 font-bold"
                  />
                  <p className="text-[10px] text-white/20 italic px-1">Funds will be sent to this number.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-white/40 px-1 uppercase tracking-wider">Reason (Optional)</Label>
                  <Textarea 
                    placeholder="e.g. Taking profits"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="bg-white/5 border-none rounded-2xl focus-visible:ring-primary/50 text-white min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={loading || !amount || !phoneNumber}
                  className="w-full h-14 bg-gradient-bineo rounded-2xl font-bold text-white text-lg shadow-xl active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Request Withdrawal'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Request Received!</h2>
                <p className="text-white/40">Your withdrawal is being processed and will arrive in 24-48 hours.</p>
              </div>
              <div className="text-4xl font-bold text-emerald-400 py-4">
                KES {parseFloat(amount).toLocaleString()}
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
