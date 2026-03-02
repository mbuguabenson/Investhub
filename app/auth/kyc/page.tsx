'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { updateUserProfile } from '@/lib/db'

export default function KYCPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    idType: 'national_id',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: 'Kenya',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/signup')
        return
      }

      setUserId(user.id)
    }

    checkUser()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userId) {
      setError('User not found')
      return
    }

    setLoading(true)

    try {
      const updated = await updateUserProfile(userId, {
        id_type: formData.idType,
        id_number: formData.idNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        kyc_status: 'pending',
        kyc_submitted_at: new Date().toISOString(),
      } as any)

      if (!updated) {
        setError('Failed to update KYC information')
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-slate-400">
              Please provide your KYC information to verify your identity
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="idType" className="text-slate-200">
                ID Type
              </Label>
              <select
                id="idType"
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-md"
              >
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
              </select>
            </div>

            <div>
              <Label htmlFor="idNumber" className="text-slate-200">
                ID Number
              </Label>
              <Input
                id="idNumber"
                name="idNumber"
                type="text"
                placeholder="12345678"
                value={formData.idNumber}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-slate-200">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-slate-200">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-slate-200">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Nairobi"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-slate-200">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Kenya"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
