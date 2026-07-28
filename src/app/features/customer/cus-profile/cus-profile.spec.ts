import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusProfile } from './cus-profile';

describe('CusProfile', () => {
  let component: CusProfile;
  let fixture: ComponentFixture<CusProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
