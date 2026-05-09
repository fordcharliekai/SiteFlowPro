import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { sendOutreachEmail } from '@/utils/outreach';

export async function GET(req: Request) {
  // Check for cron secret to prevent unauthorized triggers
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const serpApiKey = process.env.SERPAPI_API_KEY;

    if (!serpApiKey) {
      throw new Error('SERPAPI_API_KEY is missing');
    }

    // 1. Find leads via SerpAPI (Local search)
    // We search for plumbers in London and look for those without a 'website' link
    const query = 'plumbers in London';
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_local&q=${encodeURIComponent(query)}&location=London,United+Kingdom&google_domain=google.co.uk&hl=en&gl=uk&api_key=${serpApiKey}`
    );
    
    const data = await response.json();
    const localResults = data.local_results || [];

    const newLeads = [];
    let count = 0;

    for (const result of localResults) {
      if (count >= 20) break; // Limit to 20 leads per run

      // Check if business has a website in search result
      if (!result.website) {
        const businessName = result.title;
        const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Check if lead already exists
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('slug', slug)
          .single();

        if (!existing) {
          const leadData = {
            business_name: businessName,
            slug: slug,
            phone: result.phone || null,
            address: result.address || null,
            city: 'London',
            website_status: 'no-website',
            email: null // Google Local search doesn't usually provide email directly
          };

          const { data: insertedLead, error: insertError } = await supabase
            .from('leads')
            .insert(leadData)
            .select()
            .single();

          if (!insertError && insertedLead) {
            newLeads.push(insertedLead);
            
            if (insertedLead.email) {
                const emailRes = await sendOutreachEmail(insertedLead);
                if (emailRes.success) {
                    await supabase
                        .from('leads')
                        .update({ website_status: 'contacted' })
                        .eq('id', insertedLead.id);
                }
            } else {
                // Fallback if no email found
                await supabase
                    .from('leads')
                    .update({ website_status: 'no-email' })
                    .eq('id', insertedLead.id);
            }
            
            count++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      leadsFound: count,
      leads: newLeads
    });

  } catch (err: any) {
    console.error('Cron Job Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
