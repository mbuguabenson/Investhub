import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Store webhook data for processing
    const { error } = await supabase.from('payment_webhooks').insert({
      pesapal_reference: body.pesapal_reference_id || body.OrderTrackingId,
      webhook_data: body,
      processed: false,
    })

    if (error) {
      console.error('Error storing webhook:', error)
      return NextResponse.json(
        { error: 'Failed to store webhook' },
        { status: 500 }
      )
    }

    // TODO: Process payment based on webhook data
    // - Update transaction status
    // - Update investment status if needed
    // - Update user account balance

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
