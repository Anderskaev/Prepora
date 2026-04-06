import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosListComponent } from './scenarios-list-component';

describe('ScenariosListComponent', () => {
  let component: ScenariosListComponent;
  let fixture: ComponentFixture<ScenariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenariosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenariosListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
