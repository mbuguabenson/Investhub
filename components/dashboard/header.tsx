import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import type { UserProfile } from '@/lib/database.types'

interface DashboardHeaderProps {
  profile: UserProfile | null
  onLogout: () => Promise<void>
}

export default function DashboardHeader({ profile, onLogout }: DashboardHeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <header className="border-b border-slate-700 bg-slate-900 bg-opacity-50 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/dashboard" className="text-2xl font-bold text-emerald-400">
            InvestHub
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/dashboard') ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/transactions">
              <Button
                variant={isActive('/dashboard/transactions') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/dashboard/transactions') ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}
              >
                Transactions
              </Button>
            </Link>
            <Link href="/dashboard/withdrawals">
              <Button
                variant={isActive('/dashboard/withdrawals') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/dashboard/withdrawals') ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}
              >
                Withdrawals
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{profile?.full_name}</p>
              <p className="text-xs text-slate-400">
                {profile?.kyc_status === 'approved' ? 'Verified' : 'Pending Verification'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
