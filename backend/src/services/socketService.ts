import { Server, Socket } from 'socket.io'
import { logger } from '../utils/logger.js'
import { sessionService } from './sessionService.js'
import { answerService } from './answerService.js'

interface JoinSessionData {
  sessionId: string
  participantId?: string
}

interface SubmitAnswerData {
  sessionId: string
  answer: string
  participantId: string
}

interface PublishQuestionData {
  sessionId: string
  question: string
}

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`New socket connection: ${socket.id}`)

    // Participant joins a session
    socket.on('participant:join', async (data: JoinSessionData) => {
      try {
        const { sessionId } = data
        socket.join(sessionId)
        
        // Notify moderator
        socket.to(sessionId).emit('participant:joined', {
          participantId: socket.id,
          joinedAt: new Date()
        })

        // Send current session state to participant
        const session = await sessionService.getSession(sessionId)
        socket.emit('session:current', session)

        // Update participant count
        const participantCount = io.sockets.adapter.rooms.get(sessionId)?.size || 0
        io.to(sessionId).emit('participant:count', participantCount)

        logger.info(`Participant ${socket.id} joined session ${sessionId}`)
      } catch (error) {
        logger.error('Error joining session:', error)
        socket.emit('error', { message: 'Failed to join session' })
      }
    })

    // Moderator starts a session
    socket.on('session:start', async (data: { title: string; question: string }) => {
      try {
        const session = await sessionService.createSession({
          title: data.title,
          question: data.question,
          moderatorId: socket.id
        })

        socket.join((session._id as string).toString())
        socket.emit('session:created', session)
        
        logger.info(`Session created: ${session._id}`)
      } catch (error) {
        logger.error('Error creating session:', error)
        socket.emit('error', { message: 'Failed to create session' })
      }
    })

    // Moderator publishes a question
    socket.on('question:publish', async (data: PublishQuestionData) => {
      try {
        const { sessionId, question } = data
        
        await sessionService.updateQuestion(sessionId, question)
        
        // Broadcast to all participants
        io.to(sessionId).emit('question:new', {
          question,
          publishedAt: new Date()
        })

        logger.info(`Question published in session ${sessionId}`)
      } catch (error) {
        logger.error('Error publishing question:', error)
        socket.emit('error', { message: 'Failed to publish question' })
      }
    })

    // Participant submits an answer
    socket.on('answer:submit', async (data: SubmitAnswerData) => {
      try {
        const answer = await answerService.createAnswer({
          sessionId: data.sessionId,
          participantId: data.participantId,
          answer: data.answer
        })

        // Calculate tree position
        const treePosition = await answerService.calculateTreePosition(
          data.sessionId,
          (answer._id as string).toString()
        )

        // Update answer with tree position
        answer.treePosition = treePosition
        await answer.save()

        // Broadcast new answer to everyone in session
        io.to(data.sessionId).emit('answer:new', {
          id: answer._id,
          text: answer.answer,
          position: treePosition,
          submittedAt: answer.submittedAt
        })

        // Emit tree update event
        io.to(data.sessionId).emit('tree:update', {
          type: 'leaf_added',
          data: {
            answerId: answer._id,
            position: treePosition
          }
        })

        logger.info(`Answer submitted in session ${data.sessionId}`)
      } catch (error) {
        logger.error('Error submitting answer:', error)
        socket.emit('error', { message: 'Failed to submit answer' })
      }
    })

    // Moderator ends a session
    socket.on('session:end', async (data: { sessionId: string }) => {
      try {
        await sessionService.endSession(data.sessionId)
        
        io.to(data.sessionId).emit('session:ended', {
          endedAt: new Date()
        })

        // Remove all sockets from room
        const sockets = await io.in(data.sessionId).allSockets()
        sockets.forEach(socketId => {
          io.sockets.sockets.get(socketId)?.leave(data.sessionId)
        })

        logger.info(`Session ended: ${data.sessionId}`)
      } catch (error) {
        logger.error('Error ending session:', error)
        socket.emit('error', { message: 'Failed to end session' })
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`)
      
      // Update participant count in all rooms this socket was in
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          const participantCount = io.sockets.adapter.rooms.get(room)?.size || 0
          io.to(room).emit('participant:count', participantCount)
        }
      })
    })
  })
}