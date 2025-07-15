import { Router } from 'express'
import sessionRoutes from './sessionRoutes.js'
import answerRoutes from './answerRoutes.js'
import authRoutes from './auth.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/sessions', sessionRoutes)
router.use('/answers', answerRoutes)

export default router