import { Routes } from '@angular/router';

import { ScenariosComponent } from './pages/scenarios/scenarios-component/scenarios-component';
import { ControlComponent } from './pages/control-component/control-component';
import { PreparatonComponent } from './pages/preparaton-component/preparaton-component';
import { VaultComponent } from './pages/vault-component/vault-component';

export const routes: Routes = [
    {path: '', component: PreparatonComponent},
    {path: 'scenarios', component: ScenariosComponent},
    {path: 'vault', component: VaultComponent},
    {path: 'control', component: ControlComponent}
];
