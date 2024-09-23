import { Router } from 'express'
import * as homeController from './home.controller'

const router = Router()

// GET /api/home
router.get('/list', homeController.list)
// GET /api/home/:id
router.get('/item/:id', homeController.item)
// POST /api/home/add
router.post('/add', homeController.create)
// PUT /api/home/:id/update
router.put('/update/:id', homeController.update)
// DELETE /api/home/:id/delete
router.delete('/delete/:id', homeController.remove)

export default router
