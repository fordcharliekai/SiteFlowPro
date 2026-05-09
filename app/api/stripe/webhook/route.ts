import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27-acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const leadId = session.metadata?.leadId;
      
      if (leadId) {
        const { error } = await supabase
          .from('leads')
          .update({ 
            website_status: 'live',
            subscription_status: 'active',
            stripe_checkout_id: session.id 
          })
          .eq('id', leadId);
        
        if (error) console.error('Error updating lead after checkout:', error);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      // You might want to update status based on subscription.status
      // For this MVP, we assume active if it's updated and not trialing/past_due etc.
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      // Find lead by stripe_customer_id or metadata and mark as inactive
      const { error } = await supabase
        .from('leads')
        .update({ subscription_status: 'inactive' })
        .eq('stripe_checkout_id', subscription.id); // Or search by customer id if stored
        
      if (error) console.error('Error updating lead after subscription deletion:', error);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
