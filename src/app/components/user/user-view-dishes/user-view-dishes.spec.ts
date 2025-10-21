import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewDishes } from './user-view-dishes';

describe('UserViewDishes', () => {
  let component: UserViewDishes;
  let fixture: ComponentFixture<UserViewDishes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewDishes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewDishes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
