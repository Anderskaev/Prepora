// features/scenarios/category-form.component.ts
import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataService } from '../../../services/data-service';
import { Category } from '../../../models/app-models';

const COLORS = [
  '#F97316','#EF4444','#8B5CF6',
  '#3B82F6','#10B981','#F59E0B',
  '#EC4899','#06B6D4','#6366F1',
];

@Component({
  selector: 'app-category-form-component',
  standalone: true,
  imports: [FormsModule, TranslateModule, ButtonModule, InputTextModule],
  templateUrl: './category-form-component.html',
})
export class CategoryFormComponent {
  private data = inject(DataService);

  closed = output<void>();

  categories = this.data.scenarioCategories;
  colors     = COLORS;

  // Форма новой категории
  newLabel = signal('');
  newIcon  = signal('📁');
  newColor = signal(COLORS[0]);

  isValid(): boolean {
    return this.newLabel().trim().length > 0;
  }

  add() {
    if (!this.isValid()) return;
    this.data.addScenarioCategory({
      label: this.newLabel().trim(),
      icon:  this.newIcon(),
      color: this.newColor(),
    });
    this.newLabel.set('');
    this.newIcon.set('📁');
    this.newColor.set(COLORS[0]);
  }

  delete(id: string) {
    this.data.deleteScenarioCategory(id);
  }
}