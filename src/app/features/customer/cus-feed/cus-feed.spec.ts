import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusFeed } from './cus-feed';

describe('CusFeed', () => {
  let component: CusFeed;
  let fixture: ComponentFixture<CusFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusFeed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
