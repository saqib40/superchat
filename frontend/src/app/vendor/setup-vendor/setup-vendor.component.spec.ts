import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupVendorComponent } from './setup-vendor.component';

describe('SetupVendorComponent', () => {
  let component: SetupVendorComponent;
  let fixture: ComponentFixture<SetupVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
