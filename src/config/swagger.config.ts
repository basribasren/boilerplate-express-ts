import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: process.env.APP_NAME || '',
		version: process.env.APP_VERSION || '',
		description: process.env.APP_DESCRIPTION || '',
		termsOfService: 'http://swagger.io/terms/',
		contact: {
			email: 'basri.basreen@gmail.com',
		},
		license: {
			name: 'Apache 2.0',
			url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
		},
	},
	basePath: '/',
	components: {
		securitySchemes: {
			BasicAuth: {
				type: 'http',
				scheme: 'basic',
			},
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
			},
			ApiKeyAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'x-auth-token',
			},
		},
	},
}

const swaggerOptions = {
	swaggerDefinition: swaggerDefinition,
	// path to the API docs
	apis: [
		path.join(__dirname, '..', '/docs/swagger-config/*.js'),
		path.join(__dirname, '..', '/docs/swagger-config/*.yml'),
	],
}

/**
 * Initialize swagger-jsdoc.
 */
const generateSwagger = () => {
	try {
		const swaggerSpec = swaggerJSDoc(swaggerOptions)
		return swaggerSpec
	} catch (err) {
		return err
	}
}
export default generateSwagger
