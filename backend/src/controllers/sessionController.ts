import { Request, Response, NextFunction } from 'express'
import { sessionService } from '../services/sessionService.js'
import { answerService } from '../services/answerService.js'
import { AuthRequest } from '../middleware/auth.js'

class SessionController {
  async createSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, question } = req.body
      const moderatorId = req.user?.userId || 'demo-moderator'
      
      const session = await sessionService.createSession({
        title,
        question,
        moderatorId
      })

      res.status(201).json({
        success: true,
        data: {
          ...session,
          sessionId: session._id,
          moderatorName: req.user?.email || 'Demo Moderator'
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const session = await sessionService.getSession(id)

      if (!session) {
        return res.status(404).json({
          success: false,
          error: { message: 'Session not found' }
        })
      }

      res.json({
        success: true,
        data: session
      })
    } catch (error) {
      next(error)
    }
  }

  async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await sessionService.getActiveSessions()

      res.json({
        success: true,
        data: sessions
      })
    } catch (error) {
      next(error)
    }
  }

  async getAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await sessionService.getAllSessions()

      res.json({
        success: true,
        data: sessions
      })
    } catch (error) {
      next(error)
    }
  }

  async updateSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { question } = req.body
      const moderatorId = req.user?.userId

      const session = await sessionService.updateQuestion(id, question, moderatorId)

      if (!session) {
        return res.status(404).json({
          success: false,
          error: { message: 'Session not found or unauthorized' }
        })
      }

      res.json({
        success: true,
        data: session
      })
    } catch (error) {
      next(error)
    }
  }

  async endSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const moderatorId = req.user?.userId

      const session = await sessionService.endSession(id, moderatorId)

      if (!session) {
        return res.status(404).json({
          success: false,
          error: { message: 'Session not found or unauthorized' }
        })
      }

      res.json({
        success: true,
        data: session
      })
    } catch (error) {
      next(error)
    }
  }

  async getSessionStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const stats = await sessionService.getSessionStats(id)

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      next(error)
    }
  }

  async getTreeData(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const answers = await answerService.getAnswersBySession(id)

      // Format tree data for visualization
      const treeData = answers.map(answer => ({
        id: answer._id,
        text: answer.answer,
        position: answer.treePosition,
        submittedAt: answer.submittedAt
      }))

      res.json({
        success: true,
        data: treeData
      })
    } catch (error) {
      next(error)
    }
  }
}

export const sessionController = new SessionController()