// features/scenarios/scenarios-form.component.ts
import { Component, inject, input, output, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DataService } from '../../../services/data-service';
import { Scenario, ScenarioStep, Category } from '../../../models/app-models';
import { Subscription } from 'rxjs';

interface FormStep {
  phase: string;
  items: string; // textarea — строки через \n
}

interface FormData {
  title: string;
  icon: string;
  category: string;
  priority: Scenario['priority'];
  trigger: string;
  steps: FormStep[];
}

@Component({
  selector: 'app-scenarios-form-component',
  standalone: true,
  imports: [
    FormsModule, TranslateModule,
    ButtonModule, InputTextModule, SelectModule, TextareaModule
  ],
  templateUrl: './scenarios-form-component.html',
})
export class ScenariosFormComponent implements OnInit {
  private data = inject(DataService);
  private translate = inject(TranslateService);
  // Inputs / Outputs
  scenario = input<Scenario | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  categories = this.data.scenarioCategories;

  /*priorities: { label: string; value: Scenario['priority'] }[] = [
    { label: 'scenarios.priority.CRITICAL', value: 'CRITICAL'  },
    { label: 'scenarios.priority.IMPORTANT',    value: 'IMPORTANT' },
    { label: 'scenarios.priority.STANDARD', value: 'STANDARD'  },
  ];*/

  private langSub?: Subscription;
  priorities = signal<{ label: string; value: Scenario['priority'] }[]>([]);
  private buildPriorities() {
    this.priorities.set([
      { label: this.translate.instant('app.priority.CRITICAL'), value: 'CRITICAL' },
      { label: this.translate.instant('app.priority.IMPORTANT'), value: 'IMPORTANT' },
      { label: this.translate.instant('app.priority.STANDARD'), value: 'STANDARD' },
    ]);
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  form = signal<FormData>({
    title: '',
    icon: '📋',
    category: '',
    priority: 'STANDARD',
    trigger: '',
    steps: [{ phase: '', items: '' }],
  });

  onHide() {
    this.form.update(f => ({
      ...f,
      steps: [{ phase: '', items: '' }]
    }));
    this.cancelled.emit();
  }

  constructor() {
    effect(() => {
      const s = this.scenario(); // Следим за изменениями
      if (s) {
        this.form.set({
          title: s.title,
          icon: s.icon,
          category: s.category,
          priority: s.priority,
          trigger: s.trigger,
          steps: s.steps.map(step => ({
            phase: step.phase,
            items: step.items.join('\n'),
          })),
        });
      }
    });
  }


  ngOnInit() {


    this.buildPriorities();
    // Подписываемся на смену языка
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.buildPriorities();
    });

  }

  // Мутация формы
  updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  updateStep(index: number, key: keyof FormStep, value: string) {
    this.form.update(f => ({
      ...f,
      steps: f.steps.map((s, i) => i === index ? { ...s, [key]: value } : s)
    }));
  }

  addStep() {
    this.form.update(f => ({
      ...f,
      steps: [...f.steps, { phase: '', items: '' }]
    }));
  }

  removeStep(index: number) {
    this.form.update(f => ({
      ...f,
      steps: f.steps.filter((_, i) => i !== index)
    }));
  }

  isValid(): boolean {
    const f = this.form();
    return f.title.trim().length > 0 && f.steps.every(s => s.phase.trim().length > 0);
  }

  save() {
    if (!this.isValid()) return;

    const f = this.form();
    const steps: ScenarioStep[] = f.steps.map(s => ({
      phase: s.phase.trim(),
      items: s.items.split('\n').map(i => i.trim()).filter(i => i.length > 0),
    }));

    const existing = this.scenario();
    if (existing) {
      this.data.updateScenario({
        ...existing,
        title: f.title.trim(),
        icon: f.icon,
        category: f.category,
        priority: f.priority,
        trigger: f.trigger.trim(),
        steps,
      });
    } else {
      this.data.addScenario({
        title: f.title.trim(),
        icon: f.icon,
        category: f.category,
        priority: f.priority,
        trigger: f.trigger.trim(),
        steps,
      });
    }

    this.saved.emit();
  }

  cancel() {
    this.onHide();
  }
}