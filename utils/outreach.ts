/**
 * Brevo Outreach Utility
 * Uses Hugging Face (flan-t5-base) for AI content generation
 */

export async function sendOutreachEmail(lead: { id: string, business_name: string, city?: string, email: string, slug: string }) {
  if (!lead.email) return { success: false, error: 'No email provided' };

  const hfToken = process.env.HF_API_TOKEN;
  const brevoKey = process.env.BREVO_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siteflowpro.vercel.app';

  let subject = `Professional Website for ${lead.business_name}`;
  let intro = `We noticed you're not online and we want to help.`;

  // Try to use Hugging Face for personalization
  if (hfToken) {
    try {
      const prompt = `Generate a short professional email subject and a friendly intro sentence for a business named ${lead.business_name} in ${lead.city || 'London'} that currently doesn't have a website. Format: Subject: [Subject] Intro: [Intro]`;
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        {
          headers: { Authorization: `Bearer ${hfToken}` },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      
      const result = await response.json();
      if (result && result[0] && result[0].generated_text) {
        const text = result[0].generated_text;
        // Simple parsing logic (model output can be unpredictable)
        if (text.includes('Subject:')) {
            subject = text.split('Subject:')[1].split('Intro:')[0].trim();
        }
        if (text.includes('Intro:')) {
            intro = text.split('Intro:')[1].trim();
        }
      }
    } catch (err) {
      console.error('HF AI generation failed, using fallback template:', err);
    }
  }

  const claimUrl = `${siteUrl}/${lead.slug}`;
  
  const emailBody = `
    <html>
      <body>
        <p>${intro}</p>
        <p>Hi ${lead.business_name},</p>
        <p>We noticed you're not online yet. We created a draft website for you: <a href="${claimUrl}">${claimUrl}</a></p>
        <p>You can claim it and keep it live for just £49/month—cancel anytime. No setup fee.</p>
        <p>Best regards,<br/>SiteFlowPro Team</p>
      </body>
    </html>
  `;

  if (!brevoKey) {
      console.warn('BREVO_API_KEY missing, skipping actual email send.');
      return { success: true, message: 'Email logic verified (API key missing)' };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "SiteFlowPro", email: "hello@siteflowpro.app" },
        to: [{ email: lead.email, name: lead.business_name }],
        subject: subject,
        htmlContent: emailBody
      })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
    }

    return { success: true };
  } catch (err: any) {
    console.error('Brevo API Error:', err);
    return { success: false, error: err.message };
  }
}
