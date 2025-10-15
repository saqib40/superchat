import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { VendorJobDetailComponent } from './vendor-job-detail.component';
import { VendorService } from '../../services/vendor.service';
import { VendorJobDetailDto, Employee, JobApplicationDto } from '../../models';

// --- Mocks and Test Data ---
const mockSubmittedApp: JobApplicationDto = { employeePublicId: 'emp-abc' } as JobApplicationDto;
const mockJobDetails: VendorJobDetailDto = {
  jobPublicId: 'job-123',
  title: 'Senior Developer',
  submittedApplications: [mockSubmittedApp],
} as VendorJobDetailDto;

const mockVendorService = jasmine.createSpyObj('VendorService', [
  'getAssignedJobDetails',
  'createEmployee',
  'deleteEmployee',
]);

describe('VendorJobDetailComponent', () => {
  let component: VendorJobDetailComponent;
  let fixture: ComponentFixture<VendorJobDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorJobDetailComponent, ReactiveFormsModule],
      providers: [
        { provide: VendorService, useValue: mockVendorService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'job-123' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorJobDetailComponent);
    component = fixture.componentInstance;

    // THE FIX: Reset call history for all spies before each test.
    mockVendorService.getAssignedJobDetails.calls.reset();
    mockVendorService.createEmployee.calls.reset();
    mockVendorService.deleteEmployee.calls.reset();

    // Configure default returns
    mockVendorService.getAssignedJobDetails.and.returnValue(of(mockJobDetails));
    mockVendorService.createEmployee.and.returnValue(of({} as Employee));
    mockVendorService.deleteEmployee.and.returnValue(of(undefined));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job details on init', () => {
    fixture.detectChanges(); // Triggers ngOnInit
    expect(mockVendorService.getAssignedJobDetails).toHaveBeenCalledWith('job-123');
  });

  describe('User Actions', () => {
    it('should not call createEmployee if form is invalid', () => {
      fixture.detectChanges();
      component.addEmployee();
      // This will now pass because the spy's call count is correctly starting from 0.
      expect(mockVendorService.createEmployee).not.toHaveBeenCalled();
    });

    it('should call deleteEmployee and reload details on confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      fixture.detectChanges(); // Call #1 to getAssignedJobDetails
      
      component.deleteEmployee('emp-abc'); // This calls deleteEmployee -> loadJobDetails (Call #2)
      
      expect(mockVendorService.deleteEmployee).toHaveBeenCalledWith('emp-abc');
      // This will now pass because the spy was reset before this test.
      expect(mockVendorService.getAssignedJobDetails).toHaveBeenCalledTimes(2);
    });
  });
});