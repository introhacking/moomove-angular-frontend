import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneManualRateComponent } from './clone-manual-rate.component';

describe('CloneManualRateComponent', () => {
  let component: CloneManualRateComponent;
  let fixture: ComponentFixture<CloneManualRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneManualRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneManualRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
