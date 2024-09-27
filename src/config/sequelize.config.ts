import { Sequelize } from 'sequelize'
import config from '../database/config.json'
import winstonLogger from './winston.config'

// Define environment types explicitly
type Environment = 'development' | 'test' | 'production'
// Define the allowed dialects as a union type
type Dialect = 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql'

const logger = winstonLogger

// Get the current environment or default to 'development'
const env: Environment = (process.env.APP_ENV as Environment) || 'development'
const sequelizeConfig = config[env]

// Create a new Sequelize instance
const sequelize = new Sequelize(
	sequelizeConfig.database,
	sequelizeConfig.username,
	sequelizeConfig.password,
	{
		host: sequelizeConfig.host,
		port: sequelizeConfig.port,
		dialect: sequelizeConfig.dialect as Dialect,
		logging: (msg: string) => logger.info(msg), // optional logging configuration using Winston
	}
)

// Function to authenticate the Sequelize instance
const authenticate = async (sequelize: Sequelize): Promise<void> => {
	try {
		await sequelize.authenticate()
		logger.info('Successfully connected to the database', {
			service: 'sequelize',
			method: 'authenticate',
		})
	} catch (err) {
		if (err instanceof Error) {
			logger.error(`Unable to connect to the database: ${err.message}`, {
				service: 'sequelize',
				method: 'authenticate',
			})
		} else {
			logger.error('Unknown error during authentication', {
				service: 'sequelize',
				method: 'authenticate',
			})
		}
		throw err // Re-throw error to be handled by the caller if needed
	}
}

// Function to synchronize the Sequelize instance
const synchronized = async (sequelize: Sequelize): Promise<void> => {
	try {
		await sequelize.sync()
		logger.info('Successfully synchronized the database', {
			service: 'sequelize',
			method: 'synchronized',
		})
	} catch (err) {
		if (err instanceof Error) {
			logger.error(`Database synchronization failed: ${err.message}`, {
				service: 'sequelize',
				method: 'synchronized',
			})
		} else {
			logger.error('Unknown error during synchronization', {
				service: 'sequelize',
				method: 'synchronized',
			})
		}
		throw err // Re-throw error to be handled by the caller if needed
	}
}

// Export the sequelize instance and utility functions
export { sequelize, authenticate, synchronized }
