// apiService.ts
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust this to your Django backend URL

// Types
export interface User {
  id: number;
  username: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  user: User;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  num_answers: number;
}

export interface Answer {
  id: number;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
  is_accepted: boolean;
  is_active: boolean;
  vote_score: number;
}

export interface CreateQuestionRequest {
  title: string;
  description: string;
  tag_names: string[];
}

export interface CreateAnswerRequest {
  content: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Auth methods
  async login(username: string, password: string): Promise<{ access: string; refresh: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await this.handleResponse<{ access: string; refresh: string }>(response);
    localStorage.setItem('token', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    return data;
  }

  async register(username: string, email: string, password: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    
    return this.handleResponse(response);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE_URL}/tags/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Tag[]>(response);
  }

  async createTag(name: string): Promise<Tag> {
    const response = await fetch(`${API_BASE_URL}/tags/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse<Tag>(response);
  }

  // Questions
  async getQuestions(tagIds?: number[]): Promise<Question[]> {
    let url = `${API_BASE_URL}/questions/`;
    if (tagIds && tagIds.length > 0) {
      url += `?tags__id=${tagIds.join(',')}`;
    }
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Question[]>(response);
  }

  async getQuestion(id: number): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Question>(response);
  }

  async createQuestion(questionData: CreateQuestionRequest): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    return this.handleResponse<Question>(response);
  }

  async updateQuestion(id: number, questionData: CreateQuestionRequest): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    return this.handleResponse<Question>(response);
  }

  async deleteQuestion(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Answers
  async getAnswers(questionId: number): Promise<Answer[]> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Answer[]>(response);
  }

  async createAnswer(questionId: number, answerData: CreateAnswerRequest): Promise<Answer> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(answerData),
    });
    return this.handleResponse<Answer>(response);
  }

  async updateAnswer(questionId: number, answerId: number, answerData: CreateAnswerRequest): Promise<Answer> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/${answerId}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(answerData),
    });
    return this.handleResponse<Answer>(response);
  }

  async deleteAnswer(questionId: number, answerId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/${answerId}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

export const apiService = new ApiService();