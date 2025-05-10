export interface User {
    id: string,
    username: string,
    email: string,
    first_name: string | null,
    last_name: string | null,
    is_active?: boolean,
    is_staff?: boolean,
    is_superuser?: boolean,
    avatar: string | null,
    phone: string | null,
    created_at: string,
    date_joined: string,
    last_login: string | null,
}

// Event category interface
export interface EventCategory {
    id: string,
    name: string,
    description: string | null,
    created_at: string,
    updated_at: string,
    event_count?: number,
}

// Event interface
export interface Event {
    id: string,
    title: string,
    slug: string,
    description: string,
    short_description: string | null,
    start_date: string,
    end_date: string,
    location: string,
    virtual_link: string | null,
    category: string | null,
    category_name?: string,
    image: string | null,
    organizer: string | null,
    organizer_name?: string,
    max_participants: number,
    registration_required: boolean,
    registration_deadline: string | null,
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed',
    featured: boolean,
    created_at: string,
    updated_at: string,
    registration_count?: number,
    is_upcoming?: boolean,
    is_ongoing?: boolean,
    has_registration_closed?: boolean,
    registrations?: EventRegistration[],
}

// Event registration interface
export interface EventRegistration {
    id: string,
    event: string,
    event_title?: string,
    user: string,
    user_details?: User,
    registered_at: string,
    attended: boolean,
    notes: string | null,
}

// Publication Category interface
export interface PublicationCategory {
    id: string,
    name: string,
    description: string | null,
    created_at: string,
    updated_at: string,
    publication_count?: number,
}

// Publication interface
export interface Publication {
    id: string,
    title: string,
    slug: string,
    content: string,
    excerpt: string | null,
    category: string | null,
    categories: PublicationCategory[] | null;
    category_name?: string,
    featured_image: string | null,
    author: User | null,
    author_name?: string,
    is_published: boolean,
    created_at: string,
    updated_at: string,
    published_at: string | null,
    status: 'draft' | 'published' | 'archived',
    mins_read: number
}

// API Response types for handling server responses
export interface ApiResponse<T> {
    data: T | null,
    message: string,
    status: string,
    code: number,
    error?: any,
}

// Authentication related types
export interface AuthTokens {
    access_token: string,
    refresh_token: string,
}

export interface LoginCredentials {
    email: string,
    password: string,
}

export interface RegistrationData {
    email: string,
    username?: string,
    password: string,
    first_name?: string,
    last_name?: string,
    phone?: string,
}

export interface OtpVerificationData {
    email: string,
    otp: string,
}

export interface PasswordResetRequest {
    email: string,
}

export interface PasswordResetConfirm {
    email: string,
    otp: string,
    new_password: string,
}

interface UsersOverview {
  totalUsers: number;
  activeUsers?: number;
  staffUsers?: number;
  adminUsers?: number;
}

interface PublicationsOverview {
  totalPublications: number;
  publishedCount?: number;
  draftCount?: number;
  categoryCount?: number;
}

export interface PublicationStats {
  total_count: number;
  published_count: number;
  draft_count: number;
  featured_count: number;
  most_viewed: Publication[];
  recent: Publication[];
  by_category: {
    name: string;
    slug: string;
    count: number;
  }[];
}

// App settings related types
export interface AppData {
    id: string;
    name: string;
    logo_url: string | null;
    mission_statement: string;
    vision_statement: string;
    history: string | null,
    objectives: string | null,
    created_at: string;
    updated_at: string;
}

export interface GalleryImage {
    id: string;
    title: string;
    description: string | null;
    gallery: string;
    image: string | null;
    instagram: string | null;
    x_handle: string | null;
    facebook: string | null;
    ordering: number | null;
    created_at: string;
    updated_at: string;
}

export interface Gallery {
    id: string;
    title: string;
    description: string | null;
    department: 'clinical' | 'research' | 'litigation' | 'other';
    is_previous: boolean;
    year: number | null;
    created_at: string;
    updated_at: string;
    images: GalleryImage[];
    ordering: number | null;
}

export interface Sponsor {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    url: string | null;
    type: 'person' | 'organization';
    ordering: number | null;

    created_at: string;
    updated_at: string;
}

export interface Testimonial {
    id: string;
    name: string;
    occupation: string;
    quote: string | null;
    image: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export interface HelpRequest {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    legal_issue_type: string;
    had_previous_help: 'yes' | 'no';
    description: string;
    created_at: string;
    updated_at: string;
}