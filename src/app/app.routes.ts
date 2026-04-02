import { Routes } from '@angular/router';
import { MainComponent } from './pages/main-component/main-component';
import { ScenariosComponent } from './pages/scenarios-component/scenarios-component';
import { ControlComponent } from './pages/control-component/control-component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'scenarios', component: ScenariosComponent},
    {path: 'control', component: ControlComponent}
];
