import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplNotification } from './empl-notification';

describe('EmplNotification', () => {
  let component: EmplNotification;
  let fixture: ComponentFixture<EmplNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
