import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/interactive-qa'
    
    await mongoose.connect(mongoUri)
    
    logger.info('MongoDB connected successfully')

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error)
    throw error
  }
}