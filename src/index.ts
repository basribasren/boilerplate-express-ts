import http from 'http'
import express, { Express, Request, Response } from 'express'
import serveStatic from 'serve-static'
import dotenv from 'dotenv'
import { resolve } from 'path'

import expressConfig from './config/express.config.js'
// import sessionConfig from './config/session.config.js'
import generateSwagger from './config/swagger.config.js'
import winstonLogger from './config/winston.config.js'
// import {
// 	sequelize,
// 	authenticate,
// 	synchronized,
// } from './config/sequelize.config.js'
import router from './modules/modules.index'
import errorHandler from './helper/error.handler'

//TODO SET env
dotenv.config()

const app: Express = express()

//TODO SET express default configuration
expressConfig(app)

//TODO SET winston as logger
const logger = winstonLogger

//TODO Sync Sequelize models
// await authenticate(sequelize)
// await synchronized(sequelize)

//TODO SET session with mysql
// const SESS_DRIVER = 'mysql'
// sessionConfig(app, SESS_DRIVER)

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server')
})

//TODO SET api-docs with swagger-ui
const config = generateSwagger()
app.get('/api/v1/swagger.json', (req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json')
	res.send(config)
})
app.use('/api/v1/docs', serveStatic(resolve(__dirname, './docs/swagger-ui')))

/**
 *  ******************************************************************
 *  router for all api endpoint
 *  ******************************************************************
 */
app.use('/api', router)

app.use(errorHandler)

// Start the server
const HOST = process.env.APP_HOST || 'localhost'
const PORT = process.env.APP_PORT || 3000

// Set Host and Port in Express
app.set('host', HOST)
app.set('port', PORT)

const server = http.createServer(app)

server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
	const port = parseInt(val, 10)
	if (isNaN(port)) {
		return val // named pipe
	}
	if (port >= 0) {
		return port // port number
	}
	return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException) {
	if (error.syscall !== 'listen') {
		throw error
	}

	const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`

	// Handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			logger.error(`${bind} is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	const addr = server.address()

	// Check if addr is null or undefined
	if (addr) {
		const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
		const message = `Server running at: http://${app.get('host')}:${app.get('port')}/`
		logger.info(`Listening on ${bind}`)
		logger.info(message)
	} else {
		logger.warn('Server address is not available')
	}
}
