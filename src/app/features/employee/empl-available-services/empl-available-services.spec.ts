import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplAvailableServices } from './empl-available-services';

describe('EmplAvailableServices', () => {
  let component: EmplAvailableServices;
  let fixture: ComponentFixture<EmplAvailableServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplAvailableServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplAvailableServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
