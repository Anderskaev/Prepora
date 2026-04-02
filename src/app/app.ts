import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';


import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TabsModule, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})


export class App {
  activeTab: any;
  tabs = [
    { label: 'Подготовка', icon: 'pi pi-home', route: ''},
    { label: 'Сценарии', icon: 'pi pi-home', route: '/scenarios'},
    { label: 'Контроль', icon: 'pi pi-home', route: '/control'},
  ];  
  protected readonly title = signal('prepora');

  constructor() {
     const element = document.querySelector('html');
     element!.classList.toggle('my-app-dark');
  }
}

//surface viva
//color rose