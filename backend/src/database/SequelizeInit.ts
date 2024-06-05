import { Sequelize, Options } from 'sequelize';
import sequelizeConfig from '../config/Sequelize.Config';

// Choose the environment
const environment = process.env.NODE_ENV || 'development';

// Get the configuration for the chosen environment
const config = sequelizeConfig[environment];

// Define the Sequelize options object
const sequelizeOptions: Options = {
  dialect: config.dialect as any,
  // dialect: 'mysql',
  host: config.host,
  database: config.database,
  username: config.username,
  password: config.password,
};

// Create a Sequelize instance
const sequelize = new Sequelize(sequelizeOptions);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Synchronize all models
// sequelize.sync()
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing the database:', error);
//   });

testConnection();

export default sequelize;
