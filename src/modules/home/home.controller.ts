import type { Handler } from 'express'

export const list: Handler = (req, res) => {
	res.send('list')
}
export const item: Handler = (req, res) => {
	res.send('item')
}
export const create: Handler = (req, res) => {
	res.send('create')
}
export const update: Handler = (req, res) => {
	res.send('list')
}
export const remove: Handler = (req, res) => {
	res.send('remove')
}
