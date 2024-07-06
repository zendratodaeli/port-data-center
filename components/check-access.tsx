"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cookie from 'js-cookie';

const CheckAccess = () => {
  const router = useRouter();

  useEffect(() => {
    const accessGranted = cookie.get('access_granted');

    if (!accessGranted) {
      router.push('/login');
    }
  }, [router]);

  return null;
};

export default CheckAccess;