import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';

//translation
import {provideTranslateService, provideTranslateLoader} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";

//PWA
import { provideServiceWorker } from '@angular/service-worker';

//theming
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './mypreset';
import { environment } from '../environments/dev.environment';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: APP_BASE_HREF, useValue: environment.base_href },
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
    }),
    provideHttpClient(),
    
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: environment.base_href+'/langs/',
        suffix: '.json'
      }),
      fallbackLang: 'ru',
      lang: 'ru'
    })

  ]
};
