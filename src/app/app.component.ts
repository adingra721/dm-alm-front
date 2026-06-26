import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { EntityConfig, entityConfigByKey } from './core/entity-config';
import { AuthService } from './core/auth.service';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterLink, RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentConfig?: EntityConfig;
  sidebarCollapsed = false;
  pageTitle = 'Dashboard';
  pageGroup = 'Dashboard';
  loginPage = false;

  constructor(private readonly router: Router, readonly auth: AuthService) {
    this.updateHeader(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateHeader(event.urlAfterRedirects));
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private updateHeader(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    this.loginPage = ['/login', '/forgot-password', '/reset-password'].includes(cleanUrl);
    const entityKey = cleanUrl.split('/').filter(Boolean).pop() ?? '';
    const config = entityConfigByKey.get(entityKey);

    this.currentConfig = config;
    this.pageTitle = config?.title ?? 'Dashboard';
    this.pageGroup = config?.group ?? 'Dashboard';
  }
}
