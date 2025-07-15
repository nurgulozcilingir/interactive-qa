const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface CreateSessionData {
  title: string;
  question: string;
}

interface SessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    title: string;
    question: string;
    moderatorName: string;
    isActive: boolean;
    createdAt: string;
  };
}

export const sessionService = {
  async createSession(data: CreateSessionData, token: string): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create session');
    }

    return response.json();
  },

  async getActiveSessions() {
    const response = await fetch(`${API_BASE_URL}/sessions/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get active sessions');
    }

    return response.json();
  },

  async getAllSessions() {
    const response = await fetch(`${API_BASE_URL}/sessions/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get all sessions');
    }

    return response.json();
  },

  async getSession(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get session');
    }

    return response.json();
  },

  async updateSession(sessionId: string, question: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update session');
    }

    return response.json();
  },

  async endSession(sessionId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to end session');
    }

    return response.json();
  },
};