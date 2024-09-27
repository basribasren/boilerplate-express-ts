import { Express } from 'express'
import session from 'express-session'
import { Sequelize } from 'sequelize'
import connectSessionSequelize from 'connect-session-sequelize'
import winstonLogger from './winston.config.js'
const logger = winstonLogger

// Define the allowed dialects as a union type
type Dialect = 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql'

// Create a Sequelize instance
const sequelize = new Sequelize(
	process.env.SQL_DATABASE || 'todoapp',
	process.env.SQL_USERNAME || 'root',
	process.env.SQL_PASSWORD || '',
	{
		host: process.env.SQL_HOST || 'localhost',
		dialect: (process.env.SQL_DRIVER as Dialect) || 'mariadb',
		port: Number(process.env.SQL_PORT) || 3308,
	}
)

/**
 * generate store by driver
 * driver can be mongoose or redis
 * @param  {[type]} driver [description]
 * @return {[type]}        [description]
 */
const generateStore = (type: string, instance: Sequelize) => {
	try {
		if (type === 'mysql') {
			// Set up session store
			const SequelizeStore = connectSessionSequelize(session.Store)
			const sessionStore = new SequelizeStore({
				db: instance,
			})
			return sessionStore
		} else {
			logger.error('generate session store failed!', {
				service: 'session',
				method: 'generateStore',
			})
			return undefined
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error('Failed to create session store', {
				service: 'session',
				method: 'generateStore',
				error: error.message,
			})
		} else {
			logger.error('Failed to create session store', {
				service: 'session',
				method: 'generateStore',
				error: 'Unknown error occurred',
			})
		}
		return undefined // Return undefined in case of error
	}
}
/**
 * use session if store succesfully create
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
const sessionConfig = (app: Express, type: string) => {
	const store = generateStore(type, sequelize)

	if (store) {
		// Configure Express session
		app.use(
			session({
				secret: process.env.SECRET || '',
				resave: false,
				saveUninitialized: false,
				cookie: {
					path: '/',
					secure: false,
					maxAge: 24 * 60 * 60 * 1000, // Number of milliseconds (24 hours),
					httpOnly: true,
				},
				store: store,
			})
		)
	} else {
		logger.error('Session store is not defined. Sessions will not be used.', {
			service: 'session',
			method: 'sessionConfig',
		})
	}
	return app
}

export default sessionConfig
