export type * from './auth';
export type * from './messages';
export type * from './models';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    flash: {
        success?: string;
    };
    /** Chats with unread messages, for the navbar badge. */
    unreadMessages?: number;
    [key: string]: unknown;
};
