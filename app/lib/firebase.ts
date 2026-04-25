'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDCLrgo9v3m3WydxLsIyVv1x6LsGlUUTNY',
  authDomain: 'moneymitra-cb728.firebaseapp.com',
  projectId: 'moneymitra-cb728',
  appId: '1:623810447850:web:fc55459c1fade900340a93',
};

// Prevent re-initialization (important in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
