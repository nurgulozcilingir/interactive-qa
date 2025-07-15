import { Answer, IAnswer, TreePosition } from '../models/Answer.js'
import { logger } from '../utils/logger.js'

interface CreateAnswerData {
  sessionId: string
  participantId: string
  answer: string
}

class AnswerService {
  async createAnswer(data: CreateAnswerData): Promise<IAnswer> {
    try {
      const answer = new Answer({
        sessionId: data.sessionId,
        participantId: data.participantId,
        answer: data.answer
      })
      
      await answer.save()
      logger.info(`Answer created: ${answer._id}`)
      
      return answer
    } catch (error) {
      logger.error('Error creating answer:', error)
      throw error
    }
  }

  async getAnswersBySession(sessionId: string): Promise<IAnswer[]> {
    try {
      return await Answer.find({ sessionId })
        .sort({ submittedAt: -1 })
    } catch (error) {
      logger.error('Error getting answers:', error)
      throw error
    }
  }

  async calculateTreePosition(sessionId: string, answerId: string): Promise<TreePosition> {
    try {
      // Get total answers count for this session
      const totalAnswers = await Answer.countDocuments({ sessionId })
      
      // Calculate branch and position based on answer order
      const branches = ['left', 'center', 'right']
      const branchIndex = (totalAnswers - 1) % branches.length
      const depth = Math.floor((totalAnswers - 1) / branches.length)
      
      // Calculate position with some randomness for natural look
      const baseAngle = (branchIndex - 1) * 30 // -30, 0, 30 degrees
      const angleVariation = (Math.random() - 0.5) * 20 // ±10 degrees
      const angle = baseAngle + angleVariation
      
      // Convert angle to radians for calculation
      const radians = (angle * Math.PI) / 180
      
      // Calculate x, y position based on depth and angle
      const radius = 100 + (depth * 80) // Distance from center
      const x = radius * Math.sin(radians)
      const y = -radius * Math.cos(radians) // Negative to grow upward
      
      const position: TreePosition = {
        x,
        y,
        branch: branches[branchIndex],
        angle,
        depth
      }
      
      return position
    } catch (error) {
      logger.error('Error calculating tree position:', error)
      throw error
    }
  }

  async getAnswerById(answerId: string): Promise<IAnswer | null> {
    try {
      return await Answer.findById(answerId)
    } catch (error) {
      logger.error('Error getting answer by id:', error)
      throw error
    }
  }

  async deleteAnswer(answerId: string): Promise<boolean> {
    try {
      const result = await Answer.deleteOne({ _id: answerId })
      return result.deletedCount > 0
    } catch (error) {
      logger.error('Error deleting answer:', error)
      throw error
    }
  }
}

export const answerService = new AnswerService()