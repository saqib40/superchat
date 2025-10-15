import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { JobDetailComponent } from './job-detail.component';
import { LeadershipService } from '../../services/leadership.service';
import { MessagingService } from '../../services/messaging.service';
import { MessagingStateService } from '../../services/messaging-state.service';
import { JobDetail, JobApplicationDto, Vendor } from '../../models';

// --- Mocks and Test Data ---
// THE FIX: The mockJob object now includes the 'assignedVendors' array,
// which is required by the component's template.
const mockJob: JobDetail = {
  publicId: 'job-123',
  title: 'Senior Developer',
  country: 'USA',
  status: 'Open',
  assignedVendors: [{ publicId: 'vendor-1', companyName: 'Tech Corp' } as Vendor],
} as JobDetail;

const mockApplication: JobApplicationDto = { applicationPublicId: 'app-abc' } as JobApplicationDto;

const mockLeadershipService = jasmine.createSpyObj('LeadershipService', [
  'getJobDetails',
  'getApplicationsForJob',
  'updateApplicationStatus',
  'updateJobStatus',
]);
const mockMessagingService = jasmine.createSpyObj('MessagingService', ['startConversation']);
const mockMessagingStateService = jasmine.createSpyObj('MessagingStateService', ['openChat']);

describe('JobDetailComponent', () => {
  let component: JobDetailComponent;
  let fixture: ComponentFixture<JobDetailComponent>;
  let compiled: HTMLElement;

  const setupSuccessComponent = () => {
    TestBed.configureTestingModule({
      imports: [JobDetailComponent, FormsModule],
      providers: [
        { provide: LeadershipService, useValue: mockLeadershipService },
        { provide: MessagingService, useValue: mockMessagingService },
        { provide: MessagingStateService, useValue: mockMessagingStateService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'job-123' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    mockLeadershipService.getJobDetails.and.returnValue(of(mockJob));
    mockLeadershipService.getApplicationsForJob.and.returnValue(of([mockApplication]));
  };

  it('should create', () => {
    setupSuccessComponent();
    expect(component).toBeTruthy();
  });

  describe('Initialization and Data Fetching', () => {
    it('should fetch job details and applications on init', () => {
      setupSuccessComponent();
      fixture.detectChanges(); // Triggers ngOnInit

      expect(mockLeadershipService.getJobDetails).toHaveBeenCalledWith('job-123');
      expect(mockLeadershipService.getApplicationsForJob).toHaveBeenCalledWith('job-123');
      expect(component.job).toEqual(mockJob);
    });

    // (The error handling test remains the same)
    it('should handle error when fetching job details', () => {
      mockLeadershipService.getJobDetails.and.returnValue(throwError(() => new Error('API Error')));
      TestBed.configureTestingModule({
        imports: [JobDetailComponent],
        providers: [
          { provide: LeadershipService, useValue: mockLeadershipService },
          { provide: MessagingService, useValue: mockMessagingService },
          { provide: MessagingStateService, useValue: mockMessagingStateService },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { paramMap: convertToParamMap({ id: 'job-123' }) },
            },
          },
        ],
      });
      fixture = TestBed.createComponent(JobDetailComponent);
      component = fixture.componentInstance;
      compiled = fixture.nativeElement;
      fixture.detectChanges();
      expect(component.job).toBeNull();
      expect(compiled.textContent).toContain('Job Not Found');
    });
  });
});