import type { User } from './auth';

export type Announcement = {
    id: number;
    user_id: number;
    title: string;
    body: string;
    is_pinned: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
};

export type Subject = {
    id: number;
    name: string;
    code: string;
    part: number;
    description: string | null;
    created_at: string;
    updated_at: string;
    study_resources_count?: number;
};

export type StudyResource = {
    id: number;
    user_id: number;
    subject_id: number;
    title: string;
    description: string | null;
    type: string;
    file_path: string | null;
    external_url: string | null;
    year: number;
    semester: number;
    downloads_count: number;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    subject?: Subject;
};

export type TutorialCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
    tutorials_count?: number;
};

export type Tutorial = {
    id: number;
    user_id: number;
    tutorial_category_id: number;
    title: string;
    description: string;
    url: string;
    platform: string;
    difficulty: string;
    is_free: boolean;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    tutorial_category?: TutorialCategory;
};

export type ForumCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    forum_posts_count?: number;
};

export type ForumPost = {
    id: number;
    user_id: number;
    forum_category_id: number;
    title: string;
    slug: string;
    body: string;
    is_resolved: boolean;
    views_count: number;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    forum_category?: ForumCategory;
    forum_comments_count?: number;
    forum_comments?: ForumComment[];
};

export type ForumComment = {
    id: number;
    forum_post_id: number;
    user_id: number;
    body: string;
    is_best_answer: boolean;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
};

export type CareerResource = {
    id: number;
    title: string;
    slug: string;
    type: string;
    content: string;
    external_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Achievement = {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string;
    image_path: string | null;
    achieved_at: string;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    achievement_ratings_count?: number;
    achievement_ratings?: AchievementRating[];
};

export type AchievementRating = {
    id: number;
    achievement_id: number;
    user_id: number;
    rating: number;
    created_at: string;
    updated_at: string;
};

export type Testimonial = {
    id: number;
    user_id: number;
    content: string;
    rating: number;
    is_featured: boolean;
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
