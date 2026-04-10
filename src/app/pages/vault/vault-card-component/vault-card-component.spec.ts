import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultCardComponent } from './vault-card-component';

describe('VaultCardComponent', () => {
  let component: VaultCardComponent;
  let fixture: ComponentFixture<VaultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
