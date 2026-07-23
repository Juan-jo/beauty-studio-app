import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonAdminLayoutLayout } from './salon-admin-layout.layout';

describe('SalonAdminLayoutLayout', () => {
  let component: SalonAdminLayoutLayout;
  let fixture: ComponentFixture<SalonAdminLayoutLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonAdminLayoutLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonAdminLayoutLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
