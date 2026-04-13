import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

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
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideServiceWorker('sw-notifications.js', {
            enabled: true,//!isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
            //registrationStrategy: 'registerImmediately'
          }),
    providePrimeNG({
            theme: {
                preset: MyPreset,
                   options: {
                      darkModeSelector: '.my-app-dark'
                     //darkModeSelector: false
                    }                
            }
    }),
    provideHttpClient(),
    
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: 'langs/',
        suffix: '.json'
      }),
      fallbackLang: 'ru',
      lang: 'ru'
    })

  ]
};
