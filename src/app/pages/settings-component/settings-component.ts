// features/settings/settings.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DataService } from '../../services/data-service';
import { AuthService } from '../../services/auth-service';
import { PinService } from '../../services/pin-service';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [
    FormsModule, TranslateModule, ButtonModule, InputTextModule,
    PasswordModule, SelectButtonModule, DialogModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './settings-component.html',
})
export class SettingsComponent {
  private data     = inject(DataService);
  private auth     = inject(AuthService);
  private pin      = inject(PinService);
  private storage  = inject(StorageService);
  private translate = inject(TranslateService);
  private toast    = inject(MessageService);


  exportLoading = signal(false);
  importLoading = signal(false);

  //ЭКСПОРТ
  showExportDlg = signal(false);
  exportPwd     = signal('');
  exportPwdConfirm = signal('');
  exportPwdError   = signal('');

  openExport() {
    this.exportPwd.set('');
    this.exportPwdConfirm.set('');
    this.exportPwdError.set('');
    this.showExportDlg.set(true);
  }  

  async confirmExport() {
    if (this.exportPwd() !== this.exportPwdConfirm()) {
      this.exportPwdError.set('settings.export.mismatch');
      return;
    }
    if (this.exportPwd().length < 4) {
      this.exportPwdError.set('settings.export.too_short');
      return;
    }
    this.exportLoading.set(true);
    try {
      const blob = await this.data.exportBlob(this.exportPwd());
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `prepora-${new Date().toISOString().slice(0,10)}.prp`;
      a.click();
      URL.revokeObjectURL(url);
      this.showExportDlg.set(false);
      this.toast.add({
        severity: 'success',
        summary:  this.translate.instant('settings.export.success'),
        life: 3000
      });
    } catch {
      this.toast.add({ severity: 'error',
        summary: this.translate.instant('settings.export.error'), life: 3000 });
    } finally {
      this.exportLoading.set(false);
    }
  }

  //ИМПОРТ

  importFile   = signal<File | null>(null);
  importPwd    = signal('');
  showImportDlg = signal(false);  

  
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.importFile.set(file);
    this.showImportDlg.set(true);
    // сбрасываем input чтобы можно было выбрать тот же файл повторно
    (event.target as HTMLInputElement).value = '';
  }  

  async confirmImport() {
    const file = this.importFile();
    if (!file || !this.importPwd().trim()) return;
    this.importLoading.set(true);
    try {
      await this.data.importBlob(file, this.importPwd());
      this.showImportDlg.set(false);
      this.importFile.set(null);
      this.importPwd.set('');
      this.toast.add({
        severity: 'success',
        summary: this.translate.instant('settings.import.success'),
        life: 3000
      });
    } catch {
      this.toast.add({
        severity: 'error',
        summary: this.translate.instant('settings.import.error'),
        detail:  this.translate.instant('settings.import.wrong_key'),
        life: 5000
      });
    } finally {
      this.importLoading.set(false);
    }
  }  

  // Язык
  languages = [
    { label: 'RU', value: 'ru' },
    { label: 'EN', value: 'en' },
  ];
  currentLang = signal(this.translate.currentLang || 'ru');

  // Смена языка
  changeLang(lang: string) {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  // ПИН
  hasPin     = signal(this.pin.hasPinKey());
  showPinDlg = signal(false);
  newPin     = signal('');
  pinError   = signal('');

  savePin() {
    if (this.newPin().length < 4) {
      this.pinError.set('settings.pin.too_short');
      return;
    }
    this.pin.saveKeyWithPin(this.newPin()).then(() => {
      this.hasPin.set(true);
      this.showPinDlg.set(false);
      this.newPin.set('');
      this.pinError.set('');
      this.toast.add({
        severity: 'success',
        summary: this.translate.instant('settings.pin.saved'),
        life: 3000
      });
    });
  }

  removePin() {
    this.pin.clearPin();
    this.hasPin.set(false);
    this.toast.add({
      severity: 'info',
      summary: this.translate.instant('settings.pin.removed'),
      life: 3000
    });
  }

  // Смена пароля
  showPwdDlg  = signal(false);
  oldPassword = signal('');
  newPassword = signal('');
  confirmPwd  = signal('');
  pwdError    = signal('');
  pwdLoading  = signal(false);


  async changePassword() {
    if (this.newPassword() !== this.confirmPwd()) {
      this.pwdError.set('settings.password.mismatch');
      return;
    }
    if (this.newPassword().length < 8) {
      this.pwdError.set('settings.password.too_short');
      return;
    }
    this.pwdLoading.set(true);
    try {
      const blob = await this.storage.loadBlob();
      if (!blob) return;
      const newBlob = await this.auth.changePassword(
        this.oldPassword(), this.newPassword(), blob
      );
      await this.storage.saveBlob(newBlob);
      // Обновляем ПИН если был
      if (this.hasPin()) {
        await this.pin.saveKeyWithPin(this.newPin());
      }
      this.showPwdDlg.set(false);
      this.oldPassword.set('');
      this.newPassword.set('');
      this.confirmPwd.set('');
      this.pwdError.set('');
      this.toast.add({
        severity: 'success',
        summary: this.translate.instant('settings.password.changed'),
        life: 3000
      });
    } catch {
      this.pwdError.set('settings.password.wrong_old');
    } finally {
      this.pwdLoading.set(false);
    }
  }

  // Экспорт

/*
  async exportData() {
    this.exportLoading.set(true);
    try {
      const blob = await this.data.exportBlob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `prepora-backup-${new Date().toISOString().slice(0,10)}.prp`;
      a.click();
      URL.revokeObjectURL(url);
      this.toast.add({
        severity: 'success',
        summary: this.translate.instant('settings.export.success'),
        life: 3000
      });
    } catch {
      this.toast.add({
        severity: 'error',
        summary: this.translate.instant('settings.export.error'),
        life: 3000
      });
    } finally {
      this.exportLoading.set(false);
    }
  }

  // Импорт
  

  async importData(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.importLoading.set(true);
    try {
      await this.data.importBlob(file);
      this.toast.add({
        severity: 'success',
        summary: this.translate.instant('settings.import.success'),
        life: 3000
      });
    } catch {
      this.toast.add({
        severity: 'error',
        summary: this.translate.instant('settings.import.error'),
        detail: this.translate.instant('settings.import.wrong_key'),
        life: 5000
      });
    } finally {
      this.importLoading.set(false);
      (event.target as HTMLInputElement).value = '';
    }
  }
*/
  // Сброс
  showResetDlg   = signal(false);
  resetLoading   = signal(false);
  resetConfirm   = signal('');
  readonly RESET_WORD = 'DELETE';

  async resetAll() {
    if (this.resetConfirm() !== this.RESET_WORD) return;
    this.resetLoading.set(true);
    try {
      await this.storage.clearAll();
      this.pin.clearPin();
      this.hasPin.set(false);
      this.auth.lock();
      window.location.reload();
    } finally {
      this.resetLoading.set(false);
    }
  }
}