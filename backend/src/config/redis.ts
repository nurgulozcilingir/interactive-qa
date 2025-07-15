import { createClient } from 'redis'
import { logger } from '../utils/logger.js'

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err)
    })

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected')
    })

    await redisClient.connect()
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    // Don't throw error to allow app to run without Redis in development
    if (process.env.NODE_ENV === 'production') {
      throw error
    }
  }
}