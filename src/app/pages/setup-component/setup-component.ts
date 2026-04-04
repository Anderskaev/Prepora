import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { StorageService } from '../../services/storage-service';
import { DataService } from '../../services/data-service';

@Component({
  selector: 'app-setup-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './setup-component.html',
  styleUrl: './setup-component.scss',
})
export class SetupComponent {
 @Output() completed = new EventEmitter<void>();

  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm:  new FormControl('', Validators.required)
  });

  error   = signal('');
  loading = signal(false);

  constructor(
    private storage: StorageService,
    private auth:    AuthService,
    private data:    DataService
  ) {}

  async submit() {
    const { password, confirm } = this.form.value;

    if (password !== confirm) {
      this.error.set('Пароли не совпадают');
      return;
    }

    this.loading.set(true);
    try {
      // 1. Генерируем соль
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await this.storage.saveSalt(salt);

      // 2. Дериваем ключ
      const key = await this.auth.deriveKey(password!, salt);
      this.auth.setKey(key);

      // 3. Создаём пустой AppData и сохраняем
      await this.data.initEmpty();

      // 4. Помечаем что Setup завершён
      await this.storage.markSetupComplete();

      this.completed.emit();
    } catch (e) {
      this.error.set('Ошибка создания. Попробуйте ещё раз.');
    } finally {
      this.loading.set(false);
    }
  }
}
