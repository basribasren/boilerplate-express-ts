import Boom from '@hapi/boom'
import winstonLogger from '../config/winston.config'
const logger = winstonLogger

interface SuccessResponse {
	statusCode: number
	payload: {
		message: string
		data: any
		type: 'Request Success'
	}
}
/**
 * generate success payload & log it with more information
 * @param  {[type]} status  [description]
 * @param  {[type]} message [description]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */
export const successPayload = (success: SuccessResponse, url: string, method: string) => {
	logger.info(success.payload.message, { service: url, method: method })
	let payload = {
		data: success.payload.data,
		status: success.statusCode,
		message: success.payload.message,
		type: success.payload.type,
		header: {},
	}
	return payload
}

/**
 * generate error payload & log it with more information
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
export const errorPayload = (err: Boom.Boom, url: string, method: string) => {
	logger.error(err.output.payload.message, { service: url, method: method })
	let payload = {
		data: [],
		status: err.output.statusCode || 500,
		message: err.output.payload.message || 'Something error',
		type: err.output.payload.error || 'Internal Error',
		header: err.output.headers || {},
	}
	return payload
}
