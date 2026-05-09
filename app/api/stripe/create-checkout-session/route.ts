import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27-acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { leadId, slug } = await req.json();

    if (!leadId || !slug) {
      return NextResponse.json({ error: 'Missing leadId or slug' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://siteflowpro.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_MONTHLY,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/${slug}?success=true`,
      cancel_url: `${origin}/${slug}?canceled=true`,
      metadata: {
        leadId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
