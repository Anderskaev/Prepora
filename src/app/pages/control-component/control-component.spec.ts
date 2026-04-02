import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlComponent } from './control-component';

describe('ControlComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
