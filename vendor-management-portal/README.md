# Vendor Management Portal

A comprehensive Angular 19+ application for managing vendors with role-based access control.

## Features

- **Role-Based Access Control**: Admin, Leadership, and Vendor roles with specific permissions
- **JWT Authentication**: Secure token-based authentication
- **Responsive Design**: Modern UI built with Tailwind CSS
- **File Upload**: Resume upload functionality for employees
- **Search & Filter**: Advanced search capabilities for Leadership role
- **Real-time Dashboard**: Analytics and insights for Leadership

## Technology Stack

- **Frontend**: Angular 19+ with Standalone Components
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Lazy-loaded modules with guards

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v19)

### Installation

1. **Create the Angular project:**
   ```bash
   ng new vendor-management-portal --routing --style=css --standalone
   cd vendor-management-portal
   ```

2. **Install Tailwind CSS:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment:**
   - Update `src/environments/environment.ts` with your API URL

5. **Start the development server:**
   ```bash
   ng serve
   ```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── auth/
│   │       ├── login/
│   │       └── vendor-setup/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   └── jwt.interceptor.ts
│   ├── models/
│   │   ├── auth.models.ts
│   │   ├── vendor.models.ts
│   │   ├── leadership.models.ts
│   │   └── index.ts
│   ├── modules/
│   │   ├── admin/
│   │   ├── leadership/
│   │   └── vendor/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── admin.service.ts
│   │   ├── vendor.service.ts
│   │   └── leadership.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
└── environments/
    └── environment.ts
```

## User Roles

### Admin
- Create vendor invitations
- View all vendors
- Approve/reject vendor applications
- Delete vendors

### Leadership
- View dashboard analytics
- Search vendors and employees
- Read-only access to vendor details

### Vendor
- Manage company employees
- Add/edit/delete employees
- Upload employee resumes

## API Integration

The application integrates with a .NET Core API using the following endpoints:

- **Authentication**: `/api/Auth/login`, `/api/Auth/submit-vendor-details/{token}`
- **Admin**: `/api/Admin/vendors`, `/api/Admin/vendors/{id}/approve`, `/api/Admin/vendors/{id}/reject`
- **Vendor**: `/api/Vendor/employees` (GET, POST, PUT, DELETE)
- **Leadership**: `/api/Leadership/dashboard`, `/api/Leadership/search`

## Security Features

- JWT token-based authentication
- Role-based route protection
- HTTP interceptor for automatic token attachment
- Token expiration handling

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
