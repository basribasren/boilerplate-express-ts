import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Boom from '@hapi/boom'

// Common error handler function
const handleEncryptionError = (err: unknown, message: string): never => {
	if (err instanceof Error) {
		// If the error doesn't have a Boom status code, set it to 409
		if (!(err as Boom.Boom).isBoom) {
			throw Boom.boomify(err, { statusCode: 409 })
		}
		throw err
	}
	throw Boom.boomify(new Error(message), { statusCode: 500 })
}

// Function to hash password
export const encryptPassword = async (password: string) => {
	try {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)
		return hashedPassword
	} catch (err: unknown) {
		handleEncryptionError(err, 'An unknown error while encrypting the password')
	}
}

// Function to verify password
export const verifyPassword = async (pass: string, hased: string) => {
	try {
		const match = await bcrypt.compare(pass, hased)
		return match
	} catch (err: unknown) {
		handleEncryptionError(err, 'An unknown error while compare the password')
	}
}

// Define the User interface based on the structure of the user object you expect
interface User {
	id: number
	username: string
	email: string
	// Add other user fields if needed
}

// Define the payload interface for the JWT
interface JwtPayload {
	user: User
}

// Function to generate a token
export const generateToken = (user: User): string => {
	const token = jwt.sign({ user }, process.env.SECRET as string, {
		expiresIn: '7d',
	})
	return token
}

// Function to verify the token
export const verifyToken = (token: string) => {
	try {
		const user = jwt.verify(token, process.env.SECRET as string) as JwtPayload
		return user
	} catch (err: unknown) {
		handleEncryptionError(err, 'An unknown error while verify token')
	}
}
