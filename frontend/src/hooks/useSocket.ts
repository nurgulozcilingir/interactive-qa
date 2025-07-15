import { useEffect, useCallback } from 'react'
import socketService from '@/services/socket'
import type { Socket } from 'socket.io-client'

interface UseSocketOptions {
  sessionId?: string
  autoConnect?: boolean
}

export function useSocket(options: UseSocketOptions = {}) {
  const { sessionId, autoConnect = true } = options

  useEffect(() => {
    if (autoConnect) {
      socketService.connect(sessionId)
    }

    return () => {
      if (autoConnect) {
        socketService.disconnect()
      }
    }
  }, [sessionId, autoConnect])

  const emit = useCallback((event: string, data: any) => {
    socketService.emit(event, data)
  }, [])

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketService.on(event, callback)
    
    return () => {
      socketService.off(event, callback)
    }
  }, [])

  const getSocket = useCallback((): Socket | null => {
    return socketService.getSocket()
  }, [])

  return {
    socket: getSocket(),
    emit,
    on,
    connected: getSocket()?.connected || false,
  }
}