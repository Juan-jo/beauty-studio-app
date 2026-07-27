import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplBookingCard } from './empl-booking-card';

describe('EmplBookingCard', () => {
  let component: EmplBookingCard;
  let fixture: ComponentFixture<EmplBookingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplBookingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplBookingCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
