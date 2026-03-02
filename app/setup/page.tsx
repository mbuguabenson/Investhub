'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Copy, ExternalLink, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [initLoading, setInitLoading] = useState(false)
  const [initMessage, setInitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleAutoInit = async () => {
    setInitLoading(true)
    setInitMessage(null)

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setInitMessage({
          type: 'success',
          text: 'Database initialized successfully! Redirecting to signup...',
        })
        setTimeout(() => {
          window.location.href = '/auth/signup'
        }, 2000)
      } else {
        setInitMessage({
          type: 'error',
          text: data.message || 'Failed to initialize database',
        })
      }
    } catch (error) {
      setInitMessage({
        type: 'error',
        text: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      })
    } finally {
      setInitLoading(false)
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sqlPath = '/scripts/01-create-schema.sql'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">InvestHub Setup</h1>
          <p className="text-slate-400">Get your database ready in a few minutes</p>
        </div>

        {/* Alert */}
        <Card className="mb-8 border-yellow-600 bg-yellow-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <CardTitle className="text-yellow-400">Database Not Initialized</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-100 mb-4">
              Your Supabase database needs to be initialized with the schema.
            </p>
            <Button
              onClick={handleAutoInit}
              disabled={initLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {initLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                'Auto-Initialize Database'
              )}
            </Button>
            {initMessage && (
              <div className={`mt-3 p-3 rounded text-sm ${
                initMessage.type === 'success'
                  ? 'bg-green-900 text-green-100'
                  : 'bg-red-900 text-red-100'
              }`}>
                {initMessage.text}
              </div>
            )}
            <p className="text-yellow-200 text-sm mt-4">
              Or follow the manual steps below if auto-init fails.
            </p>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
                  1
                </div>
                <CardTitle className="text-white">Open Supabase SQL Editor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Go to your Supabase dashboard and open the SQL Editor:
              </p>
              {supabaseUrl && (
                <a
                  href={`${supabaseUrl}/projects`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Open Supabase Dashboard
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
                  2
                </div>
                <CardTitle className="text-white">Copy Schema SQL</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Copy this SQL and paste it into a new SQL query in Supabase:
              </p>
              <div className="bg-slate-900 p-4 rounded-lg">
                <code className="text-xs text-slate-300 line-clamp-4">
                  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                  <br />
                  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
                  <br />
                  CREATE TABLE user_profiles (...)
                  <br />
                  -- ... and more ...
                </code>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                📄 Full SQL is in: <code className="bg-slate-900 px-2 py-1 rounded">scripts/01-create-schema.sql</code>
              </p>
              <Button
                onClick={() => copyToClipboard('-- Paste the full content of scripts/01-create-schema.sql here', 2)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedIndex === 2 ? 'Copied!' : 'Copy Instructions'}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
                  3
                </div>
                <CardTitle className="text-white">Execute Schema SQL</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>In Supabase SQL Editor, click <code className="bg-slate-900 px-2 py-1 rounded text-xs">+ New Query</code></li>
                <li>Paste the entire content of <code className="bg-slate-900 px-2 py-1 rounded text-xs">scripts/01-create-schema.sql</code></li>
                <li>Click <code className="bg-slate-900 px-2 py-1 rounded text-xs">RUN</code></li>
                <li>Wait for all statements to complete (you should see checkmarks)</li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
                  4
                </div>
                <CardTitle className="text-white">Seed Investment Plans</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>In Supabase SQL Editor, click <code className="bg-slate-900 px-2 py-1 rounded text-xs">+ New Query</code> again</li>
                <li>Paste the entire content of <code className="bg-slate-900 px-2 py-1 rounded text-xs">scripts/02-seed-investment-plans.sql</code></li>
                <li>Click <code className="bg-slate-900 px-2 py-1 rounded text-xs">RUN</code></li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card className="border-emerald-600 bg-emerald-950">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <CardTitle className="text-emerald-400">Done!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-100">
                Once the migrations complete successfully:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-emerald-100">
                <li>Refresh this page or restart your development server</li>
                <li>Go to <a href="/" className="text-emerald-300 hover:text-emerald-200 underline">/</a> to sign up</li>
                <li>Create your account and start investing!</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Need Help?</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-white mb-2">SQL Errors During Execution?</p>
              <p className="text-slate-300 text-sm">
                Errors like "already exists" are normal and can be ignored. As long as you see tables created in your Table Editor, you're good!
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Still Getting Table Not Found Error?</p>
              <p className="text-slate-300 text-sm">
                1. Check Supabase Table Editor and confirm all tables exist
                <br />
                2. Restart your development server
                <br />
                3. Try signing up again
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
