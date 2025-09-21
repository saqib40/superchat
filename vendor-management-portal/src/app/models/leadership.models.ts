export interface DashboardData {
  totalVendors: number;
  approvedVendors: number;
  pendingVendors: number;
  totalEmployees: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'vendor_created' | 'vendor_approved' | 'employee_added';
  description: string;
  timestamp: Date;
}

export interface SearchResult {
  type: 'vendor' | 'employee';
  id: number;
  name: string;
  companyName?: string;
  jobTitle?: string;
  email?: string;
}

export interface SearchRequest {
  type: string;
  query: string;
}
