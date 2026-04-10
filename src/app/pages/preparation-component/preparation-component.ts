// features/preparation/preparation.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


interface ChecklistState {
  [scenarioId: string]: { [stepIndex: string]: Set<number> }
}

@Component({
  selector: 'app-preparation',
  standalone: true,
  imports: [
    FormsModule, TranslateModule
],
  templateUrl: './preparation-component.html',
})
export class PreparationComponent {

}