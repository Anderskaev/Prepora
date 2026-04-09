// features/scenarios/scenarios-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../services/data-service';
import { Scenario, Category } from '../../../models/app-models';
import { computed } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ScenariosFormComponent } from '../scenarios-form-component/scenarios-form-component';
import { CategoryFormComponent } from '../../category-form-component/category-form-component';

@Component({
  selector: 'app-scenarios-list',
  standalone: true,
  imports: [TranslateModule, ButtonModule, TagModule, DialogModule, ScenariosFormComponent, CategoryFormComponent, TooltipModule],
  templateUrl: './scenarios-list-component.html',
})
export class ScenariosListComponent {
  private data   = inject(DataService);
  private router = inject(Router);

  scenarios          = this.data.scenarios;
  scenarioCategories = this.data.scenarioCategories;

  // Диалоги
  showForm     = signal(false);
  showCatForm  = signal(false);
  editScenario = signal<Scenario | null>(null);  

  // Сценарии сгруппированные по категориям
  grouped = computed(() => {
    const cats = this.scenarioCategories();
    const all  = this.scenarios();

    // Сценарии без категории
    const uncategorized = all.filter(s => !s.category);

    return [
      ...cats.map(cat => ({
        category: cat,
        items:    all.filter(s => s.category === cat.id)
      })).filter(g => g.items.length > 0),
      ...(uncategorized.length > 0 ? [{
        category: null,
        items:    uncategorized
      }] : [])
    ];
  });

  constructor() {
    let c: Scenario = {
      category: 'f17c1e68-da8b-4e14-8028-9dfd3954bfd0',
      icon: '',
      priority:'CRITICAL',
      steps: [],
      title: 'First Scenario',
      trigger: 'HZ',
      createdAt:'',
      id:'',
      updatedAt:''
    }
    //this.data.addScenario(c);
    //console.log(this.scenarioCategories());
    //8b5b1540-1532-4eb1-aa3e-ca4d3a9968f9
    //this.data.addScenarioCategory({label:'cat1', icon:'pi-home', color:'green'});
    //console.log(this.scenarioCategories());
  }


  prioritySeverity(p: Scenario['priority']): 'danger' | 'warn' | 'secondary' {
    return { CRITICAL: 'danger', IMPORTANT: 'warn', STANDARD: 'secondary' }[p] as any;
  }

  priorityClass(priority: Scenario['priority']): string {
    return {
      'CRITICAL':  'priority--critical',
      'IMPORTANT': 'priority--important',
      'STANDARD':  'priority--standard',
    }[priority] ?? '';
  }

  // навигация
  openCard(scenario: Scenario) {
    this.router.navigate(
      ['/scenarios', { outlets: { children: ['card', scenario.id] } }]
    );
  }

  openAdd() {
    this.editScenario.set(null);
    this.showForm.set(true);
  }

  openEdit(scenario: Scenario, event: Event) {
    event.stopPropagation();
    this.editScenario.set(scenario);
    this.showForm.set(true);
  }

  onFormSaved() {
    this.showForm.set(false);
    this.editScenario.set(null);
  }

  onFormCancelled() {
    this.showForm.set(false);
    this.editScenario.set(null);
  }

  deleteScenario(id: string, event: Event) {
    event.stopPropagation();
    this.data.deleteScenario(id);
  }
  
}