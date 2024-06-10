class Project {
    private readonly id: string;
    private name: string;
    private description: string;
    private startDate: Date;
    private endDate: Date;
    private status: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    constructor(
        id: string,
        name: string,
        description: string,
        startDate: Date,
        endDate: Date,
        status: string = 'unassigned',
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getStatus(): string {
        return this.status;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    // Setters
    setName(name: string): void {
        this.name = name;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }

    setStatus(status: string): void {
        const validStatuses = ['unassigned', 'assigned', 'completed', 'overdue', 'expired'];
        if (validStatuses.includes(status)) {
            this.status = status;
        } else {
            throw new Error("Status must be one of 'unassigned', 'assigned', 'completed', 'overdue', or 'expired'");
        }
    }
}

export default Project;
