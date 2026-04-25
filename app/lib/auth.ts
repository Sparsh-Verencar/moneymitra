'use client';

import { auth } from './firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = () => {
  if (typeof window === 'undefined') return null;

  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  }

  return recaptchaVerifier;
};

export const sendOTP = async (phone: string) => {
  await setPersistence(auth, browserLocalPersistence);

  const verifier = setupRecaptcha();
  if (!verifier) throw new Error('reCAPTCHA not initialized');

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phone,
    verifier
  );

  (window as any).confirmationResult = confirmationResult;
  return confirmationResult;
};

export const verifyOTP = async (otp: string) => {
  const confirmationResult = (window as any).confirmationResult;

  if (!confirmationResult) {
    throw new Error('OTP session expired. Please request OTP again.');
  }

  const result = await confirmationResult.confirm(otp);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const waitForAuthReady = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};