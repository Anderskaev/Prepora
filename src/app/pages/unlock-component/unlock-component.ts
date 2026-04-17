import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PinService } from '../../services/pin-service';
import { DataService } from '../../services/data-service';
import { CardModule } from 'primeng/card';
import { Button } from "primeng/button";
import { TranslateModule } from '@ngx-translate/core';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-unlock-component',
  imports: [CommonModule, ReactiveFormsModule, CardModule, Button, TranslateModule, InputOtpModule, FormsModule, InputTextModule],
  templateUrl: './unlock-component.html',
  styleUrl: './unlock-component.scss',
})
export class UnlockComponent {
  @Output() unlocked = new EventEmitter<void>();
  pin_value: any = '';

  form = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  hasPin  = signal(false);
  error   = signal('');
  loading = signal(false);

  constructor(
    private auth:    AuthService,
    private pin:     PinService,
    private data:    DataService
  ) {}  

    ngOnInit() {
    // Проверяем есть ли сохранённый ПИН-ключ
    this.hasPin.set(this.pin.hasPinKey());
  }

  async onPinInput(event: Event) {
    const value = this.pin_value;//(event.target as HTMLInputElement).value;
    //console.log(this.pin_value);
    if (value.length === 4) {
      await this.unlockWithPin(value);
    }
  }

  async unlockWithPin(pin: string) {
    this.loading.set(true);
    try {
      const key = await this.pin.unlockWithPin(pin);
      if (!key) {
        this.error.set('Неверный ПИН');
        return;
      }
      this.auth.setKey(key);
      await this.data.load();
      this.unlocked.emit();
    } catch {
      this.error.set('Ошибка. Попробуйте ещё раз.');
    } finally {
      this.loading.set(false);
    }
  }

  async unlockWithPassword() {
    this.loading.set(true);
    try {
      const success = await this.auth.unlockWithPassword(
        this.form.value.password!
      );
      if (!success) {
        this.error.set('Неверный пароль');
        return;
      }
      await this.data.load(); 
      this.unlocked.emit();
    } catch {
      this.error.set('Ошибка расшифровки');
    } finally {
      this.loading.set(false);
    }
  }

  switchToPassword() {
    this.hasPin.set(false);
    this.error.set('');
  }
}
