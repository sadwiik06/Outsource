# TaskPlatform Frontend

A React-based frontend for the TaskPlatform application built with Vite.

## Project Structure

```
src/
├── components/              # Reusable components
│   ├── Layout.jsx          # Main layout wrapper
│   ├── Navigation.jsx       # Navigation component
│   └── ProtectedRoute.jsx   # Route protection HOC
├── context/                 # Context API providers
│   └── AuthContext.jsx      # Authentication context
├── pages/                   # Page components
│   ├── HomePage.jsx         # Landing page
│   ├── auth/                # Authentication pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── client/              # Client role pages
│   │   ├── ClientDashboard.jsx
│   │   ├── ClientTasksPage.jsx
│   │   ├── CreateTaskPage.jsx
│   │   └── ClientMilestonesPage.jsx
│   ├── freelancer/          # Freelancer role pages
│   │   ├── FreelancerDashboard.jsx
│   │   ├── FreelancerProfilePage.jsx
│   │   ├── FreelancerTasksPage.jsx
│   │   ├── FreelancerMilestonesPage.jsx
│   │   └── FreelancerPerformancePage.jsx
│   └── admin/               # Admin role pages
│       ├── AdminDashboard.jsx
│       ├── UserManagementPage.jsx
│       ├── TaskManagementPage.jsx
│       ├── PaymentManagementPage.jsx
│       ├── PerformanceAnalyticsPage.jsx
│       └── AuditLogsPage.jsx
├── services/                # API service layer
│   ├── api.js              # Axios instance
│   ├── authService.js      # Auth API calls
│   ├── taskService.js      # Task API calls
│   ├── clientTaskService.js # Client task operations
│   ├── freelancerService.js # Freelancer API calls
│   ├── adminService.js     # Admin API calls
│   ├── milestoneService.js # Milestone API calls
│   ├── paymentService.js   # Payment API calls
│   └── performanceService.js # Performance API calls
├── App.jsx                  # Main app component with routing
└── main.jsx                 # Entry point
```

## Key Features

### Authentication
- Login and registration pages
- Context-based auth state management
- Protected routes with role-based access control
- Token-based API authentication

### Client Portal
- Dashboard with overview
- Create new tasks
- View all tasks
- Manage milestones
- Assign freelancers
- Approve/reject work

### Freelancer Portal
- Dashboard with stats
- View profile
- Browse assigned tasks
- Submit work on milestones
- Track performance metrics

### Admin Panel
- Dashboard with system statistics
- User management (suspend/activate)
- Task management
- Payment management
- Performance analytics
- Audit logs

## API Integration

All API calls are handled through service modules in `/src/services/`. Each service:
- Uses the centralized axios instance with interceptors
- Includes auto-token injection for authenticated requests
- Handles common HTTP methods (GET, POST, PUT, DELETE)
- Mirrors backend controller endpoints

### Example Usage

```javascript
import { taskService } from './services/taskService';

// Fetch all tasks
const response = await taskService.getAllTasks();
const tasks = response.data;

// Create a task
await taskService.createTask({
  title: 'My Task',
  description: 'Task description',
  budget: 500
});
```

## Routing Structure

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Client Routes (Protected)
- `/client/dashboard` - Dashboard
- `/client/create-task` - Create task
- `/client/tasks` - View tasks
- `/client/milestones` - Manage milestones

### Freelancer Routes (Protected)
- `/freelancer/dashboard` - Dashboard
- `/freelancer/profile` - View profile
- `/freelancer/tasks` - Assigned tasks
- `/freelancer/milestones` - Work milestones
- `/freelancer/performance` - Performance stats

### Admin Routes (Protected)
- `/admin/dashboard` - Dashboard
- `/admin/users` - User management
- `/admin/tasks` - Task management
- `/admin/payments` - Payment management
- `/admin/performance` - Performance analytics
- `/admin/audits` - Audit logs

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Configure backend URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Authentication Flow

1. User registers/logs in
2. Backend returns token
3. Token stored in localStorage
4. Axios interceptor adds token to all API requests
5. User redirected to role-specific dashboard
6. ProtectedRoute component prevents unauthorized access

## Component Hierarchy

```
App (Router)
├── HomePage
├── LoginPage
├── RegisterPage
└── Protected Routes
    ├── Client Routes
    │   └── Layout
    │       └── Client Pages
    ├── Freelancer Routes
    │   └── Layout
    │       └── Freelancer Pages
    └── Admin Routes
        └── Layout
            └── Admin Pages
```

## State Management

- **Auth Context**: Manages user authentication state and login/logout
- **Component State**: Individual page components handle their own data fetching and state

## Technologies Used

- **React 19**: UI framework
- **React Router DOM 7**: Client-side routing
- **Axios**: HTTP client
- **Vite**: Build tool and dev server

## Notes

- No CSS styling has been implemented - focus is on functionality and structure
- All API responses are used as-is from the backend
- Error handling is basic and can be enhanced
- Forms use basic HTML inputs without validation libraries
