export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: UserRole;
  user: User;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  companyName?: string;
}

export enum UserRole {
  Admin = 'Admin',
  Leadership = 'Leadership',
  Vendor = 'Vendor'
}

export interface VendorSubmissionRequest {
  firstName: string;
  lastName: string;
  password: string;
}
