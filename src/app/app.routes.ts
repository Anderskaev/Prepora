import { Routes } from '@angular/router';

import { ScenariosComponent } from './pages/scenarios/scenarios-component/scenarios-component';
import { ControlComponent } from './pages/control-component/control-component';
import { PreparationComponent } from './pages/preparation-component/preparation-component';
import { VaultComponent } from './pages/vault/vault-component/vault-component';
import { ScenariosListComponent } from './pages/scenarios/scenarios-list-component/scenarios-list-component';
import { ScenariosCardComponent } from './pages/scenarios/scenarios-card-component/scenarios-card-component';
import { SettingsComponent } from './pages/settings-component/settings-component';
import { VaultListComponent } from './pages/vault/vault-list-component/vault-list-component';
import { VaultCardComponent } from './pages/vault/vault-card-component/vault-card-component';

export const routes: Routes = [
    {path: '', component: PreparationComponent},
    {path: 'scenarios', component: ScenariosComponent,
        children: [
            {path: '', component: ScenariosListComponent, outlet: 'children'},
            {path: 'card/:id', component: ScenariosCardComponent, outlet: 'children'},
        ]
    },
    {path: 'vault', component: VaultComponent,
        children: [
            {path: '', component: VaultListComponent, outlet: 'children'},
            {path: 'card/:id', component: VaultCardComponent, outlet: 'children'},
        ]
    },
    {path: 'control', component: ControlComponent},
    {path: 'settings', component: SettingsComponent}
];


 //{ path: 'popup', component: PopupComponent, outlet: 'secondary' }