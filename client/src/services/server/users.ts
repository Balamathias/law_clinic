'use server'

import { StackResponse, PaginatedStackResponse } from '@/@types/generics'
import { User, UsersOverview } from '@/@types/db'
import { stackbase } from '../server.entry'

interface UserPayload {
    params?: Record<string, string | number | boolean>
}

export const getUsers = async (payload?: UserPayload): Promise<PaginatedStackResponse<User[]>> => {
    try {
        const { data } = await stackbase.get('/users/', { ...payload })
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: [],
            status: error?.response?.status,
            count: 0,
            next: '',
            previous: ''
        }
    }
}

export const getUsersOview = async (payload?: UserPayload): Promise<StackResponse<UsersOverview | null>> => {
    try {
        const { data } = await stackbase.get('/users/overview/', { ...payload })
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const getUser = async (id: string): Promise<StackResponse<User | null>> => {
    try {
        const { data } = await stackbase.get(`/users/${id}/`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const getUserQuizStats = async (userId: string): Promise<StackResponse<any>> => {
    try {
        const { data } = await stackbase.get(`/users/${userId}/quiz-stats/`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const getUserActivity = async (userId: string): Promise<StackResponse<any>> => {
    try {
        const { data } = await stackbase.get(`/users/${userId}/activity/`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export interface CreateUserPayload {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
    is_staff?: boolean
    is_superuser?: boolean
    is_active?: boolean
}

export const createUser = async (payload: CreateUserPayload): Promise<StackResponse<User | null>> => {
    try {
        const { data } = await stackbase.post('/users/', payload)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export interface UpdateUserPayload {
    username?: string
    email?: string
    password?: string
    first_name?: string
    last_name?: string
    is_staff?: boolean
    is_superuser?: boolean
    is_active?: boolean
}

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<StackResponse<User | null>> => {
    try {
        const { data } = await stackbase.put(`/users/${id}/`, payload)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const deleteUser = async (id: string): Promise<StackResponse<User | null>> => {
    try {
        const { data } = await stackbase.delete(`/users/${id}/`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}
