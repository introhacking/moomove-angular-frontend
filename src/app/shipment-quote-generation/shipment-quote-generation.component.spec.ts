import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentQuoteGenerationComponent } from './shipment-quote-generation.component';

describe('ShipmentQuoteGenerationComponent', () => {
  let component: ShipmentQuoteGenerationComponent;
  let fixture: ComponentFixture<ShipmentQuoteGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentQuoteGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentQuoteGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
