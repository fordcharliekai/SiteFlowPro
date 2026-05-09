import React from 'react';
import { createClient } from '@/utils/supabase/server';
import ClaimButton from './ClaimButton';

export default async function PublicLeadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">Business not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <nav className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">{lead.business_name}</div>
        <div className="text-sm text-gray-500 hidden md:block">{lead.address}</div>
      </nav>

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Professional Services in {lead.city || 'your area'}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            High-quality workmanship and reliable service for all your business needs. 
            Contact us today to find out how we can help you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-50 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
            <div className="space-y-4">
              <p className="flex items-center text-gray-700">
                <span className="font-bold w-20">Phone:</span> {lead.phone || 'TBC'}
              </p>
              <p className="flex items-center text-gray-700">
                <span className="font-bold w-20">Email:</span> {lead.email || 'TBC'}
              </p>
              <p className="flex items-start text-gray-700">
                <span className="font-bold w-20">Address:</span> 
                <span className="flex-1">{lead.address || 'Local Service'}</span>
              </p>
            </div>
          </div>
          
          <div className="bg-blue-600 p-8 rounded-3xl text-white flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Claim This Website</h2>
            <p className="mb-8 text-blue-100">
              Get this professional one-page website live on your own domain for just £49/month. 
              Increase your visibility and attract more customers.
            </p>
            <ClaimButton leadId={lead.id} slug={slug} />
          </div>
        </div>

        <section className="border-t border-gray-100 pt-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="font-bold mb-2">Reliability</h3>
              <p className="text-gray-600 text-sm">We show up on time and deliver what we promise, every single time.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="font-bold mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">Only the best materials and techniques for our valued clients.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="font-bold mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">Transparent pricing and honest advice for every project.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-50">
        &copy; 2026 {lead.business_name}. Powered by SiteFlowPro.
      </footer>
    </div>
  );
}
