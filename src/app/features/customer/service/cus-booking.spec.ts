import { TestBed } from '@angular/core/testing';

import { CusBooking } from './cus-booking';

describe('CusBooking', () => {
  let service: CusBooking;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CusBooking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
