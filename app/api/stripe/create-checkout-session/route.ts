import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, slug } = body;

    if (!leadId || !slug) {
      return NextResponse.json({ error: 'Missing leadId or slug' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siteflowpro.vercel.app';

    console.log('Creating Stripe Checkout Session:', {
      leadId,
      slug,
      siteUrl,
      priceId: process.env.STRIPE_PRICE_ID_MONTHLY
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_MONTHLY,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: {
        leadId,
        slug
      },
    });

    if (!session.url) {
      throw new Error('Stripe session creation failed to return a URL');
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout failure:', {
        message: err.message,
        type: err.type,
        stack: err.stack
    });
    return NextResponse.json({ 
        error: err.message,
        type: err.type
    }, { status: 500 });
  }
}
