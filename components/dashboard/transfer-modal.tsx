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
import { 
  User, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'recipient' | 'amount' | 'success'

interface Recipient {
  id: string
  name: string
  email: string
  avatar: string
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [step, setStep] = useState<Step>('recipient')
  const [recipient, setRecipient] = useState<Recipient | null>(null)
  const [amount, setAmount] = useState('')
  const [search, setSearch] = useState('')

  const recipients: Recipient[] = [
    { id: '1', name: 'Maria Garcia', email: 'maria@example.com', avatar: 'MG' },
    { id: '2', name: 'James Wilson', email: 'james@example.com', avatar: 'JW' },
    { id: '3', name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC' },
  ]

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleRecipientSelect = (r: Recipient) => {
    setRecipient(r)
    setStep('amount')
  }

  const handleTransfer = () => {
    setStep('success')
  }

  const resetAndClose = () => {
    setStep('recipient')
    setRecipient(null)
    setAmount('')
    setSearch('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 border-none bg-[#121212] overflow-hidden rounded-[32px]">
        <div className="p-8">
          {step !== 'success' && (
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold">Transfer Money</DialogTitle>
              <DialogDescription className="text-white/40">Send funds to another InvestHub user instantly.</DialogDescription>
            </DialogHeader>
          )}

          {step === 'recipient' && (
            <div className="space-y-6">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-white/40 px-1 uppercase tracking-wider">Recent Recipients</Label>
                <div className="grid gap-2">
                  {filteredRecipients.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRecipientSelect(r)}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center font-bold text-white shadow-lg">
                        {r.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{r.name}</p>
                        <p className="text-xs text-white/40">{r.email}</p>
                      </div>
                      <ArrowRight size={18} className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'amount' && recipient && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-purple flex items-center justify-center font-bold text-xl text-white">
                  {recipient.avatar}
                </div>
                <div>
                  <p className="text-white/40 text-xs">SENDING TO</p>
                  <p className="font-bold text-lg">{recipient.name}</p>
                </div>
                <button 
                  onClick={() => setStep('recipient')}
                  className="ml-auto text-primary text-xs font-bold hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-white/40 px-1 uppercase tracking-wider text-center block">Amount to Transfer</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/20">KES</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-24 pl-20 pr-6 text-4xl font-bold bg-white/5 border-none rounded-[32px] focus-visible:ring-primary/50 text-center"
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <Button 
                  onClick={handleTransfer}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full h-14 bg-gradient-bineo rounded-2xl font-bold text-white text-lg shadow-[0_8px_25px_rgba(255,165,0,0.3)] transition-transform active:scale-95"
                >
                  Send Money Now
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && recipient && (
            <div className="text-center py-8 space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <Send size={40} className="ml-1" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Transfer Sent!</h2>
                <p className="text-white/40">Successfully sent to <span className="text-white font-bold">{recipient.name}</span></p>
              </div>
              <div className="text-4xl font-bold text-white py-4">
                -KES {parseFloat(amount).toLocaleString()}
              </div>
              <Button 
                onClick={resetAndClose}
                className="w-full h-14 glass text-white rounded-2xl font-bold border-white/10 hover:bg-white/5"
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
