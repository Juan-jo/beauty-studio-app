import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTheme } from './section-theme';

describe('SectionTheme', () => {
  let component: SectionTheme;
  let fixture: ComponentFixture<SectionTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
