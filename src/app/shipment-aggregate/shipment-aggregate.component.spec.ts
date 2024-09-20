import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentAggregateComponent } from './shipment-aggregate.component';

describe('ShipmentAggregateComponent', () => {
  let component: ShipmentAggregateComponent;
  let fixture: ComponentFixture<ShipmentAggregateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentAggregateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
