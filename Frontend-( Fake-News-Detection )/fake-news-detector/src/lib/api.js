const BASE_URL = 'http://localhost:8080/api/v1';

// Helper to get auth headers - reads token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Auth header token:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');
  return headers;
};

// Helper to handle auth errors
const handleAuthError = (response) => {
  if (response.status === 401 || response.status === 403) {
    console.log('Auth error - clearing token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    // Don't redirect automatically - let the component handle it
  }
};

// ============== USER APIs ==============

/**
 * Register a new user
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{email: string, name: string}>}
 */
export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Registration failed');
  }
  
  return res.json();
}

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{email: string, name: string, token?: string}>}
 */
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Login failed');
  }
  
  const data = await res.json();
  console.log('Login response from backend:', data);
  return data;
}

/**
 * Get user by email (to fetch userId)
 * @param {string} email 
 * @returns {Promise<{email: string, name: string}>}
 */
export async function getUserByEmail(email) {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}`, {
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'User not found');
  }
  
  return res.json();
}

// ============== MESSAGE APIs ==============

/**
 * Verify a news claim (Main Feature)
 * @param {string} content - The news/claim to verify
 * @param {number} userId - The logged-in user's ID
 * @returns {Promise<MessageResponseDTO>}
 */
export async function verifyMessage(content, userId) {
  const requestBody = { content, userId };
  console.log('Sending verify request:', JSON.stringify(requestBody, null, 2));
  
  const res = await fetch(`${BASE_URL}/messages/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody)
  });
  
  console.log('Response status:', res.status);
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Error response:', errorText);
    throw new Error(errorText || 'Verification failed');
  }
  
  return res.json();
}

/**
 * Get message by ID
 * @param {number} id 
 * @returns {Promise<MessageResponseDTO>}
 */
export async function getMessageById(id) {
  const res = await fetch(`${BASE_URL}/messages/${id}`, {
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Message not found');
  }
  
  return res.json();
}

/**
 * Delete message by ID
 * @param {number} id 
 * @returns {Promise<string>}
 */
export async function deleteMessage(id) {
  const res = await fetch(`${BASE_URL}/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Delete failed');
  }
  
  return res.text();
}

/**
 * Get dynamic confidence score
 * @param {number} id - Message ID
 * @returns {Promise<number>}
 */
export async function getConfidenceScore(id) {
  const res = await fetch(`${BASE_URL}/messages/${id}/confidence`, {
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to get confidence');
  }
  
  return res.json();
}

// ============== FEEDBACK APIs ==============

/**
 * Add or update feedback (like/dislike)
 * @param {number} userID - User ID (note: capital ID)
 * @param {number} messageId - Message ID
 * @param {boolean} liked - true for like, false for dislike
 * @returns {Promise<FeedBackResponseDTO>}
 */
export async function updateFeedback(userID, messageId, liked) {
  const res = await fetch(`${BASE_URL}/feedbacks/Update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userID, messageId, liked })
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Feedback update failed');
  }
  
  return res.json();
}

/**
 * Get feedback statistics for a message
 * @param {number} messageId 
 * @returns {Promise<FeedBackStatsDTO>}
 */
export async function getFeedbackStats(messageId) {
  const res = await fetch(`${BASE_URL}/feedbacks/stats/${messageId}`, {
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to get stats');
  }
  
  return res.json();
}

/**
 * Get all feedbacks by user
 * @param {number} userId 
 * @returns {Promise<FeedBackResponseDTO[]>}
 */
export async function getFeedbacksByUser(userId) {
  const res = await fetch(`${BASE_URL}/feedbacks/user/${userId}`, {
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to get user feedbacks');
  }
  
  return res.json();
}

/**
 * Get all feedbacks for a message
 * @param {number} messageId 
 * @returns {Promise<FeedBackResponseDTO[]>}
 */
export async function getFeedbacksByMessage(messageId) {
  const res = await fetch(`${BASE_URL}/feedbacks/message/${messageId}`, {
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to get message feedbacks');
  }
  
  return res.json();
}

/**
 * Delete feedback by ID
 * @param {number} id 
 * @returns {Promise<string>}
 */
export async function deleteFeedback(id) {
  const res = await fetch(`${BASE_URL}/feedbacks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  handleAuthError(res);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Delete failed');
  }
  
  return res.text();
}
