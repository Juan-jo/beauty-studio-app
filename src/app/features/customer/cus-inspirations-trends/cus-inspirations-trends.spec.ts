import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusInspirationsTrends } from './cus-inspirations-trends';

describe('CusInspirationsTrends', () => {
  let component: CusInspirationsTrends;
  let fixture: ComponentFixture<CusInspirationsTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusInspirationsTrends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusInspirationsTrends);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
