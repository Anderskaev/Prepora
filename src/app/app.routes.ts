import { Routes } from '@angular/router';

import { ScenariosComponent } from './pages/scenarios/scenarios-component/scenarios-component';
import { ControlComponent } from './pages/control-component/control-component';
import { PreparatonComponent } from './pages/preparaton-component/preparaton-component';
import { VaultComponent } from './pages/vault-component/vault-component';
import { ScenariosListComponent } from './pages/scenarios/scenarios-list-component/scenarios-list-component';
import { ScenariosCardComponent } from './pages/scenarios/scenarios-card-component/scenarios-card-component';
import { SettingsComponent } from './pages/settings-component/settings-component';

export const routes: Routes = [
    {path: '', component: PreparatonComponent},
    {path: 'scenarios', component: ScenariosComponent,
        children: [
            {path: '', component: ScenariosListComponent, outlet: 'children'},
            {path: 'card/:id', component: ScenariosCardComponent, outlet: 'children'},
        ]
    },
    {path: 'vault', component: VaultComponent},
    {path: 'control', component: ControlComponent},
    {path: 'settings', component: SettingsComponent}
];


 //{ path: 'popup', component: PopupComponent, outlet: 'secondary' }