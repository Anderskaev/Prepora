import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//translation
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService, _} from "@ngx-translate/core";


@Component({
  selector: 'app-scenarios-component',
  imports: [TranslatePipe, RouterOutlet],
  templateUrl: './scenarios-component.html',
  styleUrl: './scenarios-component.scss',
})
export class ScenariosComponent {
  private translate = inject(TranslateService);
}
