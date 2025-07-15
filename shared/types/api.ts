export interface Session {
  _id: string
  title: string
  question: string
  isActive: boolean
  createdAt: Date
  endedAt?: Date
  moderatorId: string
  participantCount: number
}

export interface Answer {
  _id: string
  sessionId: string
  participantId: string
  answer: string
  submittedAt: Date
  treePosition?: {
    x: number
    y: number
    branch: string
    angle?: number
    depth?: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    details?: any[]
  }
}