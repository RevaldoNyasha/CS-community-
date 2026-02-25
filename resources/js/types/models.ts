import type { User } from './auth';

export type Tag = {
    id: number;
    name: string;
};

export type Post = {
    id: number;
    title: string;
    content: string;
    type: 'resource' | 'hackathon' | 'project' | 'announcement';
    status: 'pending' | 'approved';
    user_id: number | null;
    file_path: string | null;
    file_size: number | null;
    event_date: string | null;
    github_url: string | null;
    attachment_url: string | null;
    attachment_is_image: boolean;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    comments_count?: number;
    likes_count?: number;
    is_liked?: boolean;
    comments?: Comment[];
    tags?: Tag[];
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
