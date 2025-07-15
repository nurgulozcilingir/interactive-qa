import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IParticipant extends Document {
  sessionId: Types.ObjectId
  participantId: string
  joinedAt: Date
  leftAt?: Date
  isActive: boolean
  deviceInfo?: {
    userAgent?: string
    platform?: string
    browser?: string
  }
}

const participantSchema = new Schema<IParticipant>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  participantId: {
    type: String,
    required: true,
    unique: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  leftAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    browser: String
  }
})

// Indexes
participantSchema.index({ sessionId: 1, isActive: 1 })
participantSchema.index({ participantId: 1 })

export const Participant = mongoose.model<IParticipant>('Participant', participantSchema)