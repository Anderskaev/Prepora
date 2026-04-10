import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparatonComponent } from './preparation-component';

describe('PreparatonComponent', () => {
  let component: PreparatonComponent;
  let fixture: ComponentFixture<PreparatonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparatonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparatonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
