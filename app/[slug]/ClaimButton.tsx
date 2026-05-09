'use client';

import { useState } from 'react';

export default function ClaimButton({ leadId, slug }: { leadId: string, slug: string }) {
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, slug }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-black shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'CLAIM NOW (£49/mo)'}
    </button>
  );
}
