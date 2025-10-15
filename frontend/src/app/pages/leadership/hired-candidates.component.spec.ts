import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs'; // Import Subject
import { HiredCandidatesComponent } from './hired-candidates.component';
import { LeadershipService } from '../../services/leadership.service';
import { JobApplicationDto } from '../../models';

// Mocks and Test Data
const mockHiredApplications: JobApplicationDto[] = [
  { employeeFirstName: 'John', employeeLastName: 'Doe' } as JobApplicationDto,
];

const mockLeadershipService = jasmine.createSpyObj('LeadershipService', ['getHiredApplications']);

describe('HiredCandidatesComponent', () => {
  let component: HiredCandidatesComponent;
  let fixture: ComponentFixture<HiredCandidatesComponent>;
  let compiled: HTMLElement;
  // THE FIX (Part 1): Use a Subject to control the data stream
  let hiredAppsSubject: Subject<JobApplicationDto[]>;

  beforeEach(() => {
    // Create a new Subject for each test
    hiredAppsSubject = new Subject<JobApplicationDto[]>();
    // Make the mock service return the Subject's observable
    mockLeadershipService.getHiredApplications.and.returnValue(hiredAppsSubject.asObservable());

    TestBed.configureTestingModule({
      imports: [HiredCandidatesComponent],
      providers: [
        { provide: LeadershipService, useValue: mockLeadershipService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HiredCandidatesComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- THIS IS THE CORRECTED TEST ---
  it('should show loading state initially, then render the table after data arrives', () => {
    // Act 1: Trigger ngOnInit. The component is now waiting for data.
    fixture.detectChanges();

    // Assert 1: Check the loading state. It should be visible.
    expect(component.isLoading).toBe(true);
    expect(compiled.textContent).toContain('Loading...');
    expect(compiled.querySelector('table')).toBeFalsy(); // Table should not exist yet

    // Act 2: Manually "push" the data into the component, simulating a response.
    hiredAppsSubject.next(mockHiredApplications);
    fixture.detectChanges(); // Update the view with the new data.

    // Assert 2: Check the final state. Loading is gone, and the table is rendered.
    expect(component.isLoading).toBe(false);
    expect(compiled.textContent).not.toContain('Loading...');
    expect(compiled.querySelector('table')).toBeTruthy();
  });

  it('should display the "No Candidates Hired" message when data is empty', () => {
    fixture.detectChanges(); // Start loading

    hiredAppsSubject.next([]); // Push an empty array
    fixture.detectChanges(); // Update view

    const emptyState = compiled.querySelector('.p-12.text-center');
    expect(emptyState?.textContent).toContain('No Candidates Hired');
  });
});