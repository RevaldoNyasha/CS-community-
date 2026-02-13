import type { User } from './auth';

export type Post = {
    id: number;
    title: string;
    content: string;
    type: 'resource' | 'hackathon' | 'announcement';
    status: 'pending' | 'approved';
    user_id: number | null;
    file_path: string | null;
    file_size: number | null;
    attachment_url: string | null;
    attachment_is_image: boolean;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    comments_count?: number;
    comments?: Comment[];
};

export type Comment = {
    id: number;
    post_id: number;
    user_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
};

export type Suggestion = {
    id: number;
    user_id: number;
    message: string;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};
