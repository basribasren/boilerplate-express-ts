import { Router } from 'express'

import home from './home/home.router'

const router = Router()

router.use('/v1/home', home)

export default router
