'use server'


import { StackResponse, PaginatedStackResponse } from '@/@types/generics'
import { HelpRequest } from '@/@types/db'
import { stackbase } from '../server.entry'


interface HelpRequestPayload {
    params?: Record<string, string | number | boolean>
}

export const getHelpRequests = async (payload?: HelpRequestPayload): Promise<PaginatedStackResponse<HelpRequest[]>> => {
    try {
        const { data } = await stackbase.get('/help-requests/', { ...payload })
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

export const getHelpRequest = async (id: string): Promise<StackResponse<HelpRequest | null>> => {
    try {
        const { data } = await stackbase.get(`/help-requests/${id}/`)
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

export interface CreateHelpRequestPayload {
    full_name: string
    email: string
    phone_number: string
    legal_issue_type: string
    had_previous_help: 'yes' | 'no'
    description: string
}

export const createHelpRequest = async (payload: CreateHelpRequestPayload): Promise<StackResponse<HelpRequest | null>> => {
    try {
        const { data } = await stackbase.post('/help-requests/', payload)
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

export interface UpdateHelpRequestPayload {
    full_name?: string
    email?: string
    phone_number?: string
    legal_issue_type?: string
    had_previous_help?: 'yes' | 'no'
    description?: string
}

export const updateHelpRequest = async (id: string, payload: UpdateHelpRequestPayload): Promise<StackResponse<HelpRequest | null>> => {
    try {
        const { data } = await stackbase.put(`/help-requests/${id}/`, payload)
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

export const partialUpdateHelpRequest = async (id: string, payload: UpdateHelpRequestPayload): Promise<StackResponse<HelpRequest | null>> => {
    try {
        const { data } = await stackbase.patch(`/help-requests/${id}/`, payload)
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

export const deleteHelpRequest = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/help-requests/${id}/`)
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

export const getHelpRequestStats = async (): Promise<StackResponse<any>> => {
    try {
        const { data } = await stackbase.get('/help-requests/statistics/')
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