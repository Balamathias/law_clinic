import { useMutation, useQuery } from "@tanstack/react-query";
import { followUnfollowUser, login, logout, register, updateUser, verifyOTP, resendOTP, resetPassword, passwordResetConfirm, getUser, getCookies } from "@/services/server/auth";
import { User } from "@/@types/db";
import { QUERY_KEYS } from "./query-keys";

export const useRegister = () => useMutation({
  mutationKey: ['register'],
  mutationFn: async ({...data}: { email: string, username?: string, password: string}) => register({...data}),
    onSuccess: (data) => {
        if (data.error) {
            throw new Error(data.message)
        }
    }
})

export const useUser = () => useQuery({
  queryKey: [QUERY_KEYS.get_user],
  queryFn: async () => getUser(),
})

export const useLogin = () => useMutation({
  mutationKey: ['login'],
  mutationFn: async ({email, password}: { email: string, password: string }) => login(email, password),
  onSuccess: (data) => {
    if (data.error) {
      throw new Error(data.message)
    }
  },
})

export const useLogout = () => useMutation({
  mutationKey: ['logout'],
  mutationFn: logout,
})

export const useUpdateUser = () => useMutation({
  mutationFn: (data: Partial<User>) => updateUser(data),
  mutationKey: [QUERY_KEYS.update_user]
})

export const useVerifyOTP = () => useMutation({
  mutationKey: ['verify-otp'],
  mutationFn: ({email, otp}: { email: string, otp: string}) => verifyOTP(email, otp),
})

export const useResendOTP = () => useMutation({
  mutationKey: ['resend-otp'],
  mutationFn: ({email}: { email: string }) => resendOTP(email),
})

export const useResetPassword = () => useMutation({
  mutationKey: ['reset-password'],
  mutationFn: ({email}: { email: string }) => resetPassword(email)
})

export const useResetPasswordConfirm = () => useMutation({
  mutationKey: ['reset-password-confirm'],
  mutationFn: (data: { uid: string, token: string, password: string }) => passwordResetConfirm(data)
})

export const useCookies = () => useQuery({
  queryKey: [QUERY_KEYS.get_cookies], 
  queryFn: async () => {
    const { cookieStore, token } = await getCookies()
    return {cookieStore, token}
  }
})