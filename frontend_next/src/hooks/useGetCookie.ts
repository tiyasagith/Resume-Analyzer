"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useGetCookie(cookieKey: string) {
  const [cookieValue, setCookieValue] = useState<string | undefined>(() => {
    return Cookies.get(cookieKey);
  });

  useEffect(() => {
    const value = Cookies.get(cookieKey);
    setCookieValue(value);
  }, [cookieKey]);

  return cookieValue;
}
