import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLogout } from './section-logout';

describe('SectionLogout', () => {
  let component: SectionLogout;
  let fixture: ComponentFixture<SectionLogout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionLogout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionLogout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
