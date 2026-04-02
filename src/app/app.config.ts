import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { MyPreset } from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    providePrimeNG({
            theme: {
                preset: MyPreset,
                   options: {
                      darkModeSelector: '.my-app-dark'
                    }                
            }
        }) 
  ]
};
