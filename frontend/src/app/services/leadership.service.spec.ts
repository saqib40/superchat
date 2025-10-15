import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeadershipService } from './leadership.service';
import { environment } from '../../environments/environment';
import { Vendor, Job, JobDetail, EmployeeDetail, JobApplicationDto } from '../models';

describe('LeadershipService', () => {
  let service: LeadershipService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Leadership`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeadershipService],
    });

    service = TestBed.inject(LeadershipService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Vendor Methods ---
  describe('Vendor Methods', () => {
    it('#getVendorsByCountry should make a GET request with country params', () => {
      const mockVendors: Vendor[] = [{ publicId: '1', companyName: 'Vendor A' } as unknown as Vendor];
      const country = 'India';
      service.getVendorsByCountry(country).subscribe(vendors => expect(vendors).toEqual(mockVendors));
      const req = httpTestingController.expectOne(`${apiUrl}/vendors?country=${country}`);
      req.flush(mockVendors);
    });

    it('#createVendor should make a POST request with vendor data', () => {
      const newVendorData = { companyName: 'New Vendor', contactEmail: 'contact@new.com', country: 'USA' };
      const mockVendor: Vendor = { publicId: '2', ...newVendorData } as unknown as Vendor;
      service.createVendor(newVendorData).subscribe(vendor => expect(vendor).toEqual(mockVendor));
      const req = httpTestingController.expectOne(`${apiUrl}/vendors`);
      req.flush(mockVendor);
    });
  });

  // --- Job Methods ---
  describe('Job Methods', () => {
    it('#getMyCreatedJobs should make a GET request', () => {
      const mockJobs: Job[] = [{ publicId: 'job-1', title: 'Developer' } as unknown as Job];
      service.getMyCreatedJobs().subscribe(jobs => expect(jobs).toEqual(mockJobs));
      const req = httpTestingController.expectOne(`${apiUrl}/jobs`);
      req.flush(mockJobs);
    });

    it('#getJobDetails should make a GET request to a specific job URL', () => {
      const jobId = 'job-123';
      const mockJobDetail: JobDetail = { publicId: jobId, title: 'Details' } as unknown as JobDetail;
      service.getJobDetails(jobId).subscribe(details => expect(details).toEqual(mockJobDetail));
      const req = httpTestingController.expectOne(`${apiUrl}/jobs/${jobId}`);
      req.flush(mockJobDetail);
    });
  });

  // --- Application Methods ---
  describe('Application Methods', () => {
    // THE FIX IS ON THIS LINE: Cast to 'unknown' first.
    const mockApplications: JobApplicationDto[] = [{ publicId: 'app-1' } as unknown as JobApplicationDto];

    it('#getApplicationsForJob should make a GET request without status', () => {
      const jobId = 'job-123';
      service.getApplicationsForJob(jobId).subscribe(apps => expect(apps).toEqual(mockApplications));
      const req = httpTestingController.expectOne(`${apiUrl}/jobs/${jobId}/applications`);
      req.flush(mockApplications);
    });

    it('#getApplicationsForJob should make a GET request with status param', () => {
      const jobId = 'job-123';
      const status = 'Interviewing';
      service.getApplicationsForJob(jobId, status).subscribe(apps => expect(apps).toEqual(mockApplications));
      const req = httpTestingController.expectOne(`${apiUrl}/jobs/${jobId}/applications?status=${status}`);
      req.flush(mockApplications);
    });
  });

  // --- Employee Methods ---
  describe('Employee Methods', () => {
    it('#getEmployeeDetails should make a GET request to the employee-specific URL', () => {
      const employeeId = 'emp-123';
      const mockEmployeeDetail: EmployeeDetail = { publicId: employeeId, firstName: 'John' } as unknown as EmployeeDetail;
      service.getEmployeeDetails(employeeId).subscribe(details => expect(details).toEqual(mockEmployeeDetail));
      const req = httpTestingController.expectOne(`${apiUrl}/employees/${employeeId}`);
      req.flush(mockEmployeeDetail);
    });
  });
});