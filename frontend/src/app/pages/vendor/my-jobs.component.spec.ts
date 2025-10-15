import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MyJobsComponent } from './my-jobs.component';
import { VendorService } from '../../services/vendor.service';
import { Job } from '../../models';

// --- Mocks and Test Data ---
const mockJobs: Job[] = [
  {
    publicId: 'job-1',
    title: 'Senior Developer',
    country: 'USA',
    expiryDate: new Date().toISOString(),
    daysRemaining: 5, // Should be red
  } as Job,
  {
    publicId: 'job-2',
    title: 'UX Designer',
    country: 'Canada',
    expiryDate: new Date().toISOString(),
    daysRemaining: 10, // Should be green
  } as Job,
];

// Create a Jasmine Spy Object for the VendorService
const mockVendorService = jasmine.createSpyObj('VendorService', ['getMyAssignedJobs']);

describe('MyJobsComponent', () => {
  let component: MyJobsComponent;
  let fixture: ComponentFixture<MyJobsComponent>;
  let compiled: HTMLElement;

  // Helper function to set up the component
  const setupComponent = () => {
    TestBed.configureTestingModule({
      // Import the component and RouterTestingModule because of [routerLink]
      imports: [MyJobsComponent, RouterTestingModule],
      providers: [
        { provide: VendorService, useValue: mockVendorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyJobsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  };

  it('should create', () => {
    setupComponent();
    expect(component).toBeTruthy();
  });

  describe('when jobs are available', () => {
    beforeEach(() => {
      // Mock the service to return our test data
      mockVendorService.getMyAssignedJobs.and.returnValue(of(mockJobs));
      setupComponent();
      fixture.detectChanges(); // Triggers ngOnInit and data binding
    });

    it('should fetch and display the list of jobs on init', () => {
      expect(mockVendorService.getMyAssignedJobs).toHaveBeenCalled();
      expect(component.jobs.length).toBe(2);

      const jobLinks = compiled.querySelectorAll('a');
      expect(jobLinks.length).toBe(2);
      expect(jobLinks[0].textContent).toContain('Senior Developer');
    });

    it('should apply the correct color class based on days remaining', () => {
      const daysRemainingElements = compiled.querySelectorAll('p.text-2xl');
      
      // First job has 5 days remaining, should have 'text-red-500'
      expect(daysRemainingElements[0].classList).toContain('text-red-500');
      
      // Second job has 10 days remaining, should have 'text-green-600'
      expect(daysRemainingElements[1].classList).toContain('text-green-600');
    });

    it('should not show the empty state message', () => {
      const emptyState = compiled.querySelector('h3.text-xl');
      expect(emptyState).toBeFalsy();
    });
  });

  describe('when no jobs are available', () => {
    beforeEach(() => {
      // Mock the service to return an empty array
      mockVendorService.getMyAssignedJobs.and.returnValue(of([]));
      setupComponent();
      fixture.detectChanges();
    });

    it('should display the "No Jobs Assigned" message', () => {
      const emptyStateHeader = compiled.querySelector('h3.text-xl');
      expect(emptyStateHeader).toBeTruthy();
      expect(emptyStateHeader?.textContent).toContain('No Jobs Assigned');
    });

    it('should not render any job links', () => {
      const jobLinks = compiled.querySelectorAll('a');
      expect(jobLinks.length).toBe(0);
    });
  });
});