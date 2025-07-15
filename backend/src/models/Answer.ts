import mongoose, { Schema, Document, Types } from 'mongoose'

export interface TreePosition {
  x: number
  y: number
  branch: string
  angle?: number
  depth?: number
}

export interface IAnswer extends Document {
  sessionId: Types.ObjectId
  participantId: string
  answer: string
  submittedAt: Date
  treePosition?: TreePosition
}

const treePositionSchema = new Schema<TreePosition>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  branch: { type: String, required: true },
  angle: { type: Number },
  depth: { type: Number }
}, { _id: false })

const answerSchema = new Schema<IAnswer>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  participantId: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  treePosition: {
    type: treePositionSchema
  }
})

// Indexes
answerSchema.index({ sessionId: 1, submittedAt: -1 })
answerSchema.index({ sessionId: 1, participantId: 1 })

export const Answer = mongoose.model<IAnswer>('Answer', answerSchema)