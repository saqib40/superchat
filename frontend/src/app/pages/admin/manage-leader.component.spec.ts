import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ManageLeadersComponent } from './manage-leaders.component';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models';

// Mocks and Test Data
const mockLeaders: User[] = [
  { publicId: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@test.com' },
  { publicId: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@test.com' },
];

const mockAdminService = jasmine.createSpyObj('AdminService', [
  'getLeaders',
  'createLeader',
  'deleteLeader',
]);

describe('ManageLeadersComponent', () => {
  let component: ManageLeadersComponent;
  let fixture: ComponentFixture<ManageLeadersComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLeadersComponent, ReactiveFormsModule],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageLeadersComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // THE FIX: Explicitly reset call history for all spies before each test.
    mockAdminService.getLeaders.calls.reset();
    mockAdminService.createLeader.calls.reset();
    mockAdminService.deleteLeader.calls.reset();

    // Configure default return values
    mockAdminService.getLeaders.and.returnValue(of([...mockLeaders]));
    mockAdminService.createLeader.and.returnValue(of(null));
    mockAdminService.deleteLeader.and.returnValue(of(undefined));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display the list of leaders on initialization', () => {
    fixture.detectChanges(); // Triggers ngOnInit -> loadLeaders
    
    expect(mockAdminService.getLeaders).toHaveBeenCalledTimes(1);
    expect(component.leaders.length).toBe(2);
    const leaderListItems = compiled.querySelectorAll('ul > li');
    expect(leaderListItems[0].textContent).toContain('John Doe');
  });

  describe('Leader Creation Form', () => {
    it('should call adminService.createLeader, reload leaders, and reset the form on valid submission', () => {
      fixture.detectChanges(); // Call #1 to getLeaders (from ngOnInit)

      const expectedNewLeader = {
        firstName: 'New',
        lastName: 'Leader',
        email: 'new@leader.com',
        password: 'ValidPassword1!',
      };
      component.leaderForm.setValue(expectedNewLeader);
      
      // Trigger the form submission
      const form = compiled.querySelector('form');
      form?.dispatchEvent(new Event('submit')); // This calls createLeader -> loadLeaders (Call #2 to getLeaders)

      expect(mockAdminService.createLeader).toHaveBeenCalledWith(expectedNewLeader);
      expect(mockAdminService.getLeaders).toHaveBeenCalledTimes(2);
      expect(component.leaderForm.get('firstName')?.value).toBeNull();
    });
  });

  describe('Leader Deletion', () => {
    it('should call adminService.deleteLeader and reload leaders when delete is clicked', () => {
      fixture.detectChanges(); // Call #1 to getLeaders (from ngOnInit)

      const firstLeaderToDelete = mockLeaders[0];
      const deleteButton = compiled.querySelector('ul > li:first-child button') as HTMLButtonElement;
      
      deleteButton.click(); // This calls deleteLeader -> loadLeaders (Call #2 to getLeaders)
      
      expect(mockAdminService.deleteLeader).toHaveBeenCalledWith(firstLeaderToDelete.publicId);
      expect(mockAdminService.getLeaders).toHaveBeenCalledTimes(2);
    });
  });
});