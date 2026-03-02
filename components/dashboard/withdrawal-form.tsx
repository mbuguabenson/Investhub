'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Investment } from '@/lib/database.types'

interface WithdrawalFormProps {
  investment: Investment
}

export default function WithdrawalForm({ investment }: WithdrawalFormProps) {
  const [amount, setAmount] = useState(investment.amount + investment.accrued_returns)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const maxAmount = investment.amount + investment.accrued_returns

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (amount > maxAmount) {
      setError(`Maximum withdrawal amount is KES ${maxAmount.toLocaleString()}`)
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('User not found')
        return
      }

      // Create withdrawal request
      const { error: dbError } = await supabase.from('withdrawal_requests').insert({
        user_id: user.id,
        investment_id: investment.id,
        amount: amount,
        reason: reason || null,
        status: 'pending',
        requested_at: new Date().toISOString(),
      })

      if (dbError) {
        setError(dbError.message)
        return
      }

      setSuccess(true)
      setAmount(maxAmount)
      setReason('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Withdrawal Request Submitted</h3>
        <p className="text-slate-400 mb-6">Your withdrawal request has been submitted successfully.</p>
        <p className="text-sm text-slate-500">
          You will receive your funds via M-Pesa within 24-48 business hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <Label htmlFor="amount" className="text-slate-200">
          Withdrawal Amount (KES)
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          disabled={loading}
          className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
          step="100"
          max={maxAmount}
          min="0"
        />
        <p className="text-xs text-slate-400 mt-2">
          Maximum available: KES {maxAmount.toLocaleString()}
        </p>
      </div>

      <div>
        <Label htmlFor="reason" className="text-slate-200">
          Reason for Withdrawal (Optional)
        </Label>
        <Textarea
          id="reason"
          placeholder="Tell us why you're withdrawing..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Request Withdrawal'
        )}
      </Button>
    </form>
  )
}
