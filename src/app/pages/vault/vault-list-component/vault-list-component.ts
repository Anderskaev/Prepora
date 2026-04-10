// features/vault/vault-list.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DataService } from '../../../services/data-service';
import { VaultItem } from '../../../models/app-models';
//import { VaultFormComponent } from '../vault-form-component/vault-form-component';
import { VaultCategoryComponent } from '../vault-category-component/vault-category-component';
import { VaultFormComponent } from "../vault-form-component/vault-form-component";

@Component({
  selector: 'app-vault-list',
  standalone: true,
  imports: [
    TranslateModule, ButtonModule, DialogModule,
    VaultCategoryComponent,
    VaultFormComponent
],
  templateUrl: './vault-list-component.html',
})
export class VaultListComponent {
  private data   = inject(DataService);
  private router = inject(Router);

  items      = this.data.vaultItems;
  categories = this.data.vaultCategories;

  showForm    = signal(false);
  showCatForm = signal(false);
  editItem    = signal<VaultItem | null>(null);

  grouped = computed(() => {
    const cats = this.categories();
    const all  = this.items();
    const result = cats
      .map(cat => ({
        category: cat,
        items: all.filter(i => i.category === cat.id)
      }))
      .filter(g => g.items.length > 0);

    const uncategorized = all.filter(i => !cats.find(c => c.id === i.category));
    if (uncategorized.length > 0) {
      result.push({ category: null as any, items: uncategorized });
    }
    return result;
  });

  openCard(item: VaultItem) {
    this.router.navigate(
      ['/vault', { outlets: { children: ['card', item.id] } }]
    );
  }

  openAdd() {
    this.editItem.set(null);
    this.showForm.set(true);
  }

  openEdit(item: VaultItem, e: Event) {
    e.stopPropagation();
    this.editItem.set(item);
    this.showForm.set(true);
  }

  delete(id: string, e: Event) {
    e.stopPropagation();
    this.data.deleteVaultItem(id);
  }

  onFormSaved() {
    this.showForm.set(false);
    this.editItem.set(null);
  }
}