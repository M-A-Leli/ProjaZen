interface Notification {
    id: string;
    userId: string;
    message: string;
    read: boolean;
}

export type { Notification };

class NotificationAPI {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async fetchNotificationById(id: string, token: string): Promise<Notification> {
        const response = await fetch(`${this.baseURL}/notifications/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notification by ID');
        }

        return response.json();
    }

    async createNotification(notification: Notification, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/notifications/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(notification)
        });

        if (!response.ok) {
            throw new Error('Failed to create notification');
        }

        return 'Notification created successfully';
    }

    async fetchNotificationsByUserId(userId: string, token: string): Promise<Notification[]> {
        const response = await fetch(`${this.baseURL}/notifications/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch notifications for user with ID: ${userId}`);
        }

        return response.json();
    }

    async fetchUnreadNotificationsByUserId(userId: string, token: string): Promise<Notification[]> {
        const response = await fetch(`${this.baseURL}/notifications/unread/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch unread notifications for user with ID: ${userId}`);
        }

        return response.json();
    }

    async markNotificationAsRead(id: string, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/notifications/${id}/read`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to mark notification as read');
        }

        return 'Notification marked as read successfully';
    }

    async deleteNotification(id: string, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/notifications/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete notification');
        }

        return 'Notification deleted successfully';
    }
}

export { NotificationAPI };
