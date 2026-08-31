import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPwd } from './recovery-pwd';

describe('RecoveryPwd', () => {
  let component: RecoveryPwd;
  let fixture: ComponentFixture<RecoveryPwd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPwd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPwd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
