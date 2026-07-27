import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplWeekSchedule } from './empl-week-schedule';

describe('EmplWeekSchedule', () => {
  let component: EmplWeekSchedule;
  let fixture: ComponentFixture<EmplWeekSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplWeekSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplWeekSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
