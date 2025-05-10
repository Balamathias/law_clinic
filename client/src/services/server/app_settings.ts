'use server'


import { StackResponse, PaginatedStackResponse } from '@/@types/generics'
import { AppData, Gallery, GalleryImage, Sponsor, Testimonial } from '@/@types/db'
import { stackbase } from '../server.entry'

// App Data functions
interface AppDataPayload {
    params?: Record<string, string | number | boolean>
}

export const getAppData = async (payload?: AppDataPayload): Promise<StackResponse<AppData[]>> => {
    try {
        const { data } = await stackbase.get('/app_settings/app-data/', { ...payload })
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

export const getSingleAppData = async (id: string): Promise<StackResponse<AppData | null>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/app-data/${id}/`)
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

export interface CreateAppDataPayload {
    name: string
    logo_url?: string | null
    mission_statement: string
    vision_statement: string
}

export const createAppData = async (payload: CreateAppDataPayload): Promise<StackResponse<AppData | null>> => {
    try {
        const { data } = await stackbase.post('/app_settings/app-data/', payload)
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

export interface UpdateAppDataPayload {
    name?: string
    logo_url?: string | null
    mission_statement?: string
    vision_statement?: string
}

export const updateAppData = async (id: string, payload: UpdateAppDataPayload): Promise<StackResponse<AppData | null>> => {
    try {
        const { data } = await stackbase.put(`/app_settings/app-data/${id}/`, payload)
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

export const partialUpdateAppData = async (id: string, payload: UpdateAppDataPayload): Promise<StackResponse<AppData | null>> => {
    try {
        const { data } = await stackbase.patch(`/app_settings/app-data/${id}/`, payload)
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

export const deleteAppData = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/app_settings/app-data/${id}/`)
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

// Gallery functions
interface GalleryPayload {
    params?: Record<string, string | number | boolean>
}

export const getGalleries = async (payload?: GalleryPayload): Promise<StackResponse<Gallery[]>> => {
    try {
        const { data } = await stackbase.get('/app_settings/galleries/', { ...payload })
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

export const getGalleriesByDepartment = async (department: string): Promise<StackResponse<Gallery[]>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/galleries/by_department/?department=${department}`)
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

export const getGallery = async (id: string): Promise<StackResponse<Gallery | null>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/galleries/${id}/`)
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

export interface CreateGalleryPayload {
    title: string
    description?: string | null
    department: 'clinical' | 'research' | 'litigation' | 'other'
    is_previous: boolean
    year?: number | null
    ordering?: number | null
}

export const createGallery = async (payload: CreateGalleryPayload): Promise<StackResponse<Gallery | null>> => {
    try {
        const { data } = await stackbase.post('/app_settings/galleries/', payload)
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

export interface UpdateGalleryPayload {
    title?: string
    description?: string | null
    department?: 'clinical' | 'research' | 'litigation' | 'other'
    is_previous?: boolean
    year?: number | null
    ordering?: number | null
}

export const updateGallery = async (id: string, payload: UpdateGalleryPayload): Promise<StackResponse<Gallery | null>> => {
    try {
        const { data } = await stackbase.put(`/app_settings/galleries/${id}/`, payload)
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

export const partialUpdateGallery = async (id: string, payload: UpdateGalleryPayload): Promise<StackResponse<Gallery | null>> => {
    try {
        const { data } = await stackbase.patch(`/app_settings/galleries/${id}/`, payload)
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

export const deleteGallery = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/app_settings/galleries/${id}/`)
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

// Gallery Image functions
interface GalleryImagePayload {
    params?: Record<string, string | number | boolean>
}

export const getGalleryImages = async (payload?: GalleryImagePayload): Promise<StackResponse<GalleryImage[]>> => {
    try {
        const { data } = await stackbase.get('/app_settings/gallery-images/', { ...payload })
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

export const getGalleryImage = async (id: string): Promise<StackResponse<GalleryImage | null>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/gallery-images/${id}/`)
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

export interface CreateGalleryImagePayload {
    description?: string | null
    gallery: string
    image?: string | null
    instagram?: string | null
    x_handle?: string | null
    facebook?: string | null
    ordering?: number | null
}

export const createGalleryImage = async (payload: CreateGalleryImagePayload): Promise<StackResponse<GalleryImage | null>> => {
    try {
        const { data } = await stackbase.post('/app_settings/gallery-images/', payload)
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

export interface UpdateGalleryImagePayload {
    description?: string | null
    gallery?: string
    image?: string | null
    instagram?: string | null
    x_handle?: string | null
    facebook?: string | null
    ordering?: number | null
}

export const updateGalleryImage = async (id: string, payload: UpdateGalleryImagePayload): Promise<StackResponse<GalleryImage | null>> => {
    try {
        const { data } = await stackbase.put(`/app_settings/gallery-images/${id}/`, payload)
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

export const partialUpdateGalleryImage = async (id: string, payload: UpdateGalleryImagePayload): Promise<StackResponse<GalleryImage | null>> => {
    try {
        const { data } = await stackbase.patch(`/app_settings/gallery-images/${id}/`, payload)
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

export const deleteGalleryImage = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/app_settings/gallery-images/${id}/`)
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

// Sponsor functions
interface SponsorPayload {
    params?: Record<string, string | number | boolean>
}

export const getSponsors = async (payload?: SponsorPayload): Promise<StackResponse<Sponsor[]>> => {
    try {
        const { data } = await stackbase.get('/app_settings/sponsors/', { ...payload })
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

export const getSponsorsByType = async (type: 'person' | 'organization'): Promise<StackResponse<Sponsor[]>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/sponsors/by_type/?type=${type}`)
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

export const getSponsor = async (id: string): Promise<StackResponse<Sponsor | null>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/sponsors/${id}/`)
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

export interface CreateSponsorPayload {
    name: string
    image?: string | null
    url?: string | null
    type: 'person' | 'organization'
    ordering?: number | null
}

export const createSponsor = async (payload: CreateSponsorPayload): Promise<StackResponse<Sponsor | null>> => {
    try {
        const { data } = await stackbase.post('/app_settings/sponsors/', payload)
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

export interface UpdateSponsorPayload {
    name?: string
    image?: string | null
    url?: string | null
    type?: 'person' | 'organization'
    ordering?: number | null
}

export const updateSponsor = async (id: string, payload: UpdateSponsorPayload): Promise<StackResponse<Sponsor | null>> => {
    try {
        const { data } = await stackbase.put(`/app_settings/sponsors/${id}/`, payload)
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

export const partialUpdateSponsor = async (id: string, payload: UpdateSponsorPayload): Promise<StackResponse<Sponsor | null>> => {
    try {
        const { data } = await stackbase.patch(`/app_settings/sponsors/${id}/`, payload)
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

export const deleteSponsor = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/app_settings/sponsors/${id}/`)
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

// Testimonial functions
interface TestimonialPayload {
    params?: Record<string, string | number | boolean>
}

export const getTestimonials = async (payload?: TestimonialPayload): Promise<StackResponse<Testimonial[]>> => {
    try {
        const { data } = await stackbase.get('/app_settings/testimonials/', { ...payload })
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

export const getTestimonial = async (id: string): Promise<StackResponse<Testimonial | null>> => {
    try {
        const { data } = await stackbase.get(`/app_settings/testimonials/${id}/`)
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

export interface CreateTestimonialPayload {
    name: string
    occupation: string
    quote?: string | null
    image?: string | null
    category?: string | null
}

export const createTestimonial = async (payload: CreateTestimonialPayload): Promise<StackResponse<Testimonial | null>> => {
    try {
        const { data } = await stackbase.post('/app_settings/testimonials/', payload)
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

export interface UpdateTestimonialPayload {
    name?: string
    occupation?: string
    quote?: string | null
    image?: string | null
    category?: string | null
}

export const updateTestimonial = async (id: string, payload: UpdateTestimonialPayload): Promise<StackResponse<Testimonial | null>> => {
    try {
        const { data } = await stackbase.put(`/app_settings/testimonials/${id}/`, payload)
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

export const partialUpdateTestimonial = async (id: string, payload: UpdateTestimonialPayload): Promise<StackResponse<Testimonial | null>> => {
    try {
        const { data } = await stackbase.patch(`/app_settings/testimonials/${id}/`, payload)
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

export const deleteTestimonial = async (id: string): Promise<StackResponse<null>> => {
    try {
        const { data } = await stackbase.delete(`/app_settings/testimonials/${id}/`)
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