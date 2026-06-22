
import { StackResponse, PaginatedStackResponse } from '@/@types/generics'
import { Publication, PublicationCategory, PublicationsOverview, PublicationStats } from '@/@types/db'
import { stackbase, parseApiError } from '../server.entry'

export interface PublicationsStats {
    total: number
    published: number
    draft: number
    archived: number
    featured: number
}

// Publication functions
interface PublicationPayload {
    params?: Record<string, string | number | boolean>
}

export const getPublicationsStats = async (): Promise<{ data: PublicationsStats }> => {
    try {
        console.log("getPublicationsStats: Requesting '/publications/stats/' from baseURL:", stackbase.defaults.baseURL);
        const { data } = await stackbase.get('/publications/stats/')
        console.log("getPublicationsStats: Success!", data);
        return data
    } catch (error: any) {
        console.error("getPublicationsStats: ERROR!", {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
            url: error?.config?.url,
            headers: error?.config?.headers
        });
        return {
            data: { total: 0, published: 0, draft: 0, archived: 0, featured: 0 },
        }
    }
}

export const getPublications = async (payload?: PublicationPayload): Promise<PaginatedStackResponse<Publication[]>> => {
    try {
        const { data } = await stackbase.get('/publications/', { ...payload })
        return data
    } catch (error: any) {
        return {
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
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
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

// Comment functions
export interface CommentPayload {
    params?: Record<string, string | number | boolean>
}

export interface ClinicComment {
    id: string
    content: string
    created_at: string
    is_approved: boolean
    parent: string | null
    author: {
        id: string
        username: string
        first_name?: string
        last_name?: string
        email: string
    }
}

export const getComments = async (payload?: CommentPayload): Promise<PaginatedStackResponse<ClinicComment[]>> => {
    try {
        const { data } = await stackbase.get('/publications/comments/', { ...payload })
        return data
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: [],
            status: error?.response?.status,
            count: 0,
            next: '',
            previous: ''
        }
    }
}

export const updateComment = async (id: string, payload: { is_approved?: boolean; content?: string }): Promise<StackResponse<ClinicComment | null>> => {
    try {
        const { data } = await stackbase.patch(`/publications/comments/${id}/`, payload)
        return data
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const deleteComment = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/publications/comments/${id}/`)
        return data
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

