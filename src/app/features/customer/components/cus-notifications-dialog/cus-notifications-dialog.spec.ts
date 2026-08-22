import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusNotificationsDialog } from './cus-notifications-dialog';

describe('CusNotificationsDialog', () => {
  let component: CusNotificationsDialog;
  let fixture: ComponentFixture<CusNotificationsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusNotificationsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusNotificationsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
