// features/vault/vault-form.component.ts
import { Component, inject, input, output, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DataService } from '../../../services/data-service';
import { VaultItem, VaultField } from '../../../models/app-models';

@Component({
  selector: 'app-vault-form-component',
  standalone: true,
  imports: [
    FormsModule, TranslateModule, ButtonModule,
    InputTextModule, SelectModule, ToggleSwitchModule
  ],
  templateUrl: './vault-form-component.html',
})
export class VaultFormComponent {
  private data = inject(DataService);

  item      = input<VaultItem | null>(null);
  saved     = output<void>();
  cancelled = output<void>();

  categories = this.data.vaultCategories;

  title    = signal('');
  category = signal('');
  fields   = signal<VaultField[]>([{ label: '', value: '', sensitive: false }]);


  constructor() {
    effect(()=>{
      const v = this.item();
      if (v) {
        this.title.set(v.title);
        this.category.set(v.category);
        this.fields.set(v.fields.map(f => ({ ...f })));
      }
    });
  }

  addField() {
    this.fields.update(f => [...f, { label: '', value: '', sensitive: false }]);
  }

  removeField(i: number) {
    this.fields.update(f => f.filter((_, idx) => idx !== i));
  }

  updateField(i: number, key: keyof VaultField, value: any) {
    this.fields.update(f =>
      f.map((field, idx) => idx === i ? { ...field, [key]: value } : field)
    );
  }

  isValid(): boolean {
    return this.title().trim().length > 0 &&
           this.fields().every(f => f.label.trim().length > 0);
  }

  save() {
    if (!this.isValid()) return;
    const existing = this.item();
    if (existing) {
      this.data.updateVaultItem({
        ...existing,
        title:    this.title().trim(),
        category: this.category(),
        fields:   this.fields(),
      });
    } else {
      this.data.addVaultItem({
        title:    this.title().trim(),
        category: this.category(),
        fields:   this.fields(),
      });
    }
    this.saved.emit();
  }
}