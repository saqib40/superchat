import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: LeadershipDashboardComponent;
  let fixture: ComponentFixture<LeadershipDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadershipDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadershipDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
