'use client';

import { useState } from 'react';
import { sendOTP } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSend = async () => {
    await sendOTP(phone);
    router.push('/verify-otp');
  };

  return (
    <div>
      <input
        placeholder="+91XXXXXXXXXX"
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSend}>Send OTP</button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
