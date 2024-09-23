import winston from 'winston'
import { join } from 'path'

// Setting the filename, where the logs you write
const filenameError = join(__dirname, '..', 'logs', 'winston-error.json')
const filenameCombined = join(__dirname, '..', 'logs', 'winston-combined.json')

// Define the log format
const logFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.json()
)

// Create a new Winston logger instance
const winstonLogger = winston.createLogger({
	level: 'info',
	format: logFormat,
	transports: [
		/**
		 *-Write to all logs with level `info` and below to `combined.log`.
		 *-Write all logs error(and below) to `error.log`.
		 */
		new winston.transports.File({
			filename: filenameError,
			level: 'error',
		}),
		new winston.transports.File({
			maxsize: 5210000,
			maxFiles: 5,
			filename: filenameCombined,
		}),
	],
})
/**
 * If we're not in production then **ALSO** log to the `console`
 * with the colorized simple format.
 */
if (process.env.APP_ENV !== 'production') {
	winstonLogger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	)
}

export default winstonLogger
