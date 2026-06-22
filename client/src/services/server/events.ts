

import { StackResponse, PaginatedStackResponse } from '@/@types/generics'
import { Event, EventCategory, EventRegistration } from '@/@types/db'
import { stackbase, parseApiError } from '../server.entry'


export interface EventsStats {
    total: number
    upcoming: number
    ongoing: number
    completed: number
    cancelled: number
}

interface EventPayload {
    params?: Record<string, string | number | boolean>
}

export const getEventsStats = async (): Promise<{ data: EventsStats }> => {
    try {
        const { data } = await stackbase.get('/events/stats/')
        return data
    } catch {
        return {
            data: { total: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 },
        }
    }
}

export const getEvents = async (payload?: EventPayload): Promise<PaginatedStackResponse<Event[]>> => {
    try {
        const { data } = await stackbase.get('/events/', { ...payload })
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

export const getEvent = async (slug: string): Promise<StackResponse<Event | null>> => {
    try {
        const { data } = await stackbase.get(`/events/${slug}/`)
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

export interface CreateEventPayload {
    title: string
    description: string
    short_description?: string | null
    start_date: string
    end_date: string
    location: string
    virtual_link?: string | null
    category?: string | null
    image?: string | null
    max_participants: number
    registration_required: boolean
    registration_deadline?: string | null
    status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
    featured?: boolean
}

export const createEvent = async (payload: CreateEventPayload): Promise<StackResponse<Event | null>> => {
    try {
        const { data } = await stackbase.post('/events/', payload)
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

export const updateEvent = async (slug: string, payload: CreateEventPayload): Promise<StackResponse<Event | null>> => {
    try {
        const { data } = await stackbase.put(`/events/${slug}/`, payload)
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

export const partialUpdateEvent = async (slug: string, payload: Partial<CreateEventPayload>): Promise<StackResponse<Event | null>> => {
    try {
        const { data } = await stackbase.patch(`/events/${slug}/`, payload)
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

export const deleteEvent = async (slug: string): Promise<StackResponse<null>> => {
    try {
        const response = await stackbase.delete(`/events/${slug}/`)
        return {
            data: response.data || null,
            status: response.status,
            message: 'Deleted successfully',
            error: null
        }
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const registerForEvent = async (slug: string): Promise<StackResponse<EventRegistration | null>> => {
    try {
        const { data } = await stackbase.post(`/events/${slug}/register/`)
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

export const unregisterFromEvent = async (slug: string): Promise<StackResponse<null>> => {
    try {
        const response = await stackbase.delete(`/events/${slug}/unregister/`)
        return {
            data: response.data || null,
            status: response.status,
            message: 'Deleted successfully',
            error: null
        }
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const checkEventRegistration = async (slug: string): Promise<StackResponse<{is_registered: boolean} | null>> => {
    try {
        const { data } = await stackbase.get(`/events/${slug}/check_registration/`)
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

// Event Category functions
interface EventCategoryPayload {
    params?: Record<string, string | number | boolean>
}

export const getEventCategories = async (payload?: EventCategoryPayload): Promise<StackResponse<EventCategory[]>> => {
    try {
        const { data } = await stackbase.get('/events/event-categories/', { ...payload })
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

export const getEventCategory = async (id: string): Promise<StackResponse<EventCategory | null>> => {
    try {
        const { data } = await stackbase.get(`/events/event-categories/${id}/`)
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

export interface CreateEventCategoryPayload {
    name: string
    description?: string | null
}

export const createEventCategory = async (payload: CreateEventCategoryPayload): Promise<StackResponse<EventCategory | null>> => {
    try {
        const { data } = await stackbase.post('/events/event-categories/', payload)
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

export const updateEventCategory = async (id: string, payload: CreateEventCategoryPayload): Promise<StackResponse<EventCategory | null>> => {
    try {
        const { data } = await stackbase.put(`/events/event-categories/${id}/`, payload)
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

export const partialUpdateEventCategory = async (id: string, payload: Partial<CreateEventCategoryPayload>): Promise<StackResponse<EventCategory | null>> => {
    try {
        const { data } = await stackbase.patch(`/events/event-categories/${id}/`, payload)
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

export const deleteEventCategory = async (id: string): Promise<StackResponse<null>> => {
    try {
        const response = await stackbase.delete(`/events/event-categories/${id}/`)
        return {
            data: response.data || null,
            status: response.status,
            message: 'Deleted successfully',
            error: null
        }
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

// Event Registration functions
interface EventRegistrationPayload {
    params?: Record<string, string | number | boolean>
}

export const getEventRegistrations = async (payload?: EventRegistrationPayload): Promise<PaginatedStackResponse<EventRegistration[]>> => {
    try {
        const { data } = await stackbase.get('/events/event-registrations/', { ...payload })
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

export const getEventRegistration = async (id: string): Promise<StackResponse<EventRegistration | null>> => {
    try {
        const { data } = await stackbase.get(`/events/event-registrations/${id}/`)
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

export interface CreateEventRegistrationPayload {
    event: string
    notes?: string | null
}

export const createEventRegistration = async (payload: CreateEventRegistrationPayload): Promise<StackResponse<EventRegistration | null>> => {
    try {
        const { data } = await stackbase.post('/events/event-registrations/', payload)
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

export interface UpdateEventRegistrationPayload {
    notes?: string | null
    attended?: boolean
}

export const updateEventRegistration = async (id: string, payload: UpdateEventRegistrationPayload): Promise<StackResponse<EventRegistration | null>> => {
    try {
        const { data } = await stackbase.put(`/events/event-registrations/${id}/`, payload)
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

export const partialUpdateEventRegistration = async (id: string, payload: UpdateEventRegistrationPayload): Promise<StackResponse<EventRegistration | null>> => {
    try {
        const { data } = await stackbase.patch(`/events/event-registrations/${id}/`, payload)
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

export const deleteEventRegistration = async (id: string): Promise<StackResponse<null>> => {
    try {
        const response = await stackbase.delete(`/events/event-registrations/${id}/`)
        return {
            data: response.data || null,
            status: response.status,
            message: 'Deleted successfully',
            error: null
        }
    } catch (error: any) {
        return {
            message: parseApiError(error),
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const getMyEventRegistrations = async (): Promise<PaginatedStackResponse<EventRegistration[]>> => {
    try {
        const { data } = await stackbase.get('/events/event-registrations/my_registrations/')
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

export const markRegistrationAttended = async (id: string, attended: boolean): Promise<StackResponse<EventRegistration | null>> => {
    try {
        const { data } = await stackbase.patch(`/events/event-registrations/${id}/mark_attended/`, { attended })
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
