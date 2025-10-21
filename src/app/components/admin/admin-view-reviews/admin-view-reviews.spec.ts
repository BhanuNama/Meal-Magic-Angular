import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewReviews } from './admin-view-reviews';

describe('AdminViewReviews', () => {
  let component: AdminViewReviews;
  let fixture: ComponentFixture<AdminViewReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
