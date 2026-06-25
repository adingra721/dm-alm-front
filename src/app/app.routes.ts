import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { EntityCrudComponent } from './pages/entity-crud/entity-crud.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'parametrage/countries', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'parametrage/:entityKey', component: EntityCrudComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'parametrage/countries' }
];
