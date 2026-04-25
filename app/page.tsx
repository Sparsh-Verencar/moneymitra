'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/pages/LandingPage';

export default function Home() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/home');
  };

  return <LandingPage />;
}