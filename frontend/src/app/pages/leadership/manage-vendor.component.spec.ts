import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ManageVendorsComponent } from './manage-vendors.component';
import { LeadershipService } from '../../services/leadership.service';
import { Vendor } from '../../models';

const mockVendors: Vendor[] = [
  { publicId: '1', companyName: 'Vendor A', country: 'India' } as Vendor,
];

const mockLeadershipService = jasmine.createSpyObj('LeadershipService', [
  'getVendorsByCountry',
  'createVendor',
  'deleteVendor',
]);

describe('ManageVendorsComponent', () => {
  let component: ManageVendorsComponent;
  let fixture: ComponentFixture<ManageVendorsComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVendorsComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: LeadershipService, useValue: mockLeadershipService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageVendorsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // Reset spies before each test
    mockLeadershipService.getVendorsByCountry.calls.reset();
    mockLeadershipService.createVendor.calls.reset();
    mockLeadershipService.deleteVendor.calls.reset();
    mockLeadershipService.getVendorsByCountry.and.returnValue(of([...mockVendors]));
    mockLeadershipService.createVendor.and.returnValue(of({} as Vendor));
    mockLeadershipService.deleteVendor.and.returnValue(of(undefined));
  });

  it('should load vendors for the default country on ngOnInit', () => {
    fixture.detectChanges();
    expect(mockLeadershipService.getVendorsByCountry).toHaveBeenCalledWith('India');
    expect(mockLeadershipService.getVendorsByCountry).toHaveBeenCalledTimes(1);
  });

  // --- THIS IS THE CORRECTED TEST ---
  it('should reload vendors when the country filter changes', fakeAsync(() => {
    // Arrange: Initial render calls getVendorsByCountry once.
    fixture.detectChanges();

    // Act: Simulate the user typing in the input field.
    const filterInput = compiled.querySelector('input[placeholder="Filter by Country..."]') as HTMLInputElement;
    filterInput.value = 'USA';
    filterInput.dispatchEvent(new Event('input')); // This triggers the ngModel binding.
    fixture.detectChanges(); // Update the component with the new value.
    tick(); // Advance the fakeAsync timer to process the (ngModelChange) event.

    // Assert: The service should now have been called a second time with the new value.
    expect(mockLeadershipService.getVendorsByCountry).toHaveBeenCalledWith('USA');
    expect(mockLeadershipService.getVendorsByCountry).toHaveBeenCalledTimes(2);
  }));

  it('should call deleteVendor and reload vendors when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges(); // Initial load
    const deleteButton = compiled.querySelector('.bg-red-500') as HTMLButtonElement;
    
    deleteButton.click();

    expect(mockLeadershipService.deleteVendor).toHaveBeenCalledWith(mockVendors[0].publicId);
    expect(mockLeadershipService.getVendorsByCountry).toHaveBeenCalledTimes(2);
  });
});