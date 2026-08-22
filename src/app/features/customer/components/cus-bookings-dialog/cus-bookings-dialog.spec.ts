import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusBookingsDialog } from './cus-bookings-dialog';

describe('CusBookingsDialog', () => {
  let component: CusBookingsDialog;
  let fixture: ComponentFixture<CusBookingsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusBookingsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusBookingsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
