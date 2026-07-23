import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLayoutLayout } from './customer-layout.layout';

describe('CustomerLayoutLayout', () => {
  let component: CustomerLayoutLayout;
  let fixture: ComponentFixture<CustomerLayoutLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLayoutLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLayoutLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
