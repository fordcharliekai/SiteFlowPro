# SiteFlowPro Test Plan

## 1. Unit Testing
- **Lead Discovery**: Verify that the search query correctly filters out businesses with websites.
- **AI Generation**: Test Hugging Face API with various business names to ensure subject lines/intros are professional.
- **Site Template**: Verify the Next.js template renders correctly with dynamic data from Supabase.

## 2. Integration Testing
- **Supabase -> Site**: Ensure that creating a lead in Supabase automatically makes a draft site accessible via a slug.
- **Stripe -> Activation**: Test Stripe webhooks to ensure successful payment moves the site status to 'active'.
- **Brevo Outreach**: Verify emails are sent with the correct personalized content and links.

## 3. End-to-End Workflow
1. Run `find-leads.js`.
2. Check `leads` table for new entries.
3. Check generated site URL (e.g., `siteflow.vercel.app/biz-name`).
4. Manually trigger `outreach.js`.
5. Verify receipt of email.
6. Follow Stripe link, complete mock checkout.
7. Verify site status is 'active' in Supabase.

## 4. Edge Cases
- Business name has special characters.
- No email address found (should mark as 'no-email').
- Hugging Face API timeout (should use fallback template).
- Stripe payment failure/cancellation.
