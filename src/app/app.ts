import { Component, signal } from '@angular/core';
import { StorageService } from './services/storage-service';
import { AuthService } from './services/auth-service';
import { MainComponent } from "./pages/main-component/main-component";
import { UnlockComponent } from "./pages/unlock-component/unlock-component";
import { SetupComponent } from "./pages/setup-component/setup-component";

type AppState = 'loading' | 'setup' | 'unlock' | 'ready';

@Component({
  selector: 'app-root',
  imports: [MainComponent, UnlockComponent, SetupComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})


export class App {
  state = signal<AppState>('loading');

  constructor(
    private storage: StorageService,
    private auth: AuthService
  ) {}  

  async ngOnInit() {
    // Если уже разблокировано (не должно быть при старте, но на всякий случай)
    if (this.auth.isUnlocked()) {
      this.state.set('ready');
      return;
    }

    // Проверяем есть ли данные в IndexedDB
    const hasData = await this.storage.hasData();
    this.state.set(hasData ? 'unlock' : 'setup');

    // Слушаем Page Visibility для автоблокировки
    this.setupVisibilityListener();
  }
  
    onSetupComplete() {
    this.state.set('ready');
  }

  onUnlocked() {
    this.state.set('ready');
  }

  private hiddenAt: number | null = null;
  private readonly LOCK_TIMEOUT = 5 * 60 * 1000;

    private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.hiddenAt = Date.now();
      } else {
        if (this.hiddenAt && Date.now() - this.hiddenAt > this.LOCK_TIMEOUT) {
          this.auth.lock();
          this.state.set('unlock');
        }
        this.hiddenAt = null;
      }
    });
  }

}
