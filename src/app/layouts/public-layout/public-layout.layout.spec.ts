import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLayoutLayout } from './public-layout.layout';

describe('PublicLayoutLayout', () => {
  let component: PublicLayoutLayout;
  let fixture: ComponentFixture<PublicLayoutLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLayoutLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLayoutLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
