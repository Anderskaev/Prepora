import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DataService } from '../../../services/data-service';

@Component({
  selector: 'app-scenarios-card-component',
  imports: [RouterLink],
  templateUrl: './scenarios-card-component.html',
  styleUrl: './scenarios-card-component.scss',
})
export class ScenariosCardComponent {

  private data   = inject(DataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private currentId: string|null = "";

  scenarios          = this.data.scenarios;
  scenarioCategories = this.data.scenarioCategories;

  scenario = {};

  ngOnInit() {
      // Observable (reacts to URL changes)
    this.route.paramMap.subscribe(params => {
      this.currentId = params.get('id');
      this.scenario = this.scenarios().filter(s => s.id === this.currentId);
      console.log(this.scenario);
    });

  }

}
