import { Router } from 'express'
import { sessionController } from '../controllers/sessionController.js'
import { validateSession } from '../middleware/validation.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Protected routes - require authentication
router.post('/', authenticate, authorize('moderator', 'admin'), validateSession, sessionController.createSession)
router.put('/:id', authenticate, authorize('moderator', 'admin'), sessionController.updateSession)
router.delete('/:id', authenticate, authorize('moderator', 'admin'), sessionController.endSession)

// Public routes - no authentication required
router.get('/active', sessionController.getActiveSessions)
router.get('/all', sessionController.getAllSessions)
router.get('/:id', sessionController.getSession)
router.get('/:id/stats', sessionController.getSessionStats)
router.get('/:id/tree', sessionController.getTreeData)

export default router