import { Component, signal, inject, Output, EventEmitter, Input } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
//translation
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService, _} from "@ngx-translate/core";

import { TabsModule } from 'primeng/tabs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-component',
  imports: [RouterOutlet, TabsModule, RouterLinkWithHref, TranslatePipe],
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss',
})
export class MainComponent {
  @Input() activeTab: any;
  
  private translate = inject(TranslateService);
  //tabs: any[] = [];
  protected readonly title = signal('Prepora - Семейный антикризисный план');



  private langSub?: Subscription;
  tabs = signal<{ label: string; icon: string; route: string }[]>([]);
  private buildTabs() {
      this.tabs.set([
                { label: this.translate.instant('app.tabs.preparation.name'), icon: 'pi pi-shield', route: ''},
                { label: this.translate.instant('app.tabs.scenarios.name'), icon: 'pi pi-sparkles', route: '/scenarios'},
                { label: this.translate.instant('app.tabs.vault.name'), icon: 'pi pi-folder-open', route: '/vault'},                
                { label: this.translate.instant('app.tabs.control.name'), icon: 'pi pi-calendar-clock', route: '/control'},
                { label: this.translate.instant('app.tabs.settings.name'), icon: 'pi pi-cog', route: '/settings'},
      ]);
    }
  
    ngOnDestroy() {
      this.langSub?.unsubscribe();
    }


  constructor() {

    this.translate.addLangs(['ru', 'en']);
    this.translate.setFallbackLang('ru');

    //Initialize language and tabs
    this.translate.use('ru').subscribe(() => {
      this.buildTabs();
      this.langSub = this.translate.onLangChange.subscribe(() => {
      this.buildTabs();
    });       

     /* this.translate.get(['app.tabs'])
        .subscribe((tabs: any) => {

           this.tabs = [
                { label: tabs['app.tabs'].preparation.name, icon: 'pi pi-shield', route: ''},
                { label: tabs['app.tabs'].scenarios.name, icon: 'pi pi-sparkles', route: '/scenarios'},
                { label: tabs['app.tabs'].vault.name, icon: 'pi pi-folder-open', route: '/vault'},                
                { label: tabs['app.tabs'].control.name, icon: 'pi pi-calendar-clock', route: '/control'},
                { label: '', icon: 'pi pi-cog', route: '/settings'},
            ];         

        }); //end translate.get.subscribe*/
    }); //end translate.use.subscribe

  } //end constructor


}
