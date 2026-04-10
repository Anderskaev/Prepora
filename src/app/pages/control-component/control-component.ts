// features/control/control.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { DataService } from '../../services/data-service';
import { Reminder } from '../../models/app-models';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    FormsModule, TranslateModule, ButtonModule, DialogModule,
    InputTextModule, SelectModule, DatePickerModule, TagModule
  ],
  templateUrl: './control-component.html',
})
export class ControlComponent {
  private data = inject(DataService);

  reminders = this.data.reminders;
  showForm  = signal(false);
  editItem  = signal<Reminder | null>(null);

  // Форма
  formTitle   = signal('');
  formDate    = signal<Date | null>(null);
  formRepeat  = signal<Reminder['repeat']>('NONE');

  repeatOptions = [
    { labelKey: 'control.repeat.none',    value: 'NONE'    },
    { labelKey: 'control.repeat.monthly', value: 'MONTHLY' },
    { labelKey: 'control.repeat.yearly',  value: 'YEARLY'  },
  ];

  // Сортируем по дате
  sorted = computed(() =>
    [...this.reminders()].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  );

  // Просроченные / предстоящие
  isOverdue(date: string): boolean {
    return new Date(date) < new Date();
  }

  isSoon(date: string): boolean {
    const diff = new Date(date).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // 7 дней
  }

  openAdd() {
    this.editItem.set(null);
    this.formTitle.set('');
    this.formDate.set(null);
    this.formRepeat.set('NONE');
    this.showForm.set(true);
  }

  openEdit(r: Reminder) {
    this.editItem.set(r);
    this.formTitle.set(r.title);
    this.formDate.set(new Date(r.date));
    this.formRepeat.set(r.repeat);
    this.showForm.set(true);
  }

  save() {
    if (!this.formTitle().trim() || !this.formDate()) return;
    const existing = this.editItem();
    this.formDate()!.setHours(19, 20, 0, 0); // Ставим полдень для единообразия
    const payload = {
      title:  this.formTitle().trim(),
      date:   this.formDate()!.toISOString(),
      repeat: this.formRepeat(),
    };
    if (existing) {
      this.data.updateReminder({ ...existing, ...payload });
    } else {
      this.data.addReminder(payload);
    }
    this.showForm.set(false);
  }

  delete(id: string) {
    this.data.deleteReminder(id);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  tagSeverity(date: string): 'danger' | 'warn' | 'secondary' {
    if (this.isOverdue(date)) return 'danger';
    if (this.isSoon(date))    return 'warn';
    return 'secondary';
  }
}