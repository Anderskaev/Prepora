import { Component, inject } from '@angular/core';
//translation
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService, _} from "@ngx-translate/core";

@Component({
  selector: 'app-preparaton-component',
  imports: [TranslatePipe],
  templateUrl: './preparaton-component.html',
  styleUrl: './preparaton-component.scss',
})

export class PreparatonComponent {
  private translate = inject(TranslateService);

}
