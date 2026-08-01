import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplSelectService } from './empl-select-service';

describe('EmplSelectService', () => {
  let component: EmplSelectService;
  let fixture: ComponentFixture<EmplSelectService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplSelectService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplSelectService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
