# Fake News Detection - Complete Backend Documentation for Frontend Development

> **Purpose**: This document provides all necessary information for AI tools or developers to build a complete frontend application that integrates with this backend.

---

## 🎯 Project Overview

**Application Name**: Fake News Detection System  
**Purpose**: A web application that allows users to submit news/claims and get AI-powered verification with community feedback.

**Core Features**:
1. User registration and authentication
2. News/claim verification using AI (Google Fact Check API, Custom Search, Gemini AI)
3. Community feedback system (like/dislike)
4. Dynamic confidence scoring (70% AI + 30% community feedback)

---

## 🌐 Server Configuration

| Property | Value |
|----------|-------|
| **Base URL** | `http://localhost:8080` |
| **API Version** | `v1` |
| **Database** | PostgreSQL |
| **Authentication** | JWT Bearer Token (HS256) |
| **Token Expiration** | 24 hours (86400000 ms) |
| **CORS** | Enabled (all origins allowed) |
| **Content-Type** | `application/json` |

---

## 🔐 Authentication & JWT Details

### Overview
The backend uses **JWT (JSON Web Token)** for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Public Endpoints (No Authentication Required)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/register` | POST | User registration |
| `/api/v1/users/login` | POST | User login |

### Protected Endpoints (JWT Required)
All other endpoints require authentication:
- `/api/v1/users/**` (except register/login)
- `/api/v1/messages/**`
- `/api/v1/feedbacks/**`

### JWT Token Details
| Property | Value |
|----------|-------|
| **Algorithm** | HS256 |
| **Token Type** | Bearer |
| **Expiration** | 24 hours (86400000 ms) |
| **Subject (sub)** | User's email address |

### How to Use JWT Token

**1. Obtain Token:**
After successful login or registration, the response includes a `token` field.

**2. Include Token in Requests:**
```http
Authorization: Bearer <your_jwt_token>
```

**3. Token Storage (Frontend):**
- Store token in `localStorage` or secure cookie
- Include token in all protected API requests
- Handle token expiration (redirect to login)

### Token Validation
- Token is validated on each request to protected endpoints
- Invalid/expired tokens return `401 Unauthorized` or `403 Forbidden`
- Token contains user's email as the subject claim

### Security Notes
- Passwords are encrypted using **BCrypt**
- Session management is **STATELESS** (no server-side sessions)
- CSRF protection is **disabled** (standard for JWT APIs)
- User identification is done via JWT token (email extracted from token)

---

## 📊 TypeScript Interfaces (For Frontend)

```typescript
// ============== USER INTERFACES ==============

interface UserRequestDTO {
  name: string;        // Required, non-empty
  email: string;       // Required, valid email format
  password: string;    // Required, non-empty
}

interface LoginRequestDTO {
  email: string;       // Required
  password: string;    // Required
}

interface UserResponseDTO {
  email: string;
  name: string;
  token?: string;    // JWT token (present only on login/register, null otherwise)
}

// ============== MESSAGE INTERFACES ==============

interface MessageRequestDTO {
  content: string;     // The news/claim text to verify
  userId: number;      // The logged-in user's ID
}

interface MessageResponseDTO {
  id: number;
  content: string;
  verdict: string;           // "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "UNVERIFIABLE" | "PENDING"
  confidence: number;        // 0-100 (dynamic: 70% AI + 30% community)
  summary: string;           // AI-generated explanation
  satisfaction: number | null;
  authorName: string;
  authorEmail: string;
  createdAt: string;         // "YYYY-MM-DD" format
  feedBackStatsDTO: FeedBackStatsDTO;
}

// ============== FEEDBACK INTERFACES ==============

interface FeedBackRequestDTO {
  userID: number;      // Note: capital 'ID'
  messageId: number;   // Note: lowercase 'id'
  liked: boolean;      // true = like, false = dislike
}

interface FeedBackResponseDTO {
  id: number;
  userId: number;
  messageId: number;
  liked: boolean;
  date: string;        // "YYYY-MM-DD" format
}

interface FeedBackStatsDTO {
  messageId: number;
  totalLikes: number;
  totalDislikes: number;
  likePercent: number; // 0-100
}
```

---

## 🚀 API Endpoints - Complete Reference

### USER APIS

#### 1. Register User
```
POST http://localhost:8080/api/v1/users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM5NTMwMDAwLCJleHAiOjE3Mzk2MTY0MDB9.xxxxx"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| email | string | User's email address |
| name | string | User's display name |
| token | string | JWT token for authentication (valid for 24 hours) |

**Error Responses:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "Email already registered" | Email exists in database |
| 400 | Validation error | Empty name/email/password or invalid email format |

**Frontend Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format (contains @)
- `password`: Required, non-empty string

**Frontend Action After Success:**
- Store JWT token in localStorage: `localStorage.setItem('token', response.token)`
- Store user data: `localStorage.setItem('user', JSON.stringify({ email: response.email, name: response.name }))`
- Auto-login user (token is already provided)
- Navigate to home/dashboard page
- Show success toast: "Registration successful!"

---

#### 2. Login User
```
POST http://localhost:8080/api/v1/users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM5NTMwMDAwLCJleHAiOjE3Mzk2MTY0MDB9.xxxxx"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| email | string | User's email address |
| name | string | User's display name |
| token | string | JWT token for authentication (valid for 24 hours) |

**Error Responses:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 401 | "Bad credentials" | Wrong email or password |
| 500 | "User not found" | Email doesn't exist |

**Frontend Action After Success:**
- Store JWT token: `localStorage.setItem('token', response.token)`
- Store user data: `localStorage.setItem('user', JSON.stringify({ email: response.email, name: response.name }))`
- Navigate to home/dashboard page

**⚠️ Important Note**: You need `userId` for some API calls. Either:
1. Call `GET /api/v1/users/{email}` with JWT token to get user details including ID, OR
2. Decode the JWT token on frontend to extract user email and use email-based lookups.

---

#### 3. Get User by Email
```
GET http://localhost:8080/api/v1/users/{email}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `email` (String) - URL encoded if contains special characters

**Example:**
```
GET http://localhost:8080/api/v1/users/john@example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200 OK):**
```json
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Response:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "User not found" | Email doesn't exist |

---

### MESSAGE APIS (Core Feature)

#### 1. Verify Message / Check Fake News
```
POST http://localhost:8080/api/v1/messages/verify
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**This is the MAIN feature of the application.**

**Request Body:**
```json
{
  "content": "COVID-19 vaccines contain microchips",
  "userId": 1
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "content": "COVID-19 vaccines contain microchips",
  "verdict": "FALSE",
  "confidence": 92,
  "summary": "This claim has been debunked by multiple fact-checking organizations including WHO and CDC. There is no scientific evidence supporting this claim. Vaccines contain mRNA or viral vector components but no electronic devices.",
  "satisfaction": null,
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "createdAt": "2026-02-14",
  "feedBackStatsDTO": {
    "messageId": 1,
    "totalLikes": 45,
    "totalDislikes": 3,
    "likePercent": 93.75
  }
}
```

**Verdict Possible Values:**
| Verdict | Meaning | Suggested UI Color |
|---------|---------|-------------------|
| `TRUE` | Claim is verified as true | Green (#22c55e) |
| `FALSE` | Claim is verified as false | Red (#ef4444) |
| `PARTIALLY_TRUE` | Claim has some truth but misleading | Yellow (#eab308) |
| `UNVERIFIABLE` | Cannot be verified | Gray (#6b7280) |
| `PENDING` | Verification in progress/failed | Blue (#3b82f6) |

**Confidence Score Calculation:**
```
Final Confidence = (AI Confidence × 0.7) + (User Like Percentage × 0.3)
```

**Error Responses:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "User not found" | Invalid userId |

**Frontend Behavior:**
- Show loading spinner while waiting (AI verification takes time)
- Display verdict with appropriate color coding
- Show confidence as progress bar (0-100%)
- Display summary in expandable section
- Show like/dislike buttons with current stats

**Caching Behavior:**
- If the same content was submitted by the same user before, returns cached result
- New submissions trigger fresh AI verification

---

#### 2. Get Message by ID
```
GET http://localhost:8080/api/v1/messages/{id}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `id` (Long) - Message ID

**Example:**
```
GET http://localhost:8080/api/v1/messages/1
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "content": "COVID-19 vaccines contain microchips",
  "verdict": "FALSE",
  "confidence": 92,
  "summary": "This claim has been debunked...",
  "satisfaction": null,
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "createdAt": "2026-02-14",
  "feedBackStatsDTO": {
    "messageId": 1,
    "totalLikes": 45,
    "totalDislikes": 3,
    "likePercent": 93.75
  }
}
```

**Error Response:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "Message not found" | Invalid message ID |

**Use Case:** Display detailed view of a previously verified claim

---

#### 3. Delete Message
```
DELETE http://localhost:8080/api/v1/messages/{id}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `id` (Long) - Message ID to delete

**Success Response (200 OK):**
```json
"Message deleted successfully"
```

**Error Response:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "Message not found" | Invalid message ID |

**Note:** This also deletes all associated feedback for the message.

---

#### 4. Get Dynamic Confidence Score
```
GET http://localhost:8080/api/v1/messages/{id}/confidence
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `id` (Long) - Message ID

**Success Response (200 OK):**
```json
85.5
```

**Response Type:** `number` (Double)

**Use Case:** Real-time confidence update without fetching full message

---

### FEEDBACK APIS

#### 1. Add or Update Feedback (Like/Dislike)
```
POST http://localhost:8080/api/v1/feedbacks/Update
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userID": 1,
  "messageId": 1,
  "liked": true
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "messageId": 1,
  "liked": true,
  "date": "2026-02-14"
}
```

**Behavior:**
- If user hasn't given feedback → Creates new feedback
- If user already gave feedback → Updates existing (like ↔ dislike toggle)

**Error Responses:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "User not found" | Invalid userId |
| 500 | "Message not found" | Invalid messageId |

**Frontend Implementation:**
```javascript
// Get token from localStorage
const token = localStorage.getItem('token');

// Like button handler
const handleLike = () => {
  fetch('http://localhost:8080/api/v1/feedbacks/Update', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userID: currentUser.id,
      messageId: messageId,
      liked: true
    })
  });
};

// Dislike button handler  
const handleDislike = () => {
  fetch('http://localhost:8080/api/v1/feedbacks/Update', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userID: currentUser.id,
      messageId: messageId,
      liked: false
    })
  });
};
```

---

#### 2. Get Feedback Statistics for Message
```
GET http://localhost:8080/api/v1/feedbacks/stats/{mgId}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `mgId` (Long) - Message ID

**Success Response (200 OK):**
```json
{
  "messageId": 1,
  "totalLikes": 45,
  "totalDislikes": 3,
  "likePercent": 93.75
}
```

**Use Case:** Display like/dislike counts and percentage bar

---

#### 3. Get All Feedbacks by User
```
GET http://localhost:8080/api/v1/feedbacks/user/{userId}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `userId` (Long) - User ID

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "messageId": 1,
    "liked": true,
    "date": "2026-02-14"
  },
  {
    "id": 2,
    "userId": 1,
    "messageId": 2,
    "liked": false,
    "date": "2026-02-13"
  }
]
```

**Use Case:** User profile page - show user's feedback history

---

#### 4. Get All Feedbacks for Message
```
GET http://localhost:8080/api/v1/feedbacks/message/{mgID}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `mgID` (Long) - Message ID

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "messageId": 1,
    "liked": true,
    "date": "2026-02-14"
  }
]
```

**Use Case:** See all users who liked/disliked a verification

---

#### 5. Delete Feedback
```
DELETE http://localhost:8080/api/v1/feedbacks/{id}
```

**🔒 Authentication Required:** Yes (JWT Bearer Token)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Path Parameter:**
- `id` (Long) - Feedback ID

**Success Response (200 OK):**
```json
"FeedBack Deleted"
```

**Error Response:**
| Status | Error Message | Cause |
|--------|---------------|-------|
| 500 | "Feedback not found" | Invalid feedback ID |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creation_date DATE NOT NULL
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, Auto-increment | Unique identifier |
| name | VARCHAR(255) | NOT NULL | User's display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| password | VARCHAR(255) | NOT NULL | BCrypt encrypted |
| creation_date | DATE | NOT NULL | Auto-set on create |

---

### Messages Table
```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  verdict VARCHAR(255),
  confidence INTEGER,
  summary TEXT,
  author_id BIGINT REFERENCES users(id),
  created_at DATE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, Auto-increment | Unique identifier |
| content | TEXT | NOT NULL | The claim/news to verify |
| verdict | VARCHAR(255) | - | TRUE/FALSE/PARTIALLY_TRUE/UNVERIFIABLE/PENDING |
| confidence | INTEGER | 0-100 | AI confidence score |
| summary | TEXT | - | AI-generated explanation |
| author_id | BIGINT | FK → users.id | Who submitted |
| created_at | DATE | - | Auto-set on create |

---

### Feedback Table
```sql
CREATE TABLE feedback (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  message_id BIGINT REFERENCES messages(id),
  liked BOOLEAN,
  date DATE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, Auto-increment | Unique identifier |
| user_id | BIGINT | FK → users.id | Who gave feedback |
| message_id | BIGINT | FK → messages.id | Which message |
| liked | BOOLEAN | - | true=like, false=dislike |
| date | DATE | - | Auto-set on create |

---

## 🔄 User Flows / Journeys

### Flow 1: New User Registration
```
1. User opens app → Registration Page
2. User fills: name, email, password
3. POST /api/v1/users/register
4. Success → Receive JWT token in response
5. Store token in localStorage: localStorage.setItem('token', response.token)
6. Store user in localStorage: { email, name }
7. Navigate to Home/Dashboard (user is already authenticated)
8. Error → Show error message
```

### Flow 2: User Login
```
1. User opens Login Page
2. User fills: email, password
3. POST /api/v1/users/login
4. Success → Receive JWT token in response
5. Store token in localStorage: localStorage.setItem('token', response.token)
6. Store user in localStorage: { email, name }
7. Redirect to Home/Dashboard
8. Error → Show "Invalid credentials"
```

### Flow 3: Verify News (Main Feature)
```
1. Check if user is logged in (token exists and not expired)
2. User enters claim/news in text area
3. Clicks "Verify" button
4. Show loading spinner
5. POST /api/v1/messages/verify (with Authorization: Bearer <token>)
6. If 401/403 → Clear token, redirect to login
7. Display results:
   - Verdict badge (colored)
   - Confidence bar
   - Summary text
   - Like/Dislike buttons
   - Feedback stats
```

### Flow 4: Give Feedback
```
1. User sees verification result
2. Clicks Like 👍 or Dislike 👎
3. POST /api/v1/feedbacks/Update (with Authorization: Bearer <token>)
4. If 401/403 → Clear token, redirect to login
5. Update UI:
   - Highlight selected button
   - Update like/dislike counts
   - Refresh confidence score
```

### Flow 5: Token Expiration Handling
```
1. Any protected API call returns 401/403
2. Clear stored token and user data
3. Show message: "Session expired. Please login again."
4. Redirect to Login Page
```

### Flow 6: Logout
```
1. User clicks "Logout" button
2. Clear token from localStorage
3. Clear user data from localStorage
4. Redirect to Login/Landing Page
```

---

## 🎨 Suggested Frontend Pages/Components

### Pages
1. **Landing Page** - App introduction, CTA to register/login
2. **Register Page** - Registration form
3. **Login Page** - Login form
4. **Home/Dashboard** - Main verification interface
5. **History Page** - User's past verifications
6. **Profile Page** - User info, feedback history

### Components
1. **Navbar** - Logo, navigation, user menu
2. **VerificationForm** - Text area + submit button
3. **ResultCard** - Displays verification result
4. **VerdictBadge** - Colored badge (TRUE/FALSE/etc)
5. **ConfidenceBar** - Progress bar 0-100%
6. **FeedbackButtons** - Like/Dislike with counts
7. **LoadingSpinner** - For async operations
8. **Toast/Alert** - Success/Error messages

---

## ⚠️ Error Handling Pattern

All errors return as RuntimeException with message in response body.

**Frontend Error Handling:**
```javascript
const apiCall = async (url, options = {}) => {
  try {
    // Add auth header for protected endpoints
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    const response = await fetch(url, { ...options, headers });
    
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    return await response.json();
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  }
};
```

**Common Error Messages:**
- "Email already registered"
- "User not found"
- "Bad credentials" (login failed)
- "Message not found"
- "Feedback not found"
- "Session expired. Please login again." (token expired/invalid)

---

## 📋 API Quick Reference Table

| # | Method | Endpoint | Auth | Request Body | Response |
|---|--------|----------|:----:|--------------|----------|
| 1 | POST | `/api/v1/users/register` | ❌ | UserRequestDTO | UserResponseDTO (with token) |
| 2 | POST | `/api/v1/users/login` | ❌ | LoginRequestDTO | UserResponseDTO (with token) |
| 3 | GET | `/api/v1/users/{email}` | ✅ | - | UserResponseDTO |
| 4 | POST | `/api/v1/messages/verify` | ✅ | MessageRequestDTO | MessageResponseDTO |
| 5 | GET | `/api/v1/messages/{id}` | ✅ | - | MessageResponseDTO |
| 6 | DELETE | `/api/v1/messages/{id}` | ✅ | - | String |
| 7 | GET | `/api/v1/messages/{id}/confidence` | ✅ | - | Double |
| 8 | POST | `/api/v1/feedbacks/Update` | ✅ | FeedBackRequestDTO | FeedBackResponseDTO |
| 9 | GET | `/api/v1/feedbacks/stats/{mgId}` | ✅ | - | FeedBackStatsDTO |
| 10 | GET | `/api/v1/feedbacks/user/{userId}` | ✅ | - | List&lt;FeedBackResponseDTO&gt; |
| 11 | GET | `/api/v1/feedbacks/message/{mgID}` | ✅ | - | List&lt;FeedBackResponseDTO&gt; |
| 12 | DELETE | `/api/v1/feedbacks/{id}` | ✅ | - | String |

**Legend:** ✅ = JWT Required, ❌ = Public Endpoint

---

## 🔗 Full URL List (Copy-Paste Ready)

```
POST   http://localhost:8080/api/v1/users/register
POST   http://localhost:8080/api/v1/users/login
GET    http://localhost:8080/api/v1/users/{email}
POST   http://localhost:8080/api/v1/messages/verify
GET    http://localhost:8080/api/v1/messages/{id}
DELETE http://localhost:8080/api/v1/messages/{id}
GET    http://localhost:8080/api/v1/messages/{id}/confidence
POST   http://localhost:8080/api/v1/feedbacks/Update
GET    http://localhost:8080/api/v1/feedbacks/stats/{mgId}
GET    http://localhost:8080/api/v1/feedbacks/user/{userId}
GET    http://localhost:8080/api/v1/feedbacks/message/{mgID}
DELETE http://localhost:8080/api/v1/feedbacks/{id}
```

---

## 📦 Sample Fetch Calls (JavaScript/React)

```javascript
const BASE_URL = 'http://localhost:8080/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// ============== PUBLIC ENDPOINTS (No Auth Required) ==============

// Register - Returns token on success, auto-stores it
const register = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  
  const data = await res.json();
  
  // Store token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name }));
  
  return data;
};

// Login - Returns token on success, auto-stores it
const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  
  const data = await res.json();
  
  // Store token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name }));
  
  return data;
};

// Logout - Clear stored data
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ============== PROTECTED ENDPOINTS (Auth Required) ==============

// Verify News (Requires JWT)
const verifyNews = async (content, userId) => {
  const res = await fetch(`${BASE_URL}/messages/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, userId })
  });
  
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  
  return res.json();
};

// Get Message by ID (Requires JWT)
const getMessage = async (messageId) => {
  const res = await fetch(`${BASE_URL}/messages/${messageId}`, {
    headers: getAuthHeaders()
  });
  
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  return res.json();
};

// Give Feedback (Requires JWT)
const giveFeedback = async (userID, messageId, liked) => {
  const res = await fetch(`${BASE_URL}/feedbacks/Update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userID, messageId, liked })
  });
  
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  return res.json();
};

// Get Feedback Stats (Requires JWT)
const getFeedbackStats = async (messageId) => {
  const res = await fetch(`${BASE_URL}/feedbacks/stats/${messageId}`, {
    headers: getAuthHeaders()
  });
  
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  return res.json();
};

// Get User by Email (Requires JWT)
const getUserByEmail = async (email) => {
  const res = await fetch(`${BASE_URL}/users/${email}`, {
    headers: getAuthHeaders()
  });
  
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  return res.json();
};

// ============== UTILITY FUNCTIONS ==============

// Check if user is logged in
const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Optionally decode and check expiration
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
```

---

## 🗺️ Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     USERS       │         │    MESSAGES     │         │    FEEDBACK     │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───┐    │ id (PK)         │◄───┐    │ id (PK)         │
│ name            │    │    │ content         │    │    │ user_id (FK)────┼──┐
│ email (UNIQUE)  │    │    │ verdict         │    │    │ message_id (FK)─┼──┼─┐
│ password        │    │    │ confidence      │    │    │ liked           │  │ │
│ creation_date   │    │    │ summary         │    │    │ date            │  │ │
└─────────────────┘    │    │ author_id (FK)──┼────┘    └─────────────────┘  │ │
                       │    │ created_at      │                              │ │
                       │    └─────────────────┘                              │ │
                       │                                                     │ │
                       └─────────────────────────────────────────────────────┘ │
                                              │                                │
                                              └────────────────────────────────┘

Relationships:
• User (1) ──────< (Many) Message      [One user can submit many messages]
• User (1) ──────< (Many) Feedback     [One user can give many feedbacks]
• Message (1) ───< (Many) Feedback     [One message can have many feedbacks]
```

---

## ⚙️ Backend Technology Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT (CSRF disabled, stateless sessions)
- **Authentication**: JWT Bearer Token (HS256)
- **Password Encryption**: BCrypt
- **External APIs**: Google Fact Check, Custom Search, Gemini AI

---

## 📝 Additional Notes for Frontend Development

### Authentication
1. **JWT Token Required**: All protected APIs require `Authorization: Bearer <token>` header
2. **Token Storage**: Store token in localStorage after login/register
3. **Token Expiration**: Tokens expire after 24 hours - handle gracefully
4. **Public Endpoints**: Only `/register` and `/login` work without token

### User Management
5. **User ID**: After login, call `GET /api/v1/users/{email}` to get user ID if needed
6. **User Data**: Store email and name from login response in localStorage

### API Behavior
7. **Real-time Updates**: Consider polling `/feedbacks/stats/{id}` for live like counts
8. **Loading States**: Verification can take 5-15 seconds (AI processing)
9. **Date Format**: All dates are in "YYYY-MM-DD" format
10. **Error Display**: Backend returns plain text error messages, display in toasts

### Security Best Practices
11. **Handle 401/403**: Clear token and redirect to login on authentication errors
12. **Token Validation**: Check token expiration before making API calls
13. **Logout**: Clear localStorage on logout to remove sensitive data

---

*Last Updated: February 15, 2026*
