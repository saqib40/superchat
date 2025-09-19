#Superchat
This project is a multi-user platform with distinct roles for Admin, Leadership, and Vendors. It is built to manage vendors, employees, and other related data.

##Features
- **User Roles:** The system supports multiple user roles, including Admin, Leadership, and Vendor, each with different access levels.

- **Vendor Management:** Admins can invite, approve, and manage vendors through a defined workflow.

- **Employee Management:** Vendors can add, update, and delete employees associated with their company.

- **Secure Authentication:** The application uses JWT (JSON Web Tokens) for secure authentication and authorization.

- **AWS S3 Integration:** Resumes for employees are stored securely on an S3-compatible service.

- **Email Service:** The system includes an email service to send invitations to new vendors.

- **Dashboard: ** Each user role has a dedicated dashboard to provide relevant information and functionality.

##Tech Stack
**Backend**
Framework: ASP.NET Core 9.0

Database: SQL Server (Entity Framework Core)

Authentication: JWT Bearer Authentication

File Storage: AWS S3

Email: SendGrid

**Frontend**
Framework: Angular CLI 19.2.15

State Management: RxJS

UI Library: Material-UI (implied by file contents)

##Run Locally
**Prerequisites**
.NET SDK 9.0

Node.js (LTS recommended)

npm

SQL Server or a compatible database service.

An S3-compatible service (e.g., MinIO) and credentials.

A SendGrid API Key.

Clone the repository

Configure Environment Variables:
Create a .env file in the backend directory based on the .env.example file and fill in the required values for database connection, AWS S3, JWT, and SendGrid API Key.


Run the Backend:
Navigate to the backend directory and run the following command to start the server. 



Run the Frontend:
In a new terminal, navigate to the frontend directory and install dependencies.





