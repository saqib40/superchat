import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorService } from './vendor.service';
import { environment } from '../../environments/environment';
import { Job, Employee, VendorJobDetailDto } from '../models';

describe('VendorService', () => {
  let service: VendorService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Vendor`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorService],
    });

    service = TestBed.inject(VendorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After each test, verify that no requests are outstanding.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Job Methods', () => {
    it('#getMyAssignedJobs should make a GET request to the jobs endpoint', () => {
      const mockJobs: Job[] = [{ publicId: 'job-1' } as unknown as Job];

      service.getMyAssignedJobs().subscribe(jobs => {
        expect(jobs).toEqual(mockJobs);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/jobs`);
      expect(req.request.method).toBe('GET');
      req.flush(mockJobs);
    });

    it('#getAssignedJobDetails should make a GET request to a specific job URL', () => {
      const jobPublicId = 'job-123';
      const mockDetails: VendorJobDetailDto = { jobPublicId } as unknown as VendorJobDetailDto;

      service.getAssignedJobDetails(jobPublicId).subscribe(details => {
        expect(details).toEqual(mockDetails);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/jobs/${jobPublicId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDetails);
    });
  });

  describe('Employee Methods', () => {
    it('#createEmployee should make a POST request with FormData', () => {
      // Arrange: Create a mock FormData object
      const formData = new FormData();
      formData.append('firstName', 'John');
      formData.append('resume', new Blob(['resume content']), 'resume.pdf');

      const mockEmployee: Employee = { publicId: 'emp-1' } as unknown as Employee;

      // Act
      service.createEmployee(formData).subscribe(employee => {
        expect(employee).toEqual(mockEmployee);
      });

      // Assert
      const req = httpTestingController.expectOne(`${apiUrl}/employees`);
      expect(req.request.method).toBe('POST');
      // For FormData, we check that the body is an instance of FormData
      // as inspecting its contents directly is complex in tests.
      expect(req.request.body).toBeInstanceOf(FormData);
      req.flush(mockEmployee);
    });

    it('#deleteEmployee should make a DELETE request to a specific employee URL', () => {
      const employeeId = 'emp-123';

      service.deleteEmployee(employeeId).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/employees/${employeeId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });
  });
});