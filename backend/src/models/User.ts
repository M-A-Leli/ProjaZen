class User {
    private readonly id: string;
    private fname: string;
    private lname: string;
    private email: string;
    private password: string;
    private salt: string;
    private role: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    constructor(
        id: string,
        fname: string,
        lname: string,
        email: string,
        password: string,
        salt: string,
        role: string = 'user',
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getFname(): string {
        return this.fname;
    }

    getLname(): string {
        return this.lname;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getSalt(): string {
        return this.salt;
    }

    getRole(): string {
        return this.role;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    // Setters
    setFname(fname: string): void {
        this.fname = fname;
    }

    setLname(lname: string): void {
        this.lname = lname;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    setSalt(salt: string): void {
        this.salt = salt;
    }

    setRole(role: string): void {
        if (role === 'user' || role === 'admin') {
            this.role = role;
        } else {
            throw new Error("Role must be either 'user' or 'admin'");
        }
    }
}

export default User;
