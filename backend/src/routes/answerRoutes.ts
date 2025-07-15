import { Router } from 'express'
import { answerController } from '../controllers/answerController.js'
import { validateAnswer } from '../middleware/validation.js'

const router = Router()

router.post('/', validateAnswer, answerController.createAnswer)
router.get('/session/:sessionId', answerController.getAnswersBySession)
router.get('/:id', answerController.getAnswer)
router.delete('/:id', answerController.deleteAnswer)

export default router