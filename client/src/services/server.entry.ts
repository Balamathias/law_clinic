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
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newToken = response.data.access;

        const cookieStore = await cookies();
        try {
          cookieStore.set('token', newToken, { 
            path: '/',
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        } catch (cookieError) {
          console.warn('Could not set cookie during server render:', cookieError);
        }

        // Retry original request with new access token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return serverClient(originalRequest);
      } catch (err) {
        // Refresh token failed, clear tokens from cookies
        try {
          const cookieStore = await cookies();
          cookieStore.delete('token');
          cookieStore.delete('refresh_token');
        } catch (cookieError) {
          console.warn('Could not delete cookies during server render:', cookieError);
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { serverClient as stackbase }
