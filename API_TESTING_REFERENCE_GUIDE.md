# 📚 Postman Clone - Complete Reference Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & How It Works](#architecture--how-it-works)
3. [Getting Started](#getting-started)
4. [Step-by-Step Usage Guide](#step-by-step-usage-guide)
5. [Testing Localhost APIs](#testing-localhost-apis)
6. [Testing Deployed APIs](#testing-deployed-apis)
7. [Using Environments](#using-environments)
8. [Code Structure Reference](#code-structure-reference)
9. [Common Workflows](#common-workflows)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is This Project?

**Postman Clone** is a modern, open-source REST API testing client built with:
- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL with Prisma ORM
- **State Management:** Zustand
- **UI Library:** shadcn/ui + TailwindCSS
- **HTTP Client:** Axios

### Key Features

✨ **REST API Client**
- Send HTTP requests (GET, POST, PUT, DELETE, PATCH)
- Manage request parameters, headers, and body
- Response viewer with formatted JSON
- Track response time, size, and status code
- Request history & persistence

✨ **Collections & Organization**
- Save requests into collections
- Organize by workspace
- Request history tracking
- Response caching

✨ **Workspace & Collaboration**
- Create multiple workspaces
- Invite team members via links
- Role-based access (Admin, Member)
- Real-time collaboration ready

✨ **Additional Features**
- Monaco Editor for raw request body editing
- WebSocket support (ws:// and wss://)
- JSON pretty-print & validation
- Environment variables support
- Persistent state management

---

## Architecture & How It Works

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Request Playground Component                 │  │
│  │  - URL Input Bar (Method + URL)                      │  │
│  │  - Parameters, Headers, Body Tabs                    │  │
│  │  - Send Button                                       │  │
│  │  - Response Viewer                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Zustand State Store (useRequestStore)            │  │
│  │  - Active Tab Management                             │  │
│  │  - Request Data (URL, headers, body, etc.)           │  │
│  │  - Response Data                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER ACTIONS (Backend)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  sendRequest() - Main HTTP Request Handler           │  │
│  │  ✓ Takes: method, URL, headers, params, body        │  │
│  │  ✓ Uses Axios to make HTTP call                      │  │
│  │  ✓ Captures: status, headers, body, duration        │  │
│  │  ✓ Returns: response data                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  run() - Execute Saved Request                       │  │
│  │  ✓ Fetch request from DB                             │  │
│  │  ✓ Call sendRequest()                                │  │
│  │  ✓ Save result to RequestRun table                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collection Functions                                │  │
│  │  ✓ addRequestToCollection()                          │  │
│  │  ✓ getAllRequestFromCollection()                     │  │
│  │  ✓ saveRequest()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            DATABASE (PostgreSQL + Prisma)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - User (Authentication)                             │  │
│  │  - Workspace (Teams)                                 │  │
│  │  - Collection (Request Groups)                       │  │
│  │  - Request (Saved API Calls)                         │  │
│  │  - RequestRun (Execution History)                    │  │
│  │  - Environment (Variables)                           │  │
│  │  - WebSocketPreset (WS Connections)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         TARGET API SERVERS (Any Server/URL)                 │
│                                                             │
│  ✓ Localhost APIs (http://localhost:3000)                   │
│  ✓ Deployed APIs (https://api.example.com)                  │
│  ✓ Public APIs (https://api.github.com)                     │
│  ✓ External Services (Any HTTP endpoint)                    │
└─────────────────────────────────────────────────────────────┘
```

### Request Execution Flow (Step-by-Step)

```
1. User Types URL + Selects Method
   ↓
2. User Clicks "Send" Button
   ↓
3. Frontend Calls useRunRequest() Hook
   ↓
4. Hook Calls Server Action: run(requestId)
   ↓
5. Server Fetches Request from Database
   ↓
6. Server Action Calls sendRequest() Function
   ↓
7. Axios Makes HTTP Request to Target URL
   ↓
8. Server Captures Response:
   - Status Code
   - Headers
   - Body
   - Duration
   - Size
   ↓
9. Server Saves RequestRun Record to Database
   ↓
10. Response Returned to Frontend
   ↓
11. Frontend Updates Zustand Store with Response
   ↓
12. Response Viewer Re-renders with Result
```

### Database Models & Relationships

```
User
├── Workspaces (owns)
├── WorkspaceMemberships
├── Sessions
└── Accounts (GitHub, Google, etc.)

Workspace
├── Collections
│   └── Requests (stored)
│       └── RequestRuns (history)
├── Environments (variables)
├── Members
├── WebSocketPresets
└── Invites

Request
├── Method (GET, POST, PUT, DELETE)
├── URL
├── Headers (JSON)
├── Parameters (JSON)
├── Body (JSON/text)
├── Response (cached)
└── RequestRuns (execution history)

RequestRun
├── Status Code
├── Status Text
├── Headers
├── Body
└── DurationMs (response time)

Environment
└── Variables (JSON key-value pairs)
```

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker installed (for PostgreSQL)
- Git installed
- GitHub or Google OAuth credentials (for auth)

### Installation & Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/lax56237/postman.git
cd postman-clone
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (GitHub)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OAuth Providers (Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Service (Optional - for future AI features)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"
```

#### Step 4: Setup Database

```bash
# Run Prisma migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npx prisma db seed
```

#### Step 5: Start the Application

```bash
npm run dev
```

This command:
- Starts PostgreSQL container via Docker Compose
- Starts Next.js dev server with Turbopack
- Application runs on **http://localhost:3000**

```
✓ Listening on http://localhost:3000
✓ Database ready on localhost:5432
✓ Ready for API testing!
```

---

## Step-by-Step Usage Guide

### UI Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     POSTMAN CLONE                           │
├─────────────────────────────────────────────────────────────┤
│  Sidebar  │                                                  │
│           │  ┌──────────────────────────────────────────┐   │
│ Workspace │  │  Request Bar                             │   │
│ Collections│ │  [Method ▼] [URL Input............] [Send]   │
│           │  └──────────────────────────────────────────┘   │
│ + New     │  ┌──────────────────────────────────────────┐   │
│           │  │ Tabs: Parameters | Headers | Body        │   │
│ Collections│ ├──────────────────────────────────────────┤   │
│ - APIs    │  │ Key-Value Editor or JSON Editor          │   │
│   - Users │  │                                          │   │
│   - Auth  │  │                                          │   │
│           │  └──────────────────────────────────────────┘   │
│           │  ┌──────────────────────────────────────────┐   │
│           │  │ Response Viewer                          │   │
│           │  │ Status: 200 OK                           │   │
│           │  │ Time: 245ms | Size: 1.2KB               │   │
│           │  │ [Response JSON/Text Here]                │   │
│           │  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Basic Workflow: Create & Send Your First Request

#### Phase 1: Authentication (First Time)

1. **Open Application**
   - Navigate to http://localhost:3000
   - Click "Sign In"

2. **Choose Authentication Method**
   - Click "Continue with GitHub" or "Continue with Google"
   - Authorize the application
   - You're redirected back to the app

3. **Home Page**
   ```
   "Welcome, [Your Name]!"
   - Click "Create Workspace" or "Join Workspace"
   ```

#### Phase 2: Create Workspace & Collection

1. **Create Workspace**
   ```
   Click "New Workspace" Button
   ↓
   Enter Details:
   - Name: "My API Testing"
   - Description: "Testing REST APIs locally"
   ↓
   Click "Create"
   ```

2. **Your Workspace is Created**
   ```
   Sidebar now shows:
   
   📁 My API Testing (Workspace)
   ├── ➕ New Collection
   └── Collections
       └── (empty)
   ```

3. **Create Collection**
   ```
   Click "New Collection" in sidebar
   ↓
   Enter Collection Name: "User Management"
   ↓
   Click "Create"
   ```

4. **Collection Ready**
   ```
   Sidebar now shows:
   
   📁 My API Testing
   └── Collections
       └── User Management
           └── (no requests yet)
   ```

#### Phase 3: Create & Send First Request

1. **Start New Request**
   ```
   In Main Editor Area:
   - You see "Create New Request" or empty state
   - Click "New Request" or Press Ctrl+Shift+N
   ```

2. **Edit Request - Request Bar**
   ```
   ┌─────────────────────────────────────────────────┐
   │ REQUEST BAR                                     │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │  Method:  [GET ▼]  (dropdown menu)             │
   │  URL:     [http://localhost:3000/api/users   ] │
   │                                         [Send] │
   │                                                 │
   └─────────────────────────────────────────────────┘
   
   How to fill:
   1. Click on Method Dropdown → Select "GET"
   2. Click URL Input → Type "http://localhost:4000/api/users"
   3. Click "Send" Button
   ```

3. **Edit Headers (if needed)**
   ```
   ┌──────────────────────────────────┐
   │ Headers Tab                      │
   ├──────────────────────────────────┤
   │                                  │
   │ Key              │ Value         │
   │ ─────────────────┼──────────────│
   │ Content-Type     │ application/json
   │ Authorization    │ Bearer token123
   │ [+ Add Header]   │              │
   │                                  │
   └──────────────────────────────────┘
   ```

4. **Add URL Parameters (if needed)**
   ```
   ┌──────────────────────────────────┐
   │ Parameters Tab                   │
   ├──────────────────────────────────┤
   │                                  │
   │ Key      │ Value                 │
   │ ─────────┼────────────────────── │
   │ page     │ 1                     │
   │ limit    │ 10                    │
   │ search   │ john                  │
   │ [+ Add]  │                       │
   │                                  │
   └──────────────────────────────────┘
   
   Results in URL:
   GET http://localhost:4000/api/users?page=1&limit=10&search=john
   ```

5. **Add Request Body (for POST/PUT)**
   ```
   ┌───────────────────────────────────────┐
   │ Body Tab                              │
   ├───────────────────────────────────────┤
   │                                       │
   │ Raw JSON Editor (Monaco Editor)       │
   │ ┌─────────────────────────────────┐  │
   │ │ {                               │  │
   │ │   "name": "John Doe",           │  │
   │ │   "email": "john@example.com",  │  │
   │ │   "age": 28                     │  │
   │ │ }                               │  │
   │ └─────────────────────────────────┘  │
   │                                       │
   │ [Pretty Print] [Validate JSON]        │
   │                                       │
   └───────────────────────────────────────┘
   ```

6. **Send Request**
   ```
   Click "Send" Button or Press Ctrl+Enter
   ↓
   Loading indicator appears
   ↓
   Response appears below
   ```

#### Phase 4: View Response

```
┌───────────────────────────────────────────────┐
│ RESPONSE VIEWER                               │
├───────────────────────────────────────────────┤
│                                               │
│ Status: ✓ 200 OK                             │
│ Time: 245 ms                                  │
│ Size: 1.2 KB                                  │
│                                               │
│ Headers Tab | Body Tab | Pretty Print         │
│ ───────────────────────────────────────────── │
│ {                                             │
│   "id": 1,                                    │
│   "name": "John Doe",                         │
│   "email": "john@example.com",                │
│   "createdAt": "2024-05-06T10:30:00Z"         │
│ }                                             │
│                                               │
│ [Copy Response] [Download] [Share]            │
│                                               │
└───────────────────────────────────────────────┘
```

#### Phase 5: Save Request to Collection

1. **Save Request**
   ```
   Press Ctrl+S
   or
   Right-click on tab → "Save Request"
   ```

2. **Save Dialog Appears**
   ```
   ┌──────────────────────────────────┐
   │ Save Request to Collection       │
   ├──────────────────────────────────┤
   │                                  │
   │ Request Name:                    │
   │ [Get All Users..................] │
   │                                  │
   │ Select Collection:               │
   │ [User Management ▼]              │
   │                                  │
   │         [Save] [Cancel]          │
   │                                  │
   └──────────────────────────────────┘
   ```

3. **Request Saved**
   ```
   Sidebar now shows:
   
   📁 My API Testing
   └── Collections
       └── User Management
           └── Get All Users  ✓ (Saved)
   ```

4. **Reuse Saved Request**
   ```
   Click "Get All Users" in sidebar
   ↓
   Request loads with all details
   ↓
   Click "Send" to execute again
   ↓
   Previous response appears below
   ```

---

## Testing Localhost APIs

### Common Scenario: Testing Local Node.js/Express Server

#### Setup Local API Server

1. **Create Test API (Node.js Express)**

```bash
# Create new folder
mkdir my-api
cd my-api
npm init -y
npm install express
```

Create `server.js`:
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// GET all users
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]);
});

// POST create user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 3, name, email });
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
```

Start server:
```bash
node server.js
# ✓ Server running on http://localhost:4000
```

#### Test GET Endpoint

1. **Create Request in Postman Clone**
   ```
   Click "New Request" (Ctrl+Shift+N)
   ```

2. **Fill Request Details**
   ```
   Request Bar:
   - Method: GET
   - URL: http://localhost:4000/api/users
   
   Headers: (none needed)
   
   Parameters: (none needed)
   ```

3. **Send Request**
   ```
   Click "Send"
   ```

4. **View Response**
   ```
   Status: ✓ 200 OK
   Time: 45 ms
   
   Response Body:
   [
     { "id": 1, "name": "John", "email": "john@example.com" },
     { "id": 2, "name": "Jane", "email": "jane@example.com" }
   ]
   ```

#### Test POST Endpoint

1. **Create Request**
   ```
   Click "New Request"
   ```

2. **Fill Request Details**
   ```
   Request Bar:
   - Method: POST
   - URL: http://localhost:4000/api/users
   
   Headers Tab:
   - Key: Content-Type
   - Value: application/json
   
   Body Tab:
   {
     "name": "Alice",
     "email": "alice@example.com"
   }
   ```

3. **Send Request**
   ```
   Click "Send"
   ```

4. **View Response**
   ```
   Status: ✓ 201 Created
   Time: 52 ms
   
   Response Body:
   {
     "id": 3,
     "name": "Alice",
     "email": "alice@example.com"
   }
   ```

#### Test with Query Parameters

1. **Create Request**
   ```
   Click "New Request"
   ```

2. **Fill Request Details**
   ```
   Request Bar:
   - Method: GET
   - URL: http://localhost:4000/api/users
   
   Parameters Tab:
   - Key: page
     Value: 1
   - Key: limit
     Value: 10
   ```

3. **Send Request**
   ```
   Click "Send"
   
   Final URL sent:
   http://localhost:4000/api/users?page=1&limit=10
   ```

---

## Testing Deployed APIs

### Common Scenario: Testing Public API (GitHub API)

#### Without Authentication

1. **Create Request**
   ```
   Click "New Request"
   ```

2. **Fill Request Details**
   ```
   Request Bar:
   - Method: GET
   - URL: https://api.github.com/users/github
   
   Headers: (none needed)
   
   Parameters: (none needed)
   ```

3. **Send Request**
   ```
   Click "Send"
   ```

4. **View Response**
   ```
   Status: ✓ 200 OK
   Time: 320 ms
   
   Response Body:
   {
     "login": "github",
     "id": 1,
     "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
     "type": "Organization",
     "name": "GitHub",
     "company": null,
     "blog": "https://github.com",
     "location": "San Francisco",
     ...
   }
   ```

#### With Authentication (Bearer Token)

1. **Create Request**
   ```
   Click "New Request"
   ```

2. **Fill Request Details**
   ```
   Request Bar:
   - Method: GET
   - URL: https://api.github.com/user
   
   Headers Tab:
   - Key: Authorization
     Value: Bearer YOUR_GITHUB_TOKEN
   - Key: Accept
     Value: application/vnd.github+json
   ```

3. **Send Request**
   ```
   Click "Send"
   ```

4. **View Response**
   ```
   Status: ✓ 200 OK
   
   Response Body:
   {
     "login": "your-username",
     "id": 12345,
     "avatar_url": "...",
     "public_repos": 10,
     ...
   }
   ```

#### Multiple Deployed API Examples

**Example 1: JSONPlaceholder (Free Public API)**
```
GET https://jsonplaceholder.typicode.com/posts/1

Response:
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident...",
  "body": "quia et suscipit..."
}
```

**Example 2: OpenWeather API**
```
GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY

Response:
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [ { "main": "Clouds" } ],
  "main": { "temp": 285.55, "humidity": 72 },
  "name": "London"
}
```

**Example 3: Stripe API (with authentication)**
```
GET https://api.stripe.com/v1/customers

Headers:
- Authorization: Bearer sk_test_YOUR_API_KEY
- Content-Type: application/x-www-form-urlencoded

Response:
{
  "object": "list",
  "data": [ ... ],
  "has_more": false
}
```

---

## Using Environments

### What are Environments?

Environments allow you to:
- 🔄 Switch between localhost and production APIs without changing requests
- 📦 Store common variables (BASE_URL, API_KEY, tokens)
- 🔐 Keep sensitive data centralized
- 👥 Share across team members in workspace

### Database Models (Environments)

From Prisma schema:
```prisma
model Environment {
  id          String     @id @default(cuid())
  name        String
  values      Json       // e.g. { "BASE_URL": "https://api.example.com" }
  workspaceId String
  workspace   Workspace  @relation(fields: [workspaceId], references: [id])
}
```

### How to Create & Use Environments

#### Step 1: Create Local Environment

1. **Go to Workspace Settings**
   ```
   Click on Workspace Name → Settings
   ```

2. **Create Environment**
   ```
   Click "New Environment"
   ```

3. **Add Details**
   ```
   Environment Name: "Local"
   
   Variables (JSON Format):
   {
     "BASE_URL": "http://localhost:4000",
     "API_KEY": "local-test-key-123",
     "AUTH_TOKEN": "Bearer local-token"
   }
   ```

4. **Save**
   ```
   Click "Save Environment"
   ```

#### Step 2: Create Production Environment

1. **Create Another Environment**
   ```
   Click "New Environment"
   ```

2. **Add Details**
   ```
   Environment Name: "Production"
   
   Variables (JSON Format):
   {
     "BASE_URL": "https://api.example.com",
     "API_KEY": "prod-api-key-xyz",
     "AUTH_TOKEN": "Bearer prod-token-secure"
   }
   ```

3. **Save**
   ```
   Click "Save Environment"
   ```

#### Step 3: Use Environment Variables in Requests

> **Note:** Currently, variable substitution (using {{VAR}}) is stored in the database but not fully implemented in the UI. Here's how it should work:

**Future Implementation (not yet active):**
```
Request URL with Variables:
{{BASE_URL}}/api/users

Headers:
- Authorization: {{AUTH_TOKEN}}
- X-API-Key: {{API_KEY}}

Body:
{
  "apiKey": "{{API_KEY}}"
}
```

**Current Workaround:**
Manually paste the values:
```
Request URL:
http://localhost:4000/api/users

or

https://api.example.com/api/users
```

### To Implement Environment Variables (Development)

Edit file: `src/modules/request/actions/index.ts`

Add this function:
```typescript
function substituteEnvironmentVariables(
  text: string, 
  environmentVars: Record<string, string>
): string {
  let result = text;
  Object.entries(environmentVars).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });
  return result;
}

export async function sendRequest(req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  environmentVars?: Record<string, string>;
}) {
  // Substitute variables in URL
  const finalUrl = substituteEnvironmentVariables(req.url, req.environmentVars || {});
  
  // Substitute variables in headers
  const finalHeaders = req.headers 
    ? Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [
          k, 
          substituteEnvironmentVariables(v, req.environmentVars || {})
        ])
      )
    : undefined;

  const config: AxiosRequestConfig = {
    method: req.method,
    url: finalUrl,  // Use substituted URL
    headers: finalHeaders,  // Use substituted headers
    // ... rest of config
  };

  // ... rest of function
}
```

---

## Code Structure Reference

### Directory Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx (Root layout)
│   ├── (auth)/
│   │   ├── sign-in/ (Login page)
│   │   └── layout.tsx
│   ├── (workspace)/
│   │   ├── page.tsx (Main workspace)
│   │   ├── layout.tsx
│   │   └── realtime/ (WebSocket)
│   └── api/
│       ├── auth/ (Authentication endpoints)
│       └── ai/ (AI features)
│
├── components/
│   ├── ui/ (shadcn/ui components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── theme-provider.tsx
│   ├── query-provider.tsx
│   └── hot-key-provider.tsx
│
├── modules/
│   ├── request/
│   │   ├── actions/index.ts (★ Main request logic)
│   │   ├── components/
│   │   │   ├── request-bar.tsx (URL + Method)
│   │   │   ├── request-editor.tsx (Main editor)
│   │   │   ├── request-editor-area.tsx (Tabs)
│   │   │   ├── key-value-form.tsx (Headers/Params)
│   │   │   ├── body-editor.tsx (Request body)
│   │   │   ├── response-viewer.tsx (Response display)
│   │   │   ├── tab-bar.tsx (Tab management)
│   │   │   └── request-playground.tsx (Main container)
│   │   ├── hooks/
│   │   │   ├── request.ts (React Query hooks)
│   │   │   └── use-debounce.ts
│   │   └── store/
│   │       └── useRequestStore.ts (Zustand state)
│   │
│   ├── collections/
│   │   ├── actions/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   │
│   ├── workspace/
│   ├── authentication/
│   ├── invites/
│   ├── realtime/ (WebSocket)
│   └── ai/ (AI features)
│
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts (Authentication logic)
│   ├── auth-client.ts (Client-side auth)
│   ├── env.ts (Environment variables)
│   └── utils.ts (Utilities)
│
└── hooks/
    └── use-mobile.ts
```

### Key Files Explained

#### 1. `src/modules/request/actions/index.ts` (★ Most Important)

**Purpose:** Server actions that handle HTTP requests

**Key Functions:**

```typescript
// Main function to send HTTP request
export async function sendRequest(req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
})
// Returns: { status, statusText, headers, data, duration, size }

// Execute saved request and save to database
export async function run(requestId: string)
// Returns: { success, requestRun, result }

// Save request to collection
export async function addRequestToCollection(collectionId: string, value: Request)
// Returns: Saved request object

// Fetch all requests in collection
export async function getAllRequestFromCollection(collectionId: string)
// Returns: Array of requests

// Update saved request
export async function saveRequest(id: string, value: Request)
// Returns: Updated request object
```

#### 2. `src/modules/request/store/useRequestStore.ts`

**Purpose:** Zustand state management for request playground

**State:**
```typescript
tabs: RequestTab[]              // Array of open request tabs
activeTabId: string | null      // Currently active tab
responseViewerData: ResponseData | null  // Last response
```

**Methods:**
```typescript
addTab()                        // Create new request tab
closeTab(id)                    // Close tab
setActiveTab(id)                // Switch active tab
updateTab(id, data)             // Update tab data (URL, headers, etc.)
setResponseViewerData(data)     // Display response
```

#### 3. `src/modules/request/components/request-bar.tsx`

**Purpose:** Top bar with Method selector and URL input

**UI Elements:**
- Method dropdown (GET, POST, PUT, DELETE)
- URL input field
- Send button

**Handlers:**
```typescript
onSendRequest()  // Call useRunRequest hook
```

#### 4. `src/modules/request/components/request-editor-area.tsx`

**Purpose:** Tabbed editor for Parameters, Headers, Body

**Tabs:**
- **Parameters:** URL query parameters
- **Headers:** HTTP headers
- **Body:** Request body (JSON/text)

**Features:**
- Key-value form with add/remove rows
- Enable/disable individual items
- Toast notifications

#### 5. `src/modules/request/hooks/request.ts`

**Purpose:** React Query hooks for data fetching and mutations

**Key Hooks:**
```typescript
useAddRequestToCollection(collectionId)
// Mutation: POST request to collection

useGetAllRequestFromCollection(collectionId)
// Query: Fetch all requests in collection

useSaveRequest(id)
// Mutation: UPDATE existing request

useRunRequest(requestId)
// Mutation: Execute request and save result
```

#### 6. `prisma/schema.prisma` (Database Schema)

**Key Models:**
```prisma
model Request {
  id              String      @id @default(cuid())
  name            String
  method          REST_METHOD // GET, POST, PUT, DELETE
  url             String
  parameters      Json?       // Query params
  headers         Json?       // HTTP headers
  body            Json?       // Request body
  response        Json?       // Cached response
  
  collectionId    String
  collection      Collection  @relation(...)
  runs            RequestRun[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @default(now()) @updatedAt
}

model RequestRun {
  id              String   @id @default(cuid())
  requestId       String
  request         Request  @relation(...)
  
  status          Int      // HTTP status code
  statusText      String?
  headers         Json?
  body            String?  // Response body
  durationMs      Int?     // Response time
  
  createdAt       DateTime @default(now())
}

model Environment {
  id              String   @id @default(cuid())
  name            String   // "Local", "Production"
  values          Json     // { "BASE_URL": "...", "API_KEY": "..." }
  workspaceId     String
  workspace       Workspace @relation(...)
}
```

---

## Common Workflows

### Workflow 1: Local Development API Testing

**Scenario:** You're building a REST API locally and want to test endpoints

**Steps:**

1. **Start your API server**
   ```bash
   # In separate terminal
   npm run dev  # or your start command
   # Server running on http://localhost:4000
   ```

2. **Open Postman Clone**
   ```
   http://localhost:3000
   ```

3. **Create test request**
   ```
   Method: GET
   URL: http://localhost:4000/api/users
   ```

4. **Send and verify response**
   ```
   View status, headers, response time
   ```

5. **Save to collection** (Ctrl+S)
   ```
   Save to "API Tests" collection
   ```

6. **Reuse in future** (just click and send)

### Workflow 2: Testing Third-Party APIs

**Scenario:** Integrating with external APIs (Stripe, GitHub, SendGrid)

**Steps:**

1. **Get API credentials**
   ```
   From API documentation
   Copy: API Key / Token / Bearer Token
   ```

2. **Create request**
   ```
   Method: (as per API docs)
   URL: (as per API docs)
   ```

3. **Add authentication header**
   ```
   Headers Tab:
   - Authorization: Bearer YOUR_TOKEN
   or
   - X-API-Key: YOUR_API_KEY
   ```

4. **Add headers from docs**
   ```
   Content-Type: application/json
   Accept: application/json
   ```

5. **Add request body (if needed)**
   ```
   Body Tab:
   Paste JSON from API docs
   ```

6. **Send and test**

### Workflow 3: Team Collaboration

**Scenario:** Share API tests with team members

**Steps:**

1. **Create Workspace**
   ```
   Click "New Workspace"
   Name: "Team APIs"
   ```

2. **Create Collections**
   ```
   - Authentication
   - Users
   - Products
   - Orders
   ```

3. **Add requests to each collection**

4. **Invite team members**
   ```
   Workspace Settings → Invites
   Generate invite link
   Share with team
   ```

5. **Team members join**
   ```
   Click invite link
   Accepted to workspace
   Can now see/use all collections
   ```

6. **Everyone can test together**

### Workflow 4: API Documentation via Requests

**Scenario:** Create living documentation of API

**Steps:**

1. **Create "API Documentation" collection**

2. **For each endpoint, create request**
   ```
   GET /users
   GET /users/:id
   POST /users
   PUT /users/:id
   DELETE /users/:id
   ```

3. **Add example requests**
   ```
   Headers
   Parameters
   Body (sample data)
   ```

4. **Save responses**
   ```
   Each request saves last response
   Team can see what to expect
   ```

5. **Share with team**
   ```
   Everyone has reference of API
   No need for separate docs
   ```

---

## Troubleshooting

### Issue 1: "Unable to connect to localhost API"

**Cause:** API server not running

**Solution:**
```bash
# Check if server is running
netstat -tlnp | grep 4000

# If not running, start it
npm run dev

# Verify it's accessible
curl http://localhost:4000/api/health
```

### Issue 2: "CORS Error when testing external API"

**Cause:** Browser making request directly

**Solution:**
✓ This project uses **server-side requests** (Axios on Next.js)
✓ CORS errors should NOT happen
✓ If they do, check your API server configuration

### Issue 3: "Database connection failed"

**Cause:** PostgreSQL not running

**Solution:**
```bash
# Start Docker
docker-compose up -d

# Verify running
docker ps | grep postgres

# Check database
psql -U postgres -d postgres
```

### Issue 4: "Request saved but can't see it"

**Cause:** Not assigned to collection

**Solution:**
```
1. Save request again (Ctrl+S)
2. Select collection in modal
3. Click Save
4. Check sidebar for collection
```

### Issue 5: "Response shows empty data"

**Cause:** 
- API server returned no data
- Server crashed
- Authentication failed

**Solution:**
```
1. Check response status code
   - 200 = Success (check body is valid JSON)
   - 401 = Authentication issue (add headers)
   - 404 = Endpoint not found (check URL)
   - 500 = Server error (check server logs)

2. Check server logs
   npm run dev output

3. Verify API is running
   curl http://localhost:4000/health
```

### Issue 6: "Can't see saved requests in sidebar"

**Cause:** Wrong collection selected

**Solution:**
```
1. Make sure you have created a collection
2. Save request to that collection (Ctrl+S)
3. Refresh page (F5)
4. Check sidebar under collections
```

### Issue 7: "Authentication not working"

**Cause:** OAuth configuration missing

**Solution:**
```
1. Create GitHub/Google OAuth app
   GitHub: https://github.com/settings/developers
   Google: https://console.cloud.google.com/

2. Get Client ID and Secret

3. Add to .env.local:
   GITHUB_CLIENT_ID=xxx
   GITHUB_CLIENT_SECRET=xxx

4. Restart server: npm run dev
```

---

## Quick Reference Cheatsheet

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+N` or `Cmd+Shift+N` | New Request |
| `Ctrl+S` or `Cmd+S` | Save Request |
| `Ctrl+Enter` or `Cmd+Enter` | Send Request |

### HTTP Methods

| Method | Use Case | Example |
|--------|----------|---------|
| **GET** | Fetch data | Get user list |
| **POST** | Create data | Create new user |
| **PUT** | Replace data | Update entire user |
| **DELETE** | Remove data | Delete user |
| **PATCH** | Partial update | Update user email only |

### Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success! ✓ |
| 201 | Created | Resource created ✓ |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Add authentication |
| 404 | Not Found | Check URL |
| 500 | Server Error | Check API server |

### Response Metrics

| Metric | What It Means |
|--------|---------------|
| **Status** | HTTP response code (200, 404, etc.) |
| **Time** | Response duration in milliseconds (ms) |
| **Size** | Response body size in bytes (KB) |
| **Headers** | HTTP response headers |
| **Body** | Response data (usually JSON) |

### Database Relationships

```
User → Workspace → Collection → Request → RequestRun
                                         (Execution History)
                 → Environment (Variables)
                 → Members (Team Access)
```

---

## API Testing Best Practices

### 1. Use Descriptive Request Names
```
✓ Good:  "Get All Users with Pagination"
✗ Bad:   "Request 1"
```

### 2. Keep Collections Organized
```
✓ Authentication
  ├── Sign Up
  ├── Sign In
  └── Refresh Token

✓ Users
  ├── Get All Users
  ├── Get User by ID
  ├── Create User
  ├── Update User
  └── Delete User
```

### 3. Include Required Headers
```
✓ Content-Type: application/json
✓ Authorization: Bearer token
✓ Accept: application/json
```

### 4. Document Requests
```
Add comments in request names and body
Example:
POST /api/users
Body: { "name": "required", "email": "required" }
```

### 5. Test Error Cases
```
✓ Invalid data (400)
✓ No authentication (401)
✓ Wrong endpoint (404)
✓ Server errors (500)
```

### 6. Save Request History
```
Every RequestRun is saved to database
Can view execution history
Compare different runs
```

---

## Glossary

| Term | Definition |
|------|-----------|
| **Request** | An HTTP call to an API endpoint |
| **Endpoint** | The URL path of an API (e.g., /api/users) |
| **Method** | HTTP verb (GET, POST, PUT, DELETE) |
| **Headers** | Metadata sent with request |
| **Body** | Data sent in request (usually JSON) |
| **Parameters** | URL query parameters (?key=value) |
| **Response** | Data returned by API |
| **Status Code** | HTTP response code (200, 404, etc.) |
| **Collection** | Organized group of requests |
| **Workspace** | Team space with collections |
| **Environment** | Set of variables (BASE_URL, tokens) |
| **RequestRun** | Record of executed request |
| **CORS** | Cross-Origin Resource Sharing |
| **Bearer Token** | Authentication token format |

---

## Additional Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [HTTP Methods RFC](https://httpwg.org/specs/rfc7231.html)

### Online APIs for Testing
- [JSONPlaceholder](https://jsonplaceholder.typicode.com) - Free fake API
- [GitHub API](https://docs.github.com/en/rest) - Real GitHub data
- [OpenWeather API](https://openweathermap.org/api) - Weather data
- [Stripe API](https://stripe.com/docs/api) - Payment processing
- [Postman Echo](https://echo.hoppscotch.io) - Request echo server


---
