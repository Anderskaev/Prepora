import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosCardComponent } from './scenarios-card-component';

describe('ScenariosCardComponent', () => {
  let component: ScenariosCardComponent;
  let fixture: ComponentFixture<ScenariosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenariosCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenariosCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
