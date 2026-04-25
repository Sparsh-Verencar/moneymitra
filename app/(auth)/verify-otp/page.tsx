'use client';

import { useState } from 'react';
import { verifyOTP } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    await verifyOTP(otp);
    router.push('/onboarding'); // temp
  };

  return (
    <div>
      <input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
