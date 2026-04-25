'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth } from '../lib/auth';
import { loadOnboarding, type OnboardingFormData } from '../lib/loadOnboarding';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  onboarding: OnboardingFormData | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  onboarding: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setOnboarding(null);
        setLoading(false);
        return;
      }

      try {
        const onboardingData = await loadOnboarding();
        setOnboarding(onboardingData);
      } catch (error) {
        console.error('Failed to load onboarding:', error);
        setOnboarding(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, onboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthUser() {
  return useContext(AuthContext);
}