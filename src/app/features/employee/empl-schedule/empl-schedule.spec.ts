import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplSchedule } from './empl-schedule';

describe('EmplSchedule', () => {
  let component: EmplSchedule;
  let fixture: ComponentFixture<EmplSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
