export interface Vendor {
  id: number;
  companyName: string;
  contactEmail: string;
  status: VendorStatus;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  employees?: Employee[];
}

export enum VendorStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export interface CreateVendorRequest {
  companyName: string;
  contactEmail: string;
}

export interface RejectVendorRequest {
  reason: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  resumeUrl?: string;
  vendorId: number;
  createdAt: Date;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  resumeFile?: File;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  jobTitle?: string;
}
