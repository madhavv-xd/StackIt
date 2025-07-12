# StackIt API Endpoints

This document outlines the request-response structures for the StackIt Q&A platform's API endpoints, built using Django REST Framework. These endpoints support the core features: tags, questions, answers, and voting. All endpoints assume JWT authentication (configured in the `auth` app) for write operations, with read access for Guests unless specified.

## 1. Tag List and Create Endpoint (`/api/tags/`)

### GET /api/tags/
- **Purpose**: List all tags (ID and name) for use in the question creation form’s multi-select input.
- **Access**: Guests, Users, Admins (read-only for Guests).
- **Request**:
  ```bash
  GET /api/tags/
  ```
- **Response** (200 OK):
  ```json
  [
      {
          "id": 1,
          "name": "Django"
      },
      {
          "id": 2,
          "name": "React"
      },
      {
          "id": 3,
          "name": "REST"
      }
  ]
  ```
- **Notes**: Supports pagination (configured in `settings.py` with `PAGE_SIZE=10`).

### POST /api/tags/
- **Purpose**: Create a new tag.
- **Access**: Authenticated Users and Admins.
- **Request**:
  ```bash
  POST /api/tags/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "name": "JWT"
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "id": 4,
      "name": "JWT"
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "name": ["Tag with this name already exists."]
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```

## 2. Question List and Create Endpoint (`/api/questions/`)

### GET /api/questions/
- **Purpose**: List all active questions with details (title, description, tags, etc.).
- **Access**: Guests, Users, Admins.
- **Request**:
  ```bash
  GET /api/questions/
  ```
  - Optional query parameter: `tags__id` (e.g., `/api/questions/?tags__id=1,2` to filter by tag IDs).
- **Response** (200 OK):
  ```json
  [
      {
          "id": 1,
          "title": "How to use Django REST?",
          "description": "<p>Looking for best practices...</p>",
          "user": {
              "id": 1,
              "username": "user1"
          },
          "tags": [
              {
                  "id": 1,
                  "name": "Django"
              },
              {
                  "id": 2,
                  "name": "REST"
              }
          ],
          "created_at": "2025-07-12T11:17:00Z",
          "updated_at": "2025-07-12T11:17:00Z",
          "is_active": true,
          "num_answers": 2
      }
  ]
  ```

### POST /api/questions/
- **Purpose**: Create a new question with title, description, and tag names.
- **Access**: Authenticated Users and Admins.
- **Request**:
  ```bash
  POST /api/questions/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "title": "How to use Django REST?",
      "description": "<p>Looking for best practices...</p>",
      "tag_names": ["Django", "REST"]
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "id": 1,
      "title": "How to use Django REST?",
      "description": "<p>Looking for best practices...</p>",
      "user": {
          "id": 1,
          "username": "user1"
      },
      "tags": [
          {
              "id": 1,
              "name": "Django"
          },
          {
              "id": 2,
              "name": "REST"
          }
      ],
      "created_at": "2025-07-12T11:17:00Z",
      "updated_at": "2025-07-12T11:17:00Z",
      "is_active": true,
      "num_answers": 0
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "title": ["This field is required."],
      "tag_names": ["Tag names cannot be empty."]
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```

## 3. Question Detail/Update/Delete Endpoint (`/api/questions/<id>/`)

### GET /api/questions/<id>/
- **Purpose**: Retrieve details of a specific question.
- **Access**: Guests, Users, Admins.
- **Request**:
  ```bash
  GET /api/questions/1/
  ```
- **Response** (200 OK):
  ```json
  {
      "id": 1,
      "title": "How to use Django REST?",
      "description": "<p>Looking for best practices...</p>",
      "user": {
          "id": 1,
          "username": "user1"
      },
      "tags": [
          {
              "id": 1,
              "name": "Django"
          },
          {
              "id": 2,
              "name": "REST"
          }
      ],
      "created_at": "2025-07-12T11:17:00Z",
      "updated_at": "2025-07-12T11:17:00Z",
      "is_active": true,
      "num_answers": 2
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

### PUT /api/questions/<id>/
- **Purpose**: Update a question’s title, description, or tags.
- **Access**: Question owner or Admins.
- **Request**:
  ```bash
  PUT /api/questions/1/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "title": "Updated: Django REST Best Practices",
      "description": "<p>Updated question...</p>",
      "tag_names": ["Django", "REST", "API"]
  }
  ```
- **Response** (200 OK):
  ```json
  {
      "id": 1,
      "title": "Updated: Django REST Best Practices",
      "description": "<p>Updated question...</p>",
      "user": {
          "id": 1,
          "username": "user1"
      },
      "tags": [
          {
              "id": 1,
              "name": "Django"
          },
          {
              "id": 2,
              "name": "REST"
          },
          {
              "id": 3,
              "name": "API"
          }
      ],
      "created_at": "2025-07-12T11:17:00Z",
      "updated_at": "2025-07-12T11:20:00Z",
      "is_active": true,
      "num_answers": 2
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You do not have permission to perform this action."
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "title": ["This field may not be blank."]
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

### DELETE /api/questions/<id>/
- **Purpose**: Soft-delete a question (sets `is_active=False`).
- **Access**: Question owner or Admins.
- **Request**:
  ```bash
  DELETE /api/questions/1/
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response** (204 No Content):
  ```json
  {}
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You do not have permission to perform this action."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

## 4. Answer List, Create, Update, and Delete Endpoint (`/api/questions/<question_id>/answers/`)

### GET /api/questions/<question_id>/answers/
- **Purpose**: List all active answers for a specific question.
- **Access**: Guests, Users, Admins.
- **Request**:
  ```bash
  GET /api/questions/1/answers/
  ```
- **Response** (200 OK):
  ```json
  [
      {
          "id": 1,
          "user": {
              "id": 2,
              "username": "user2"
          },
          "content": "<p>This is how you use Django REST...</p>",
          "created_at": "2025-07-12T12:00:00Z",
          "updated_at": "2025-07-12T12:00:00Z",
          "is_accepted": false,
          "is_active": true,
          "vote_score": 5
      },
      {
          "id": 2,
          "user": {
              "id": 3,
              "username": "user3"
          },
          "content": "<p>Another approach...</p>",
          "created_at": "2025-07-12T12:05:00Z",
          "updated_at": "2025-07-12T12:05:00Z",
          "is_accepted": true,
          "is_active": true,
          "vote_score": 2
      }
  ]
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

### POST /api/questions/<question_id>/answers/
- **Purpose**: Create a new answer for the specified question.
- **Access**: Authenticated Users and Admins.
- **Request**:
  ```bash
  POST /api/questions/1/answers/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "content": "<p>My answer to the question...</p>"
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "id": 3,
      "user": {
          "id": 2,
          "username": "user2"
      },
      "content": "<p>My answer to the question...</p>",
      "created_at": "2025-07-12T12:10:00Z",
      "updated_at": "2025-07-12T12:10:00Z",
      "is_accepted": false,
      "is_active": true,
      "vote_score": 0
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "content": ["Answer content cannot be empty."]
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Question does not exist or is not active."
  }
  ```

### PUT /api/questions/<question_id>/answers/<id>/
- **Purpose**: Update an answer’s content.
- **Access**: Answer owner or Admins.
- **Request**:
  ```bash
  PUT /api/questions/1/answers/2/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "content": "<p>Updated answer content...</p>"
  }
  ```
- **Response** (200 OK):
  ```json
  {
      "id": 2,
      "user": {
          "id": 3,
          "username": "user3"
      },
      "content": "<p>Updated answer content...</p>",
      "created_at": "2025-07-12T12:05:00Z",
      "updated_at": "2025-07-12T12:15:00Z",
      "is_accepted": true,
      "is_active": true,
      "vote_score": 2
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "content": ["Answer content cannot be empty."]
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You do not have permission to perform this action."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Question does not exist or is not active."
  }
  ```

### DELETE /api/questions/<question_id>/answers/<id>/
- **Purpose**: Soft-delete an answer (sets `is_active=False` and updates `num_answers` on the question).
- **Access**: Answer owner or Admins.
- **Request**:
  ```bash
  DELETE /api/questions/1/answers/2/
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response** (204 No Content):
  ```json
  {}
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You do not have permission to perform this action."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```
## 5. Question Voting Endpoint (`/api/questions/<id>/vote/`)

### POST /api/questions/<id>/vote/
- **Purpose**: Upvote (`vote_type=1`) or downvote (`vote_type=-1`) a question, updating its `vote_score`.
- **Access**: Authenticated Users and Admins.
- **Request**:
  ```bash
  POST /api/questions/1/vote/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "vote_type": 1
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "status": "Vote recorded"
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "vote_type": ["Vote type must be 1 (upvote) or -1 (downvote)."]
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You have already voted with this vote type."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

### DELETE /api/questions/<id>/vote/
- **Purpose**: Remove a user’s vote on a question, updating its `vote_score`.
- **Access**: The user who created the vote or Admins.
- **Request**:
  ```bash
  DELETE /api/questions/1/vote/
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response** (204 No Content):
  ```json
  {
      "status": "Vote removed"
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You have not voted on this question."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

## 6. Answer Voting Endpoint (`/api/questions/<question_id>/answers/<id>/vote/`)

### POST /api/questions/<question_id>/answers/<id>/vote/
- **Purpose**: Upvote (`vote_type=1`) or downvote (`vote_type=-1`) an answer, updating its `vote_score`.
- **Access**: Authenticated Users and Admins.
- **Request**:
  ```bash
  POST /api/questions/1/answers/2/vote/
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  {
      "vote_type": 1
  }
  ```
- **Response** (201 Created):
  ```json
  {
      "status": "Vote recorded"
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
      "vote_type": ["Vote type must be 1 (upvote) or -1 (downvote)."]
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You have already voted with this vote type."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```

### DELETE /api/questions/<question_id>/answers/<id>/vote/
- **Purpose**: Remove a user’s vote on an answer, updating its `vote_score`.
- **Access**: The user who created the vote or Admins.
- **Request**:
  ```bash
  DELETE /api/questions/1/answers/2/vote/
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response** (204 No Content):
  ```json
  {
      "status": "Vote removed"
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
      "detail": "Authentication credentials were not provided."
  }
  ```
- **Error Response** (403 Forbidden):
  ```json
  {
      "detail": "You have not voted on this answer."
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
      "detail": "Not found."
  }
  ```