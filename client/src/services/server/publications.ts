'use server'

import { StackResponse, PaginatedStackResponse } from '@/@types/generics'
import { Publication, PublicationCategory, PublicationsOverview, PublicationStats } from '@/@types/db'
import { stackbase } from '../server.entry'

// Publication functions
interface PublicationPayload {
    params?: Record<string, string | number | boolean>
}

export const getPublications = async (payload?: PublicationPayload): Promise<PaginatedStackResponse<Publication[]>> => {
    try {
        const { data } = await stackbase.get('/publications/', { ...payload })
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

export const getPublication = async (id: string): Promise<StackResponse<Publication | null>> => {
    try {
        const { data } = await stackbase.get(`/publications/${id}/`)
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

export interface CreatePublicationPayload {
    title: string
    content: string
    summary?: string | null
    category?: string | null
    image?: string | null
    is_published?: boolean
}

export const createPublication = async (payload: CreatePublicationPayload): Promise<StackResponse<Publication | null>> => {
    try {
        const { data } = await stackbase.post('/publications/', payload)
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

export interface UpdatePublicationPayload {
    title?: string
    content?: string
    summary?: string | null
    category?: string | null
    image?: string | null
    is_published?: boolean
}

export const updatePublication = async (id: string, payload: UpdatePublicationPayload): Promise<StackResponse<Publication | null>> => {
    try {
        const { data } = await stackbase.put(`/publications/${id}/`, payload)
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

export const partialUpdatePublication = async (id: string, payload: UpdatePublicationPayload): Promise<StackResponse<Publication | null>> => {
    try {
        const { data } = await stackbase.patch(`/publications/${id}/`, payload)
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

export const deletePublication = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/publications/${id}/`)
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

// Category functions
interface CategoryPayload {
    params?: Record<string, string | number | boolean>
}

export const getCategories = async (payload?: CategoryPayload): Promise<StackResponse<PublicationCategory[]>> => {
    try {
        const { data } = await stackbase.get('/publications/categories/', { ...payload })
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: [],
            status: error?.response?.status
        }
    }
}

export const getCategory = async (id: string): Promise<StackResponse<PublicationCategory | null>> => {
    try {
        const { data } = await stackbase.get(`/publications/categories/${id}/`)
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

export interface CreateCategoryPayload {
    name: string
    description?: string | null
}

export const createCategory = async (payload: CreateCategoryPayload): Promise<StackResponse<PublicationCategory | null>> => {
    try {
        const { data } = await stackbase.post('/publications/categories/', payload)
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

export interface UpdateCategoryPayload {
    name?: string
    description?: string | null
}

export const updateCategory = async (id: string, payload: UpdateCategoryPayload): Promise<StackResponse<PublicationCategory | null>> => {
    try {
        const { data } = await stackbase.put(`/publications/categories/${id}/`, payload)
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

export const partialUpdateCategory = async (id: string, payload: UpdateCategoryPayload): Promise<StackResponse<PublicationCategory | null>> => {
    try {
        const { data } = await stackbase.patch(`/publications/categories/${id}/`, payload)
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

export const deleteCategory = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/publications/categories/${id}/`)
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

export const getPublicationStats = async (): Promise<StackResponse<PublicationStats | null>> => {
    try {
        const { data } = await stackbase.get('/publications/stats/')
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

export const getPublicationOverview = async (): Promise<StackResponse<PublicationsOverview | null>> => {
    try {
        const { data } = await stackbase.get('/publications/overview/')
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