import 'express-session';
import 'express';

declare module 'express-session' {
    interface SessionData {
        userId: string;
        role: string;
    }
}

declare module 'express' {
    interface Request {
        user?: {
            id: string;
            role: string;
        };
    }
}
