class Assignment {
    private readonly id: string;
    private userId: string;
    private projectId: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        projectId: string,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
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

    getProjectId(): string {
        return this.projectId;
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

    setProjectId(projectId: string): void {
        this.projectId = projectId;
    }
}

export default Assignment;
