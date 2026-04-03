import { Component, inject } from '@angular/core';
//translation
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService, _} from "@ngx-translate/core";

@Component({
  selector: 'app-vault-component',
  imports: [TranslatePipe],
  templateUrl: './vault-component.html',
  styleUrl: './vault-component.scss',
})
export class VaultComponent {
  private translate = inject(TranslateService);
}
