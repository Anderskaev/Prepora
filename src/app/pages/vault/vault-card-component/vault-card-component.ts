
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DataService } from '../../../services/data-service';
import { VaultItem } from '../../../models/app-models';
import { VaultFormComponent } from '../vault-form-component/vault-form-component';

@Component({
  selector: 'app-vault-card-component',
  standalone: true,
  imports: [TranslateModule, ButtonModule, DialogModule, VaultFormComponent],
  templateUrl: './vault-card-component.html',
})
export class VaultCardComponent implements OnInit {
  private data   = inject(DataService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  id       = signal('');
  showEdit = signal(false);
  // Какие поля показаны (по индексу)
  revealed = signal<Set<number>>(new Set());

  item = computed(() =>
    this.data.vaultItems().find(i => i.id === this.id())
  );

  category = computed(() => {
    const v = this.item();
    if (!v?.category) return null;
    return this.data.vaultCategories().find(c => c.id === v.category) ?? null;
  });

  ngOnInit() {
    this.id.set(this.route.snapshot.params['id']);
  }

  toggleReveal(index: number) {
    this.revealed.update(s => {
      const next = new Set(s);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  back() {
    this.router.navigate(['/vault', { outlets: { children: [] } }]);
  }
}