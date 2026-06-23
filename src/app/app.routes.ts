import { Routes } from '@angular/router';
import { EntityCrudComponent } from './pages/entity-crud/entity-crud.component';

export const routes: Routes = [
  { path: '', redirectTo: 'parametrage/countries', pathMatch: 'full' },
  { path: 'parametrage/:entityKey', component: EntityCrudComponent },
  { path: '**', redirectTo: 'parametrage/countries' }
];
