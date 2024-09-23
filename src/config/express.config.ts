import { Express } from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import methodOverride from 'method-override'
import responseTime from 'response-time'

const expressConfig = (app: Express) => {
	/**
	 * This is compress configuration from MERN.JS
	 * Should be placed before express.static
	 * 	app.use(compress({
	 * 		filter: function(req, res) {
	 * 			return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'))
	 * 	  	},
	 * 	   level: 9
	 *  }))
	 */
	// Compress all responses
	app.use(compression())
	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.json())
	// Parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	// Override with the X-HTTP-Method-Override header in the request
	app.use(methodOverride('X-HTTP-Method-Override'))
	// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
	app.use(cookieParser())
	// It will incorrectly register the proxy’s IP address as the client IP address unless trust proxy is configured
	app.set('trust proxy', 1)
	// Allows cross-domain communication from the browser
	app.use(cors())
	app.use(hpp())

	/**
	 * This is helmet configuration on MERN.JS
	 * var SIX_MONTHS = 15778476000
	 * app.use(helmet.xframe())
	 * app.use(helmet.xssFilter())
	 * app.use(helmet.nosniff())
	 * app.use(helmet.ienoopen())
	 * app.use(helmet.hsts({
	 * maxAge: SIX_MONTHS,
	 * 		includeSubdomains: true,
	 *  	force: true
	 * }))
	 * app.disable('x-powered-by')
	 */
	// Help secure Express apps with various HTTP headers
	app.use(helmet())
	// Records the response time for requests in HTTP servers {x-response-time →376.293ms}
	app.use(responseTime())

	return app
}

export default expressConfig
