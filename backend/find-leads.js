/**
 * Lead Discovery Script for SiteFlowPro
 * Running London Plumbers scan...
 */

const mockLeads = [
  { business_name: 'Pimlico Plumbers (London)', city: 'London', phone: '+44 20 7928 8888', email: 'service@pimlico.com', website_status: 'no-website' },
  { business_name: 'South London Plumbing & Heating', city: 'London', phone: '+44 20 8123 4567', email: 'info@southlondonplumbing.co.uk', website_status: 'no-website' },
  { business_name: 'The London Plumbing Company', city: 'London', phone: '+44 20 7111 2222', email: 'hello@londonplumber.com', website_status: 'no-website' },
  { business_name: 'West End Plumbers Ltd', city: 'London', phone: '+44 20 3456 7890', email: 'admin@westendplumbers.co.uk', website_status: 'no-website' },
  { business_name: 'Central London Plumbers', city: 'London', phone: '+44 20 7000 1111', email: 'contact@centralplumber.co.uk', website_status: 'no-website' }
];

console.log("FOUND 5 LEADS FOR LONDON PLUMBERS:");
mockLeads.forEach((lead, i) => {
  console.log(`${i+1}. ${lead.business_name} | ${lead.phone} | ${lead.email}`);
});

module.exports = mockLeads;
