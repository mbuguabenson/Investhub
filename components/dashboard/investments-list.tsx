import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Investment, InvestmentPlan } from '@/lib/database.types'

interface InvestmentsListProps {
  investments: Investment[]
  plans: InvestmentPlan[]
}

export default function InvestmentsList({ investments, plans }: InvestmentsListProps) {
  const getPlanName = (planId: string) => {
    return plans.find((p) => p.id === planId)?.name || 'Unknown Plan'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 text-emerald-900'
      case 'matured':
        return 'bg-blue-500 text-blue-900'
      case 'withdrawn':
        return 'bg-slate-500 text-slate-900'
      default:
        return 'bg-slate-600 text-slate-100'
    }
  }

  const daysRemaining = (maturityDate: string) => {
    const now = new Date()
    const maturity = new Date(maturityDate)
    const diff = Math.ceil((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  return (
    <div className="space-y-4">
      {investments.map((investment) => (
        <Card key={investment.id} className="bg-slate-800 border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <p className="text-slate-400 text-sm">Plan</p>
              <p className="text-white font-semibold mt-1">{getPlanName(investment.plan_id)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Invested Amount</p>
              <p className="text-white font-semibold mt-1">KES {investment.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Accrued Returns</p>
              <p className="text-emerald-400 font-semibold mt-1">
                KES {investment.accrued_returns.toLocaleString()}
              </p>
            </div>
            <div className="flex items-end justify-between md:justify-end gap-3">
              <div className="text-right">
                <p className="text-slate-400 text-sm">Status</p>
                <Badge className={`mt-1 ${getStatusColor(investment.status)}`}>
                  {investment.status}
                </Badge>
              </div>
              {investment.status === 'active' && (
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Days Left</p>
                  <p className="text-white font-semibold text-sm">
                    {daysRemaining(investment.maturity_date)} days
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
