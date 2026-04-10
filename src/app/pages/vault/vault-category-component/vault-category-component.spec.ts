import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultCategoryComponent } from './vault-category-component';

describe('VaultCategoryComponent', () => {
  let component: VaultCategoryComponent;
  let fixture: ComponentFixture<VaultCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultCategoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
