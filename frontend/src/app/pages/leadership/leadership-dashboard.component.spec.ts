import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadershipDashboardComponent } from './leadership-dashboard.component';

describe('LeadershipDashboardComponent', () => {
  let component: LeadershipDashboardComponent;
  let fixture: ComponentFixture<LeadershipDashboardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since the component is standalone, we just import it directly.
      imports: [LeadershipDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadershipDashboardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement; // Get the rendered HTML element
    
    // Trigger the initial data binding
    fixture.detectChanges();
  });

  it('should create', () => {
    // This test simply checks if the component instance was created successfully.
    expect(component).toBeTruthy();
  });

  it('should display the main header text', () => {
    // Find the h2 element in the template.
    const headerElement = compiled.querySelector('h2');
    // Check that its text content is correct.
    expect(headerElement?.textContent).toContain('Leadership Control Panel');
  });

  it('should display the welcome message', () => {
    // Find the paragraph element with the welcome text.
    const welcomeMessageElement = compiled.querySelector('p.text-indigo-700');
    expect(welcomeMessageElement?.textContent).toContain('Welcome to the Leadership portal.');
  });
  
  it('should display the list items for key actions', () => {
    const listItems = compiled.querySelectorAll('ul > li');
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain('Manage Vendors:');
    expect(listItems[1].textContent).toContain('Create Jobs:');
  });
});