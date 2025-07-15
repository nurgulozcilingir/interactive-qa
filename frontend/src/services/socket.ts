import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  connect(sessionId?: string): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    const url = import.meta.env.VITE_SOCKET_URL || window.location.origin
    
    this.socket = io(url, {
      transports: ['websocket'],
      query: sessionId ? { sessionId } : undefined,
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export const socketService = new SocketService()
export default socketService