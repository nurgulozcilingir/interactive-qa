import mongoose, { Schema, Document } from 'mongoose'

export interface ISession extends Document {
  title: string
  question: string
  isActive: boolean
  createdAt: Date
  endedAt?: Date
  moderatorId: string
  participantCount: number
}

const sessionSchema = new Schema<ISession>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  moderatorId: {
    type: String,
    required: true
  },
  participantCount: {
    type: Number,
    default: 0
  }
})

// Indexes
sessionSchema.index({ isActive: 1, createdAt: -1 })
sessionSchema.index({ moderatorId: 1 })

export const Session = mongoose.model<ISession>('Session', sessionSchema)