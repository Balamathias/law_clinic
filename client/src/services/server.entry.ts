'use server'

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from './utils';

// const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'https://lawstack-ms.vercel.app/api/v1';

const serverClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverClient.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

serverClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite retry loop
      originalRequest._retry = true;

      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refresh_token')?.value;

      if (!refreshToken) {
        // TODO: No refresh token, handle error (e.g., redirect to login)
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newToken = response.data.access;

        const res = NextResponse.next();
        res.cookies.set('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); 
        // Set new token as a cookie

        // Retry original request with new access token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return serverClient(originalRequest);
      } catch (err) {
        // Refresh token failed, clear tokens from cookies
        const res = NextResponse.next();
        res.cookies.delete('token');
        res.cookies.delete('refresh_token');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { serverClient as stackbase }
