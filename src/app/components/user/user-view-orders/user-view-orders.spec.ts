import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewOrders } from './user-view-orders';

describe('UserViewOrders', () => {
  let component: UserViewOrders;
  let fixture: ComponentFixture<UserViewOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
