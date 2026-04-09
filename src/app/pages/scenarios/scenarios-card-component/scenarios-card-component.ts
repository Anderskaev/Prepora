// features/scenarios/scenarios-card.component.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { DataService } from '../../../services/data-service';
import { Scenario } from '../../../models/app-models';
import { ScenariosFormComponent } from '../../scenarios/scenarios-form-component/scenarios-form-component';

@Component({
  selector: 'app-scenarios-card-component',
  standalone: true,
  imports: [
    TranslateModule, ButtonModule, TagModule,
    DialogModule, PanelModule, ScenariosFormComponent
  ],
  templateUrl: './scenarios-card-component.html',
})
export class ScenariosCardComponent implements OnInit {
  private data  = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id       = signal<string>('');
  showEdit = signal(false);

  scenario = computed(() =>
    this.data.scenarios().find(s => s.id === this.id())
  );

  category = computed(() => {
    const s = this.scenario();
    if (!s?.category) return null;
    return this.data.scenarioCategories().find(c => c.id === s.category) ?? null;
  });

  ngOnInit() {
    this.id.set(this.route.snapshot.params['id']);
  }

  prioritySeverity(p: Scenario['priority']): 'danger' | 'warn' | 'secondary' {
    return { CRITICAL: 'danger', IMPORTANT: 'warn', STANDARD: 'secondary' }[p] as any;
  }

  back() {
    this.router.navigate(['/scenarios', { outlets: { children: [] } }]);
  }

  onEditSaved() {
    this.showEdit.set(false);
  }
}