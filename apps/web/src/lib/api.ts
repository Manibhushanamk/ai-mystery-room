import type {
  CreateCaseRequest,
  CreateCaseResponse,
  CaseStatusResponse,
  PublicCaseResponse,
  UpdatePlayerStateRequest,
  SolutionReveal,
  ListCasesResponse,
} from '@ai-mystery-room/shared';

const API_BASE = '/api/v1';
const SESSION_STORAGE_KEY = 'mystery_session_id';
const GROQ_KEY_STORAGE = 'user_groq_api_key';

export function getCustomGroqKey(): string {
  return localStorage.getItem(GROQ_KEY_STORAGE) || '';
}

export function saveCustomGroqKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem(GROQ_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GROQ_KEY_STORAGE);
  }
}

function getSessionId(): string | null {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

function saveSessionId(id: string | null) {
  if (id) {
    localStorage.setItem(SESSION_STORAGE_KEY, id);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const sessionId = getSessionId();
  if (sessionId) {
    headers.set('X-Session-ID', sessionId);
  }

  const groqKey = getCustomGroqKey();
  if (groqKey) {
    headers.set('X-Groq-API-Key', groqKey);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const newSessionId = response.headers.get('X-Session-ID');
  if (newSessionId) {
    saveSessionId(newSessionId);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.code = data?.error?.code;
    err.status = response.status;
    throw err;
  }

  return data as T;
}

export const api = {
  createCase(payload: CreateCaseRequest): Promise<CreateCaseResponse> {
    return request<CreateCaseResponse>('/cases', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getCaseStatus(caseId: string): Promise<CaseStatusResponse> {
    return request<CaseStatusResponse>(`/cases/${caseId}/status`);
  },

  getPublicCase(caseId: string): Promise<PublicCaseResponse> {
    return request<PublicCaseResponse>(`/cases/${caseId}`);
  },

  getCaseReveal(caseId: string): Promise<SolutionReveal> {
    return request<SolutionReveal>(`/cases/${caseId}/reveal`);
  },

  updatePlayerState(caseId: string, payload: UpdatePlayerStateRequest): Promise<PublicCaseResponse> {
    return request<PublicCaseResponse>(`/cases/${caseId}/player-state`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  submitAccusation(caseId: string, suspectId: string): Promise<SolutionReveal> {
    return request<SolutionReveal>(`/cases/${caseId}/accusation`, {
      method: 'POST',
      body: JSON.stringify({ suspectId }),
    });
  },

  listCases(): Promise<ListCasesResponse> {
    return request<ListCasesResponse>('/cases');
  },

  deleteCase(caseId: string): Promise<void> {
    return request<void>(`/cases/${caseId}`, {
      method: 'DELETE',
    });
  },
};
