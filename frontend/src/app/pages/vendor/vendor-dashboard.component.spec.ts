import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorDashboardComponent } from './vendor-dashboard.component';

describe('VendorDashboardComponent', () => {
  let component: VendorDashboardComponent;
  let fixture: ComponentFixture<VendorDashboardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since the component is standalone, we just import it directly.
      imports: [VendorDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardComponent);
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
    expect(headerElement?.textContent).toContain('Vendor Dashboard');
  });

  it('should display the welcome message', () => {
    // Find the paragraph element with the welcome text.
    const welcomeMessageElement = compiled.querySelector('p.text-gray-600');
    expect(welcomeMessageElement?.textContent).toContain(
      'Welcome. You can view your assigned jobs and submit employees through the navigation panel.'
    );
  });
});