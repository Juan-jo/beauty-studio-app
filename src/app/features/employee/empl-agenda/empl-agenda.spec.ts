import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplAgenda } from './empl-agenda';

describe('EmplAgenda', () => {
  let component: EmplAgenda;
  let fixture: ComponentFixture<EmplAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmplAgenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmplAgenda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
