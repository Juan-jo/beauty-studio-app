import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplServices } from './empl-services';

describe('EmplServices', () => {
  let component: EmplServices;
  let fixture: ComponentFixture<EmplServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
