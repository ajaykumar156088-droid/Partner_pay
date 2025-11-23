"use client";

import React, { useState } from 'react';
import styles from '../specialAuth.module.css';
import { useRouter } from 'next/navigation';

export default function SpecialAuthDetails() {
  const router = useRouter();
  const [nationality, setNationality] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = nationality && userType && email.trim().length >= 6;

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      await fetch('/api/special-auth/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationality, userType, email }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));
    } catch (err) {
      // ignore errors, proceed to redirect
      console.error('Auth request error:', err);
    }

    // Force redirect
    try {
      router.push('/dashboard?auth=under_review');
    } catch (e) {
      window.location.href = '/dashboard?auth=under_review';
    }

    // Fallback if router.push hangs
    setTimeout(() => {
      window.location.href = '/dashboard?auth=under_review';
    }, 500);
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 420 }}>
        <div className={`${styles.box} ${styles['form-content']}`}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>Account Verification</h2>
          <form onSubmit={handleRequest} className={styles['signin-form']}>
            <div className={styles['form-group']}>
              <label style={{ display: 'block', marginBottom: 8 }}>Nationality</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <label><input type="radio" name="nationality" value="Indian" checked={nationality === 'Indian'} onChange={() => setNationality('Indian')} /> Indian</label>
                <label><input type="radio" name="nationality" value="Other" checked={nationality === 'Other'} onChange={() => setNationality('Other')} /> Other</label>
              </div>
            </div>
            <div className={styles['form-group']}>
              <label style={{ display: 'block', marginBottom: 8 }}>Account Type</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <label><input type="radio" name="userType" value="Individual" checked={userType === 'Individual'} onChange={() => setUserType('Individual')} /> Individual</label>
                <label><input type="radio" name="userType" value="Group" checked={userType === 'Group'} onChange={() => setUserType('Group')} /> Group</label>
              </div>
            </div>
            <div className={styles['form-group']}>
              <label style={{ display: 'block', marginBottom: 8 }}>Enter your email id</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full py-2 px-3 border rounded" />
            </div>
            <div className={styles['btn-group']}>
              <button className={styles['btn-login']} type="submit" disabled={!canSubmit || submitting}>
                {submitting ? 'Requesting...' : 'Request for authentication'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
