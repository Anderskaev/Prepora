import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosFormComponent } from './scenarios-form-component';

describe('ScenariosFormComponent', () => {
  let component: ScenariosFormComponent;
  let fixture: ComponentFixture<ScenariosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenariosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenariosFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
