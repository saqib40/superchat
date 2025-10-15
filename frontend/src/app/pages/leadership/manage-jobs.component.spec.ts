import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing'; // 1. Import this
import { of } from 'rxjs';
import { ManageJobsComponent } from './manage-jobs.component';
import { LeadershipService } from '../../services/leadership.service';
import { Job, Vendor } from '../../models';

const mockLeadershipService = jasmine.createSpyObj('LeadershipService', [
  'getMyCreatedJobs',
  'getVendorsByCountry',
  'createJob',
  'deleteJob',
]);

describe('ManageJobsComponent', () => {
  let component: ManageJobsComponent;
  let fixture: ComponentFixture<ManageJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManageJobsComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule, // 2. Add this to the imports array
      ],
      providers: [
        { provide: LeadershipService, useValue: mockLeadershipService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageJobsComponent);
    component = fixture.componentInstance;

    // Reset spies before each test to prevent test pollution
    mockLeadershipService.getMyCreatedJobs.calls.reset();
    mockLeadershipService.createJob.calls.reset();
    mockLeadershipService.deleteJob.calls.reset();

    // Configure default return values
    mockLeadershipService.getMyCreatedJobs.and.returnValue(of([{ publicId: 'job-1' } as Job]));
    mockLeadershipService.createJob.and.returnValue(of({} as Job));
    mockLeadershipService.deleteJob.and.returnValue(of(undefined));
  });

  // (The rest of your tests for this component remain the same...)
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});