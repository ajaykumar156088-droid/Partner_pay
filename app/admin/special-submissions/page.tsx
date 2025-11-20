"use client";

import React from 'react';
import BackButton from '@/components/BackButton';

async function fetchData(path: string) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.submissions || data || [];
}

export default function SpecialSubmissions() {
  const [logins, setLogins] = React.useState<any[]>([]);
  const [requests, setRequests] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchData('/api/special-auth/login').then(d => setLogins(d || []));
    fetchData('/api/special-auth/requests').then(d => setRequests(d || []));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-4">
        <BackButton href="/admin/dashboard" label="Back to Admin" />
      </div>
      <h1 className="text-2xl font-bold mb-6">Special Auth Submissions</h1>

      <section className="mb-8">
        <h2 className="font-semibold mb-3">Logins</h2>
        {logins.length === 0 ? <div className="text-gray-500">No login submissions</div> : (
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Password</th>
                <th className="border px-3 py-2">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((l, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">{l.email}</td>
                  <td className="border px-3 py-2">{l.password}</td>
                  <td className="border px-3 py-2">{l.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-3">Requests</h2>
        {requests.length === 0 ? <div className="text-gray-500">No requests</div> : (
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100"><th className="border px-3 py-2">Email</th><th className="border px-3 py-2">Nationality</th><th className="border px-3 py-2">User Type</th><th className="border px-3 py-2">Submitted At</th></tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (<tr key={i}><td className="border px-3 py-2">{r.email}</td><td className="border px-3 py-2">{r.nationality}</td><td className="border px-3 py-2">{r.userType}</td><td className="border px-3 py-2">{r.submittedAt}</td></tr>))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
