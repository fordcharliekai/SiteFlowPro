import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ClaimButton from './ClaimButton';

export default async function SiteTemplate({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch site and join with lead using lead_id
  const { data: site, error } = await supabase
    .from('sites')
    .select('*, leads:lead_id(*)')
    .eq('slug', slug)
    .single();

  if (error || !site || !site.leads) {
    // Demo fallback for specific slug
    if (slug === 'pimlico-plumbers') {
        return (
          <SiteContent 
            businessName="Pimlico Plumbers (Demo)" 
            services={['Emergency Repairs', 'Boiler Installation', 'Leak Detection']} 
            slug={slug}
            leadId="demo-id"
          />
        );
    }
    console.error('Error fetching site:', error);
    return notFound();
  }

  const businessName = site.leads.business_name;
  const services = (site.content as any)?.services || ['Professional Services', 'Expert Consultation', 'Quality Workmanship'];

  return (
    <SiteContent 
      businessName={businessName} 
      services={services} 
      slug={slug}
      leadId={site.leads.id}
    />
  );
}

function SiteContent({ 
  businessName, 
  services, 
  slug, 
  leadId 
}: { 
  businessName: string, 
  services: string[], 
  slug: string,
  leadId: string
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{businessName}</div>
        <a href="#contact" className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium">Contact Us</a>
      </nav>

      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Reliable Services for {businessName}
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Professional, licensed experts available 24/7. Quality workmanship guaranteed. We pride ourselves on delivering top-notch results for the local community.
        </p>
        <a href="#contact" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
          Get a Free Quote
        </a>
      </section>

      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">{service}</h3>
              <p className="text-gray-600">Premium service delivered by local experts with years of experience.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-center text-white px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Claim this website for your business</h2>
          <p className="mb-8 text-blue-100 opacity-90 text-lg">
            This is a draft version created by SiteFlowPro. Claim it for just £49/month to go live on your own domain and start attracting more customers today.
          </p>
          <ClaimButton leadId={leadId} slug={slug} />
        </div>
      </section>

      <footer id="contact" className="py-20 text-center bg-gray-900 text-white px-6">
        <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Contact {businessName}</h2>
            <p className="mb-8 text-gray-400">Ready to get started? Send us a message and we'll get back to you as soon as possible.</p>
            <div className="bg-white/10 p-1 rounded-full flex max-w-md mx-auto">
                <input type="email" placeholder="Your Email" className="bg-transparent flex-1 px-4 py-2 outline-none" />
                <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold">Send</button>
            </div>
        </div>
        <div className="mt-20 text-gray-500 text-sm">
            &copy; 2026 {businessName}. Powered by SiteFlowPro.
        </div>
      </footer>
    </div>
  );
}
