import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultListComponent } from './vault-list-component';

describe('VaultListComponent', () => {
  let component: VaultListComponent;
  let fixture: ComponentFixture<VaultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
