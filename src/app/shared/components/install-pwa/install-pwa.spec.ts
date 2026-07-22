import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallPwa } from './install-pwa';

describe('InstallPwa', () => {
  let component: InstallPwa;
  let fixture: ComponentFixture<InstallPwa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallPwa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallPwa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
