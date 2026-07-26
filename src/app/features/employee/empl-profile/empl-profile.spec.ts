import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplProfile } from './empl-profile';

describe('EmplProfile', () => {
  let component: EmplProfile;
  let fixture: ComponentFixture<EmplProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
