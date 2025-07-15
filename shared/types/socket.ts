export interface SocketEvents {
  // Participant events
  'participant:join': { sessionId: string; participantId?: string }
  'participant:leave': { sessionId: string; participantId: string }
  
  // Session events
  'session:start': { title: string; question: string }
  'session:current': any
  'session:created': any
  'session:end': { sessionId: string }
  'session:ended': { endedAt: Date }
  
  // Question events
  'question:publish': { sessionId: string; question: string }
  'question:new': { question: string; publishedAt: Date }
  
  // Answer events
  'answer:submit': { sessionId: string; answer: string; participantId: string }
  'answer:new': any
  
  // Tree events
  'tree:update': any
  
  // General events
  'participant:count': number
  'error': { message: string }
}