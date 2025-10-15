import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService } from '../../services/admin.service';
// THE FIX: Correct the import path to your models file.
// Adjust this path if your folder structure is different.
import { AdminDashboardStatsDto, User, Vendor } from '../../models';

const mockAdminService = {
  getDashboardStats: () => of<AdminDashboardStatsDto>({
    activeJobCount: 15,
    activeVendorCount: 8,
    totalApplications: 120,
    hiredApplications: 25,
    recentlyAddedLeaders: [
      { firstName: 'John', lastName: 'Doe' } as User,
      { firstName: 'Jane', lastName: 'Smith' } as User,
    ],
    recentlyAddedVendors: [
      { companyName: 'Tech Solutions' } as Vendor,
      { companyName: 'Innovate Inc' } as Vendor,
    ],
  })
};

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // (rest of your tests...)
});