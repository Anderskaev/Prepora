import { Component, inject } from '@angular/core';
//translation
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService, _} from "@ngx-translate/core";

@Component({
  selector: 'app-scenarios-component',
  imports: [TranslatePipe],
  templateUrl: './scenarios-component.html',
  styleUrl: './scenarios-component.scss',
})
export class ScenariosComponent {
  private translate = inject(TranslateService);
}
