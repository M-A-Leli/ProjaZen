interface Config {
    user: string;
    password: string;
    server: string;
    database: string;
    pool: {
        max: number,
        min: number,
        idleTimeoutMillis: number
    };
    options: {
        encrypt: boolean;
        trustServerCertificate: boolean;
    };
}

const development: Config = {
    user: process.env.DB_DEV_USER as string,
    password: process.env.DB_DEV_PSW as string,
    server: process.env.DB_DEV_SERVER as string,
    database: process.env.DB_DEV_NAME as string,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const testing: Config = {
    user: process.env.DB_TEST_USER as string,
    password: process.env.DB_TEST_PSW as string,
    server: process.env.DB_TEST_SERVER as string,
    database: process.env.DB_TEST_NAME as string,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true, //
    },
};

const production: Config = {
    user: process.env.DB_PROD_USER as string,
    password: process.env.DB_PROD_PSW as string,
    server: process.env.DB_PROD_SERVER as string,
    database: process.env.DB_PROD_NAME as string,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true, //
    },
};

const config = {
    development,
    testing,
    production,
};

const environment = process.env.NODE_ENV || 'development'; //

export default config[environment as keyof typeof config];
