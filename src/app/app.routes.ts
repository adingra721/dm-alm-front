import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { EntityCrudComponent } from './pages/entity-crud/entity-crud.component';
import { entityPageRoutes } from './pages/entity-page-routes';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  ...entityPageRoutes,
  { path: 'parametrage/:entityKey', component: EntityCrudComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
