import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLayoutLayout } from './employee-layout.layout';

describe('EmployeeLayoutLayout', () => {
  let component: EmployeeLayoutLayout;
  let fixture: ComponentFixture<EmployeeLayoutLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLayoutLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLayoutLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
