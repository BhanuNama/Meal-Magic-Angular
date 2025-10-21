import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaced } from './order-placed';

describe('OrderPlaced', () => {
  let component: OrderPlaced;
  let fixture: ComponentFixture<OrderPlaced>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPlaced]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPlaced);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
