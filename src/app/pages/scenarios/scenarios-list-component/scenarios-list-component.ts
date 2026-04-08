// features/scenarios/scenarios-list.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../../services/data-service';
import { Scenario, Category } from '../../../models/app-models';
import { computed } from '@angular/core';

@Component({
  selector: 'app-scenarios-list',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './scenarios-list-component.html',
})
export class ScenariosListComponent {
  private data   = inject(DataService);
  private router = inject(Router);

  scenarios          = this.data.scenarios;
  scenarioCategories = this.data.scenarioCategories;

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

  addScenario() {
    // TODO: открыть форму
  }
}