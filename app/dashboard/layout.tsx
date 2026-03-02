import { Sidebar } from '@/components/navigation/sidebar'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { TopBar } from '@/components/navigation/top-bar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10 pb-32 md:pb-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  )
}
