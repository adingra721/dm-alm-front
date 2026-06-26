import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { EntityCrudComponent } from './pages/entity-crud/entity-crud.component';
import { entityPageRoutes } from './pages/entity-page-routes';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  ...entityPageRoutes,
  { path: 'parametrage/:entityKey', component: EntityCrudComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
