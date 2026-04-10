import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultFormComponent } from './vault-form-component';

describe('VaultFormComponent', () => {
  let component: VaultFormComponent;
  let fixture: ComponentFixture<VaultFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
