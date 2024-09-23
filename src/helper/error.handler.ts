import { NextFunction, Request, Response } from 'express'
import Boom from '@hapi/boom'
import { errorPayload } from './payload.handler'

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err) {
		if (Boom.isBoom(err)) {
			const payload = errorPayload(err, req.url, req.method)
			res.status(err.output.statusCode).send(payload)
		} else {
			// Handle other errors
			const boomError = Boom.internal('An internal server error occurred')
			const payload = errorPayload(boomError, req.url, req.method)
			res.status(boomError.output.statusCode).send(payload)
		}
	} else {
		next()
	}
}

export default errorHandler
