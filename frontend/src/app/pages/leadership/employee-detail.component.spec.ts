import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EmployeeDetailComponent } from './employee-detail.component';
import { LeadershipService } from '../../services/leadership.service';
import { EmployeeDetail, JobApplicationDto } from '../../models';

// --- Mocks and Test Data ---
const mockEmployee: EmployeeDetail = {
  publicId: 'emp-123',
  firstName: 'John',
  lastName: 'Doe',
} as EmployeeDetail;

const mockApplication: JobApplicationDto = {
  applicationPublicId: 'app-abc',
  employeePublicId: 'emp-123',
} as JobApplicationDto;

const mockLeadershipService = jasmine.createSpyObj('LeadershipService', [
  'getEmployeeDetails',
  'getApplicationsForJob',
  'addApplicationNote',
]);

describe('EmployeeDetailComponent', () => {
  let component: EmployeeDetailComponent;
  let fixture: ComponentFixture<EmployeeDetailComponent>;
  let compiled: HTMLElement;

  const setupComponentWithRoutes = (params: { id?: string, job?: string }) => {
    TestBed.configureTestingModule({
      imports: [EmployeeDetailComponent, FormsModule],
      providers: [
        { provide: LeadershipService, useValue: mockLeadershipService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: params.id }),
              queryParamMap: convertToParamMap({ job: params.job }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // THE FIX: Reset call history for all spies before each test.
    // This prevents test pollution.
    mockLeadershipService.getEmployeeDetails.calls.reset();
    mockLeadershipService.getApplicationsForJob.calls.reset();
    mockLeadershipService.addApplicationNote.calls.reset();

    // Re-configure default return values for this specific test run
    mockLeadershipService.getEmployeeDetails.and.returnValue(of(mockEmployee));
    mockLeadershipService.getApplicationsForJob.and.returnValue(of([mockApplication]));
    mockLeadershipService.addApplicationNote.and.returnValue(of(null));
  };

  it('should create', () => {
    setupComponentWithRoutes({});
    expect(component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    it('should fetch ONLY employee details if job query param is missing', () => {
      setupComponentWithRoutes({ id: 'emp-123' });
      fixture.detectChanges(); // Triggers ngOnInit

      expect(mockLeadershipService.getEmployeeDetails).toHaveBeenCalledWith('emp-123');
      // This assertion will now pass because the spy was reset.
      expect(mockLeadershipService.getApplicationsForJob).not.toHaveBeenCalled();
    });

    it('should fetch employee AND application details if both params are present', () => {
      setupComponentWithRoutes({ id: 'emp-123', job: 'job-abc' });
      fixture.detectChanges();

      expect(mockLeadershipService.getEmployeeDetails).toHaveBeenCalledWith('emp-123');
      expect(mockLeadershipService.getApplicationsForJob).toHaveBeenCalledWith('job-abc');
    });
  });

  // (The rest of your tests remain unchanged)
});