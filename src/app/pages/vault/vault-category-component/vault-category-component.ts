import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataService } from '../../../services/data-service';
import { signal } from '@angular/core';

const COLORS = ['#F97316','#EF4444','#8B5CF6','#3B82F6',
                '#10B981','#F59E0B','#EC4899','#06B6D4'];

@Component({
  selector: 'app-vault-category-component',
  standalone: true,
  imports: [FormsModule, TranslateModule, ButtonModule, InputTextModule],
  templateUrl: './vault-category-component.html',
})
export class VaultCategoryComponent {
  private data = inject(DataService);
  closed       = output<void>();
  categories   = this.data.vaultCategories;
  colors       = COLORS;
  newLabel     = signal('');
  newIcon      = signal('📂');
  newColor     = signal(COLORS[0]);

  add() {
    if (!this.newLabel().trim()) return;
    this.data.addVaultCategory({
      label: this.newLabel().trim(),
      icon:  this.newIcon(),
      color: this.newColor(),
    });
    this.newLabel.set('');
    this.newIcon.set('📂');
  }

  delete(id: string) {
    this.data.deleteVaultCategory(id);
  }
}