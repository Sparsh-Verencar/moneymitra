// lib/loadUserProfile.ts
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  name: string;
  // extend later if needed
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  const user = auth.currentUser;
  if (!user) return null; // or throw, depending on your routing

  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // fallback: if you ever set auth displayName, you can use it
    const fallbackName = user.displayName || '';
    if (!fallbackName) return null;
    return { name: fallbackName };
  }

  const data = snap.data() as any;
  return {
    name: data.name ?? (user.displayName || ''),
  };
}