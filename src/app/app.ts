import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
//translation
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService, _} from "@ngx-translate/core";

import { TabsModule } from 'primeng/tabs';
import { environment } from '../environments/dev.environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TabsModule, RouterLinkWithHref, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})


export class App {
  private translate = inject(TranslateService);
  activeTab: any;
  tabs: any[] = [];
  protected readonly title = signal('Prepora - Семейный антикризисный план');

  constructor() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');

    this.translate.addLangs(['ru', 'en']);
    this.translate.setFallbackLang('ru');


    this.translate.use('en').subscribe(() => {
      this.translate.get(['app.tabs'])
        .subscribe((tabs: any) => {
            this.tabs = [
                { label: tabs['app.tabs'].preparation.name, icon: 'pi pi-shield', route: ''},
                { label: tabs['app.tabs'].scenarios.name, icon: 'pi pi-sparkles', route: '/scenarios'},
                { label: tabs['app.tabs'].vault.name, icon: 'pi pi-folder-open', route: '/vault'},                
                { label: tabs['app.tabs'].control.name, icon: 'pi pi-calendar-clock', route: '/control'},
            ];          

        }); //end translate.get.subscribe
    }); //end translate.use.subscribe



  } //end constructor
}
