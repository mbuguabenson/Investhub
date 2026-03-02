'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Smartphone, 
  Globe, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const settingsSections = [
    {
      title: 'Security',
      icon: Shield,
      items: [
        { 
          id: '2fa', 
          label: 'Two-Factor Authentication', 
          desc: 'Add an extra layer of security to your account.',
          type: 'toggle',
          value: twoFactorEnabled,
          onChange: setTwoFactorEnabled,
          icon: Smartphone
        },
        { 
          id: 'password', 
          label: 'Change Password', 
          desc: 'Update your login credentials.',
          type: 'link',
          icon: Lock
        },
        { 
          id: 'sessions', 
          label: 'Active Sessions', 
          desc: 'Manage your logged-in devices.',
          type: 'link',
          icon: Globe
        }
      ]
    },
    {
      title: 'Preferences',
      icon: Bell,
      items: [
        { 
          id: 'notifications', 
          label: 'Push Notifications', 
          desc: 'Receive alerts about your transactions.',
          type: 'toggle',
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
          icon: Bell
        },
        { 
          id: 'language', 
          label: 'Language', 
          desc: 'English (United States)',
          type: 'link',
          icon: Globe
        }
      ]
    }
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Manage your account security and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="card-premium border-border/20 p-8 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-purple flex items-center justify-center text-4xl font-black text-white shadow-xl mb-6">
              M
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter text-foreground">Maria Garcia</h3>
            <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">maria@example.com</p>
            <div className="mt-6 px-4 py-1.5 glass border-primary/20 rounded-full flex items-center gap-2">
               <ShieldCheck size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Account</span>
            </div>
            <Button variant="outline" className="w-full mt-8 bg-muted/50 hover:bg-muted border-border/20 text-foreground rounded-xl h-12 text-[10px] font-black uppercase tracking-widest">
               Edit Profile
            </Button>
          </Card>

          <Card className="card-premium border-border/20 p-4 space-y-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
            >
              <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors shadow-sm">
                <LogOut size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {settingsSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-xl font-black italic tracking-tighter text-foreground px-2">{section.title}</h3>
              <Card className="card-premium border-border/20 p-2 shadow-sm">
                <div className="divide-y divide-border/10">
                  {section.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-muted/50 border border-border/20 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shadow-inner">
                        <item.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-foreground">{item.label}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.desc}</p>
                      </div>
                      {item.type === 'toggle' ? (
                        <Switch 
                          checked={item.value as boolean} 
                          onCheckedChange={item.onChange as any}
                          className="data-[state=checked]:bg-primary"
                        />
                      ) : (
                        <ChevronRight size={20} className="text-muted-foreground/20 group-hover:text-foreground transition-colors" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}

          {twoFactorEnabled && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center gap-6 animate-in slide-in-from-right-4 duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
               <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <h4 className="font-black italic tracking-tighter uppercase text-emerald-500">Security enhanced</h4>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-relaxed mt-1">Two-factor authentication is active. We'll use your phone number for important actions.</p>
               </div>
            </div>
          )}
          
          {!twoFactorEnabled && (
            <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-[32px] flex items-center gap-6 animate-in slide-in-from-right-4 duration-500 shadow-[0_10px_30px_rgba(249,115,22,0.1)]">
               <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 shadow-inner">
                  <ShieldAlert size={32} />
               </div>
               <div>
                  <h4 className="font-black italic tracking-tighter uppercase text-orange-500">Action Recommended</h4>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-relaxed mt-1">Enable Two-Factor Authentication to better protect your InvestHub account and funds.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
