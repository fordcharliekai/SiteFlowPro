import React from 'react';
import { LayoutDashboard, Users, Globe, PoundSterling, Power } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Leads Found', value: '124', icon: <Users className="w-5 h-5" /> },
    { label: 'Sites Generated', value: '42', icon: <Globe className="w-5 h-5" /> },
    { label: 'Emails Sent', value: '88', icon: <Power className="w-5 h-5" /> },
    { label: 'Revenue', value: '£2,058', icon: <PoundSterling className="w-5 h-5" /> },
  ];

  const leads = [
    { name: 'Pimlico Plumbers', city: 'London', status: 'Draft Created' },
    { name: 'South London Plumbing', city: 'London', status: 'Email Sent' },
    { name: 'West End Plumbers', city: 'London', status: 'No Email' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SiteFlowPro Admin</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Pause Automation</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center text-gray-500 mb-2">
                {stat.icon}
                <span className="ml-2 text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.city}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{lead.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline text-sm font-medium">View Site</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
