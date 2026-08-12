export interface NotificationItem {
    id: number;
    title: string;
    body: string;
    payload: {
        category?: string;
        [key: string]: any;
    };
    channel: string;
    status: string;
    read: boolean;
    createdAt: string;
}

export interface NotificationPageResponse {
    content: NotificationItem[];
    unreadCount: number
    totalElements: number;
    isLast: boolean;          // true si es la última página
}
