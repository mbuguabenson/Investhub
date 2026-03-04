import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminTopbar } from '@/components/admin/topbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-[#07080d] min-h-screen selection:bg-blue-500/30 selection:text-white overflow-hidden uppercase-none">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 p-8 pt-10 overflow-y-auto scrollbar-hide relative">
          {/* Subtle background glow */}
          <div className="fixed top-0 right-0 w-[70vw] h-[70vh] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-[50vw] h-[50vh] bg-indigo-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
