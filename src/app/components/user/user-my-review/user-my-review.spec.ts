import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyReview } from './user-my-review';

describe('UserMyReview', () => {
  let component: UserMyReview;
  let fixture: ComponentFixture<UserMyReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMyReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMyReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
