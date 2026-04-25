'use client';

import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

let recaptchaVerifier: RecaptchaVerifier;

export const setupRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  }
};

export const sendOTP = async (phone: string) => {
  setupRecaptcha();
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phone,
    recaptchaVerifier,
  );

  (window as any).confirmationResult = confirmationResult;
};

export const verifyOTP = async (otp: string) => {
  const result = await (window as any).confirmationResult.confirm(otp);
  return result.user;
};
