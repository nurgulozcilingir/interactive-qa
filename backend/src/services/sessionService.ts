import { Session, ISession } from '../models/Session.js'
import { Answer } from '../models/Answer.js'
import { logger } from '../utils/logger.js'

interface CreateSessionData {
  title: string
  question: string
  moderatorId: string
}

class SessionService {
  async createSession(data: CreateSessionData): Promise<ISession> {
    try {
      const session = new Session({
        title: data.title,
        question: data.question,
        moderatorId: data.moderatorId
      })
      
      await session.save()
      logger.info(`Session created: ${session._id}`)
      
      return session
    } catch (error) {
      logger.error('Error creating session:', error)
      throw error
    }
  }

  async getSession(sessionId: string): Promise<ISession | null> {
    try {
      return await Session.findById(sessionId)
    } catch (error) {
      logger.error('Error getting session:', error)
      throw error
    }
  }

  async getActiveSessions(): Promise<ISession[]> {
    try {
      return await Session.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(10)
    } catch (error) {
      logger.error('Error getting active sessions:', error)
      throw error
    }
  }

  async getAllSessions(): Promise<ISession[]> {
    try {
      return await Session.find({})
        .sort({ createdAt: -1 })
        .limit(50)
    } catch (error) {
      logger.error('Error getting all sessions:', error)
      throw error
    }
  }

  async updateQuestion(sessionId: string, question: string, moderatorId?: string): Promise<ISession | null> {
    try {
      const query = moderatorId ? { _id: sessionId, moderatorId } : { _id: sessionId }
      
      const session = await Session.findOneAndUpdate(
        query,
        { question },
        { new: true }
      )
      
      if (session) {
        logger.info(`Question updated for session: ${sessionId}`)
      }
      
      return session
    } catch (error) {
      logger.error('Error updating question:', error)
      throw error
    }
  }

  async endSession(sessionId: string, moderatorId?: string): Promise<ISession | null> {
    try {
      const query = moderatorId ? { _id: sessionId, moderatorId } : { _id: sessionId }
      
      const session = await Session.findOneAndUpdate(
        query,
        { 
          isActive: false,
          endedAt: new Date()
        },
        { new: true }
      )
      
      if (session) {
        logger.info(`Session ended: ${sessionId}`)
      }
      
      return session
    } catch (error) {
      logger.error('Error ending session:', error)
      throw error
    }
  }

  async getSessionStats(sessionId: string) {
    try {
      const answerCount = await Answer.countDocuments({ sessionId })
      const session = await Session.findById(sessionId)
      
      return {
        session,
        answerCount,
        duration: session?.endedAt 
          ? session.endedAt.getTime() - session.createdAt.getTime()
          : Date.now() - (session?.createdAt.getTime() || 0)
      }
    } catch (error) {
      logger.error('Error getting session stats:', error)
      throw error
    }
  }
}

export const sessionService = new SessionService()