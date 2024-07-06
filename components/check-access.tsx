"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import cookie from 'js-cookie';

const CheckAccess = () => {
  const router = useRouter();

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const res = await axios.get('/api/check-access');
        if (res.status !== 200) {
          router.push('/login');
        }
      } catch (error) {
        console.error('API error:', error);
        router.push('/login');
      }
    };

    checkPassword();
  }, [router]);

  return null;
};

export default CheckAccess;
