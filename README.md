
# 🚀 Postman Clone - REST API Testing Platform

<div align="center">
  
  **A Modern, Open-Source REST API Testing Tool**
  
  Test APIs • Manage Collections • Collaborate with Teams • Real-time WebSocket Support
 
  [![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black)](https://nextjs.org/)

</div>

---

## 📖 Table of Contents

- [🎯 What is Postman Clone?](#-what-is-postman-clone)
- [✨ Key Features](#-key-features)
- [⚡ Quick Start](#-quick-start)
- [🏗️ How It Works](#️-how-it-works)
- [📚 Installation Guide](#-installation-guide)
- [💡 Usage Guide](#-usage-guide)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [📝 API Testing Examples](#-api-testing-examples)
- [📊 Database Models](#-database-models)
- [🔐 Security](#-security)
- [📈 Performance](#-performance)
- [❓ Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## 🎯 What is Postman Clone?

**Postman Clone** is a free, open-source alternative to Postman for testing and managing REST APIs. It's built with modern web technologies and designed to make API testing simple, collaborative, and enjoyable.

### Perfect For:
✅ Local API development and testing  
✅ Testing third-party APIs (GitHub, Stripe, OpenWeather, etc.)  
✅ Team collaboration on API collections  
✅ API documentation and sharing  
✅ WebSocket real-time communication testing  
✅ Building and managing API workflows  

### Who Should Use It?
- Backend developers testing their own APIs
- Frontend developers integrating external APIs
- QA engineers testing API endpoints
- DevOps teams managing API documentation
- Teams collaborating on API testing

---

## ✨ Key Features

### 🔷 REST API Testing
- **Multiple HTTP Methods:** GET, POST, PUT, DELETE, PATCH, etc.
- **Request Management:** 
  - URL input with automatic query parameters
  - Custom headers (Content-Type, Authorization, etc.)
  - Request body editor with JSON validation
  - Pre-built request templates
- **Response Viewer:**
  - Formatted JSON display
  - Response status code and message
  - Response time tracking (milliseconds)
  - Response size monitoring
  - Raw and pretty-print views
  - Header inspection

### 📦 Collections & Organization
- **Save Requests:** Create reusable request templates
- **Collections:** Organize requests into logical groups
- **Request History:** View all executed requests with timestamps
- **Response Caching:** Store last response for each request
- **Quick Access:** One-click execution of saved requests

### 👥 Workspace & Team Collaboration
- **Multiple Workspaces:** Create separate spaces for different projects
- **Team Invites:** Generate shareable links to invite team members
- **Role-Based Access:** Admin and Member roles with different permissions
- **Real-time Sync:** Changes sync across team members
- **Member Management:** View and manage workspace members

### 🔌 WebSocket Support
- **Real-Time Communication:** Test WebSocket connections (ws:// and wss://)
- **Message Tracking:** Send and receive messages with timestamps
- **Message Metadata:** Track message direction, payload, and size
- **Connection Presets:** Save WebSocket connection configurations
- **Message History:** View all messages in a session

### 🎨 Developer Experience
- **Monaco Editor:** Professional code editor for request bodies
- **JSON Validation:** Automatic JSON syntax validation
- **Keyboard Shortcuts:** 
  - `Ctrl+Shift+N` - New request
  - `Ctrl+S` - Save request
  - `Ctrl+Enter` - Send request
- **Dark Theme:** Modern, easy-on-the-eyes dark interface
- **Responsive Design:** Works on desktop (mobile coming soon)

### ⚙️ Advanced Features
- **Environment Variables:** Store and switch between different API configurations
- **Request Parameters:** Add URL query parameters with key-value editor
- **Custom Headers:** Full control over HTTP headers
- **Authentication:** Support for Bearer tokens, API keys, and custom auth
- **Data Persistence:** All requests and responses saved to database
- **Workspace Export:** Share collections with team members

---

## ⚡ Quick Start

### 1️⃣ Prerequisites
- Node.js 18 or higher
- Docker (for PostgreSQL database)
- Git

### 2️⃣ Clone & Install
```bash
# Clone repository
git clone https://github.com/Aestheticsuraj234/postman-clone.git
cd postman-clone

# Install dependencies
npm install
```

### 3️⃣ Setup Environment
Create `.env.local` file in root directory:
```env
# Database
DATABASE_URL="postgresql://postgres:2005L@xpostgres@localhost:5432/postmanclone"

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (get from https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"

# Google OAuth (get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: AI Features
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

### 4️⃣ Database Setup
```bash
# Run migrations
npx prisma migrate dev

# Optional: Seed sample data
npx prisma db seed
```

### 5️⃣ Start Application
```bash
npm run dev
```

🎉 **App is now running at:** http://localhost:3000

---

## 🏗️ How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│          User Interface (React + Next.js)           │
│   Request Playground → Zustand State Management     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│        Next.js Server Actions (Axios)              │
│   sendRequest() → HTTP Call → Response Capture     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│    PostgreSQL Database (Prisma ORM)                │
│   Requests, Collections, RequestRuns, Workspaces  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│        Target API Servers (Any Server)             │
│   Localhost • Deployed • External • Public APIs    │
└─────────────────────────────────────────────────────┘
```

### Request Execution Flow

```
User enters URL + Method + Headers + Body
              ↓
         Click "Send"
              ↓
    Server Action: run(requestId)
              ↓
  Axios makes HTTP request
              ↓
   Server captures response:
   - Status code
   - Headers
   - Body
   - Duration
              ↓
   Save RequestRun to database
              ↓
   Return to frontend
              ↓
  Display in Response Viewer
```

### Database Structure

```
Workspace (Team Space)
├── Collections (Request Groups)
│   └── Requests (Individual API Calls)
│       └── RequestRuns (Execution History)
├── Environments (Variables: BASE_URL, API_KEY, etc.)
├── Members (Team Access Control)
└── WebSocketPresets (WS Connection Configs)
```

---

## 📚 Installation Guide

### Full Step-by-Step Installation

#### Step 1: System Requirements Check
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check Docker is installed
docker --version
```

#### Step 2: Clone Repository
```bash
git clone https://github.com/Aestheticsuraj234/postman-clone.git
cd postman-clone
```

#### Step 3: Create Environment File
```bash
# Create .env.local file
cat > .env.local << EOF
DATABASE_URL="postgresql://postgres:2005L@xpostgres@localhost:5432/postmanclone"
BETTER_AUTH_SECRET="your-super-secret-key-change-this"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your-github-id"
GITHUB_CLIENT_SECRET="your-github-secret"
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_GENERATIVE_AI_API_KEY="your-ai-key"
EOF
```

#### Step 4: Install Dependencies
```bash
npm install
# This installs all packages from package.json
```

#### Step 5: Start Database
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Verify database is running
docker ps | grep postgres
```

#### Step 6: Setup Database Schema
```bash
# Run Prisma migrations
npx prisma migrate dev

# This creates all tables in the database
```

#### Step 7: Start Development Server
```bash
npm run dev
# Turbopack will compile Next.js faster
```

#### Step 8: Open in Browser
```
Navigate to: http://localhost:3000
```

---

## 💡 Usage Guide

### Basic Workflow: Test Your First API

#### 1. Sign In
- Navigate to http://localhost:3000
- Click "Sign In"
- Choose "Continue with GitHub" or "Continue with Google"
- Grant permissions and authorize

#### 2. Create Workspace
- Click "New Workspace" button
- Enter workspace name: "My API Tests"
- Click "Create"

#### 3. Create Collection
- In sidebar, click "New Collection"
- Enter collection name: "User APIs"
- Click "Create"

#### 4. Create & Test Request
```
Step 1: Click "New Request" (or Ctrl+Shift+N)

Step 2: Fill Request Details
  Method: GET
  URL: https://api.github.com/users/github

Step 3: Click "Send" Button

Step 4: View Response
  - Status: 200 OK
  - Headers: response headers
  - Body: JSON response data
```

#### 5. Save Request
```
Step 1: Press Ctrl+S

Step 2: Enter request name: "Get GitHub User"

Step 3: Select collection: "User APIs"

Step 4: Click "Save"

Result: Request saved and visible in sidebar
```

#### 6. Reuse Saved Request
```
Click on saved request → Click "Send" → Get response
```

### Testing Different API Types

#### Testing Localhost APIs
```
URL: http://localhost:4000/api/users
(Make sure your local server is running)
```

#### Testing Third-Party APIs
```
URL: https://api.github.com/users/octocat

Headers:
- Authorization: Bearer YOUR_GITHUB_TOKEN
```

#### Testing Public APIs
```
URL: https://jsonplaceholder.typicode.com/posts/1
(No authentication needed)
```

### Using Headers & Parameters

#### Add Headers
```
1. Click "Headers" tab
2. Add key-value pairs:
   - Content-Type: application/json
   - Authorization: Bearer token123
```

#### Add URL Parameters
```
1. Click "Parameters" tab
2. Add key-value pairs:
   - page: 1
   - limit: 10
   
Final URL: /api/users?page=1&limit=10
```

#### Add Request Body (POST/PUT)
```
1. Click "Body" tab
2. Enter JSON:
   {
     "name": "John Doe",
     "email": "john@example.com"
   }
```

### Team Collaboration

#### Invite Team Members
```
1. Go to Workspace Settings
2. Click "Generate Invite Link"
3. Share link with team members
4. Team members click link and join workspace
5. Everyone can now access collections and requests
```

#### Manage Team Roles
```
- Admin: Full control, can manage members
- Member: Can use requests but limited management
```

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router and Server Actions
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible UI component library
- **Zustand** - Lightweight state management
- **Monaco Editor** - Advanced code editor

### Backend
- **Next.js Server Actions** - Serverless functions
- **Axios** - HTTP client library
- **Better Auth** - Authentication system

### Database & ORM
- **PostgreSQL** - Relational database
- **Prisma** - Type-safe ORM
- **Docker** - Container for PostgreSQL

### Data Fetching & State
- **TanStack Query (React Query)** - Data fetching and caching
- **Zustand** - Client-side state management

### Development Tools
- **Turbopack** - Fast bundler
- **ESLint** - Code linting
- **TypeScript** - Type checking

---

## 📁 Project Structure

```
postman-clone/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (workspace)/         # Main workspace layout
│   │   ├── api/                 # API routes
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   │
│   ├── modules/
│   │   ├── request/             # Request testing module
│   │   │   ├── actions/         # Server actions (sendRequest, run, etc.)
│   │   │   ├── components/      # UI components
│   │   │   ├── hooks/           # React hooks
│   │   │   └── store/           # Zustand state
│   │   ├── collections/         # Collection management
│   │   ├── workspace/           # Workspace features
│   │   ├── authentication/      # Auth module
│   │   └── realtime/            # WebSocket support
│   │
│   └── lib/
│       ├── db.ts                # Prisma client
│       ├── auth.ts              # Authentication logic
│       └── utils.ts             # Utility functions
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── public/                       # Static files
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript config
└── docker-compose.yml           # Docker configuration
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `src/modules/request/actions/index.ts` | Main HTTP request handler (Axios) |
| `src/modules/request/store/useRequestStore.ts` | Request state management |
| `src/modules/request/components/request-bar.tsx` | URL & method input |
| `src/modules/request/hooks/request.ts` | React Query hooks |
| `prisma/schema.prisma` | Database models |
| `docker-compose.yml` | PostgreSQL setup |

---

## 📝 API Testing Examples

### Example 1: Test GitHub API (GET Request)
```
Method: GET
URL: https://api.github.com/users/octocat

Headers:
- Accept: application/vnd.github+json

Response:
Status: 200 OK
Time: 250ms
Body:
{
  "login": "octocat",
  "id": 1,
  "avatar_url": "https://...",
  "type": "User",
  "name": "The Octocat",
  ...
}
```

### Example 2: Create New User (POST Request)
```
Method: POST
URL: http://localhost:4000/api/users

Headers:
- Content-Type: application/json
- Authorization: Bearer token123

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}

Response:
Status: 201 Created
Time: 120ms
Body:
{
  "id": 5,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2024-05-06T10:30:00Z"
}
```

### Example 3: Update User (PUT Request)
```
Method: PUT
URL: http://localhost:4000/api/users/5

Headers:
- Content-Type: application/json

Body:
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}

Response:
Status: 200 OK
Time: 85ms
Body:
{
  "id": 5,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "updatedAt": "2024-05-06T11:00:00Z"
}
```

### Example 4: Delete User (DELETE Request)
```
Method: DELETE
URL: http://localhost:4000/api/users/5

Response:
Status: 204 No Content
Time: 50ms
```

### Example 5: Query Parameters (GET with Filters)
```
Method: GET
URL: http://localhost:4000/api/users

Parameters:
- page: 1
- limit: 10
- sort: name
- order: asc

Final URL: /api/users?page=1&limit=10&sort=name&order=asc

Response:
Status: 200 OK
Body:
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

## 📊 Database Models

### Request Model
```
- id: unique identifier
- name: request name
- method: HTTP method (GET, POST, etc.)
- url: API endpoint URL
- headers: request headers (JSON)
- parameters: URL parameters (JSON)
- body: request body (JSON/text)
- response: last response (cached)
- collectionId: parent collection
```

### RequestRun Model
```
- id: unique identifier
- requestId: parent request
- status: HTTP status code
- statusText: status message
- headers: response headers
- body: response body
- durationMs: response time in milliseconds
- createdAt: execution timestamp
```

### Collection Model
```
- id: unique identifier
- name: collection name
- workspaceId: parent workspace
- requests: array of requests
```

### Workspace Model
```
- id: unique identifier
- name: workspace name
- description: workspace description
- ownerId: owner user ID
- collections: arrays of collections
- members: team members
- environments: stored variables
```

---

## 🔐 Security

- OAuth 2.0 authentication (GitHub, Google)
- Server-side request handling (secure)
- Environment variables for sensitive data
- Role-based access control
- Database encryption ready

---

## 📈 Performance

- **Turbopack** for fast compilation
- **Next.js 15** with App Router
- **Server Actions** for efficient backend calls
- **React Query** for smart caching
- **Zustand** for minimal state management

---

## ❓ Troubleshooting

### Q: "Cannot connect to localhost API"
**A:** Check if your API server is running on the specified port
```bash
# For port 4000
netstat -tlnp | grep 4000

# If not running, start your server
npm run dev
```

### Q: "Database connection error"
**A:** Ensure PostgreSQL is running
```bash
# Start Docker
docker-compose up -d

# Check if running
docker ps | grep postgres
```

### Q: "Port 3000 already in use"
**A:** Kill the process using port 3000
```bash
# Find process using port 3000
netstat -tlnp | grep 3000

# Kill process (replace PID with actual process ID)
kill -9 <PID>
```

### Q: "Cannot authenticate with OAuth"
**A:** Verify OAuth credentials in .env.local
```env
# Check GitHub OAuth is setup correctly
GITHUB_CLIENT_ID=your-id
GITHUB_CLIENT_SECRET=your-secret

# Restart server after changes
npm run dev
```

### Q: "Saved requests not showing in sidebar"
**A:** Try these steps:
1. Refresh page (F5)
2. Check if request was saved to correct collection
3. Check database is running (`docker-compose up -d`)

### Q: "Response is empty or shows error"
**A:** Check HTTP status codes:
- **200-299:** Success ✓
- **400:** Bad request (check body format)
- **401:** Unauthorized (add auth headers)
- **404:** Not found (check URL)
- **500:** Server error (check API logs)

---

## 🤝 Contributing

Contributions are welcome! Help improve Postman Clone:

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your work (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Areas to Contribute
- New features (request scripting, test assertions, etc.)
- Bug fixes and improvements
- Documentation and tutorials
- UI/UX enhancements
- Performance optimizations
- Support for more API types

### Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

---
