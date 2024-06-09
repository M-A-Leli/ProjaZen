import * as sql from 'mssql';
import config from '../config/sqlConfig';

class Database {
    private static instance: Database;
    private pool: sql.ConnectionPool;

    private constructor() {
        this.pool = new sql.ConnectionPool(config);
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<sql.ConnectionPool> {
        if (!this.pool.connected) {
            await this.pool.connect();
        }
        return this.pool;
    }

    public async close(): Promise<void> {
        await this.pool.close();
    }
}

export default Database;