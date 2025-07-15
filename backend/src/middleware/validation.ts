import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const validateSession = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('question')
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Question must be between 5 and 500 characters'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      })
    }
    next()
  }
]

export const validateAnswer = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required')
    .isMongoId()
    .withMessage('Invalid session ID format'),
  
  body('answer')
    .notEmpty()
    .withMessage('Answer is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Answer must be between 1 and 1000 characters'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      })
    }
    next()
  }
]