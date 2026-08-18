import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplMonthSchedule } from './empl-month-schedule';

describe('EmplMonthSchedule', () => {
  let component: EmplMonthSchedule;
  let fixture: ComponentFixture<EmplMonthSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplMonthSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplMonthSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
