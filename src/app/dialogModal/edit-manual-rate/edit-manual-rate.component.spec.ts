import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManualRateComponent } from './edit-manual-rate.component';

describe('EditManualRateComponent', () => {
  let component: EditManualRateComponent;
  let fixture: ComponentFixture<EditManualRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditManualRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditManualRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
