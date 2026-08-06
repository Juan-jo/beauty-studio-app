import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalon } from './edit-salon';

describe('EditSalon', () => {
  let component: EditSalon;
  let fixture: ComponentFixture<EditSalon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSalon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
