import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplAddService } from './empl-add-service';

describe('EmplAddService', () => {
  let component: EmplAddService;
  let fixture: ComponentFixture<EmplAddService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplAddService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplAddService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
