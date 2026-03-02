import { Card } from '@/components/ui/card'
import { Wallet, TrendingUp, DollarSign } from 'lucide-react'
import type { UserProfile, Investment } from '@/lib/database.types'

interface PortfolioStatsProps {
  profile: UserProfile | null
  investments: Investment[]
}

export default function PortfolioStats({ profile, investments }: PortfolioStatsProps) {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturns = investments.reduce((sum, inv) => sum + inv.accrued_returns, 0)
  const accountBalance = profile?.account_balance || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Account Balance</p>
            <p className="text-3xl font-bold text-white mt-2">KES {accountBalance.toLocaleString()}</p>
          </div>
          <Wallet className="w-12 h-12 text-emerald-400 opacity-20" />
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Invested</p>
            <p className="text-3xl font-bold text-white mt-2">KES {totalInvested.toLocaleString()}</p>
          </div>
          <DollarSign className="w-12 h-12 text-blue-400 opacity-20" />
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Returns</p>
            <p className="text-3xl font-bold text-white mt-2">KES {totalReturns.toLocaleString()}</p>
          </div>
          <TrendingUp className="w-12 h-12 text-purple-400 opacity-20" />
        </div>
      </Card>
    </div>
  )
}
