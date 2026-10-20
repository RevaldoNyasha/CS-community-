// Shapes returned by MessageController (app/Http/Controllers/MessageController.php).

export type ChatUser = { id: number; name: string };

export type ChatMessage = {
    id: number;
    body: string;
    fromMe: boolean;
    sentAt: string;
};

/** active: both can chat; incoming: they asked you; outgoing: you asked and are waiting. */
export type ConversationStatus = 'active' | 'incoming' | 'outgoing';

export type ConversationSummary = {
    id: number;
    with: ChatUser;
    about: { title: string; slug: string } | null;
    status: ConversationStatus;
    unread: boolean;
    lastMessage: { body: string; fromMe: boolean } | null;
    updatedAt: string;
};

export type ConversationDetail = ConversationSummary & {
    messages: ChatMessage[];
};
