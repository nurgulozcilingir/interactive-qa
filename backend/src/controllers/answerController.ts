import { Request, Response, NextFunction } from 'express'
import { answerService } from '../services/answerService.js'

class AnswerController {
  async createAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, answer } = req.body
      const participantId = req.headers['x-participant-id'] as string || 'demo-participant'

      const newAnswer = await answerService.createAnswer({
        sessionId,
        participantId,
        answer
      })

      // Calculate tree position
      const treePosition = await answerService.calculateTreePosition(
        sessionId,
        (newAnswer._id as string).toString()
      )

      // Update answer with tree position
      newAnswer.treePosition = treePosition
      await newAnswer.save()

      res.status(201).json({
        success: true,
        data: {
          ...newAnswer.toObject(),
          treePosition
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async getAnswersBySession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params
      const answers = await answerService.getAnswersBySession(sessionId)

      res.json({
        success: true,
        data: answers
      })
    } catch (error) {
      next(error)
    }
  }

  async getAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const answer = await answerService.getAnswerById(id)

      if (!answer) {
        return res.status(404).json({
          success: false,
          error: { message: 'Answer not found' }
        })
      }

      res.json({
        success: true,
        data: answer
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const deleted = await answerService.deleteAnswer(id)

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: { message: 'Answer not found' }
        })
      }

      res.json({
        success: true,
        message: 'Answer deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

export const answerController = new AnswerController()