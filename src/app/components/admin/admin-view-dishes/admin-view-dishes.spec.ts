import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewDishes } from './admin-view-dishes';

describe('AdminViewDishes', () => {
  let component: AdminViewDishes;
  let fixture: ComponentFixture<AdminViewDishes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewDishes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewDishes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
