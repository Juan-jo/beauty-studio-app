import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPictureService } from './modal-picture-service';

describe('ModalPictureService', () => {
  let component: ModalPictureService;
  let fixture: ComponentFixture<ModalPictureService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPictureService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPictureService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
