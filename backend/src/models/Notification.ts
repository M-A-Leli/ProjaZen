class Notification {
    private readonly id: string;
    private userId: string;
    private message: string;
    private read: boolean;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        message: string,
        read: boolean = false,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getUserId(): string {
        return this.userId;
    }

    getMessage(): string {
        return this.message;
    }

    isRead(): boolean {
        return this.read;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    // Setters
    setUserId(userId: string): void {
        this.userId = userId;
    }

    setMessage(message: string): void {
        this.message = message;
    }

    setRead(read: boolean): void {
        this.read = read;
    }
}

export default Notification;
