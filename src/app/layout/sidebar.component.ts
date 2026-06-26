import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EntityConfig, groupedEntityConfigs } from '../core/entity-config';

interface SidebarMenu {
  title: string;
  icon: string;
  groups: Array<{ key: string; icon: string; value: EntityConfig[] }>;
  items: EntityConfig[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false;

  private readonly administrationGroups = [
    { key: 'Organisation', icon: 'fa fa-sitemap' },
    { key: 'Referentiels ALM', icon: 'fa fa-book' },
    { key: 'Parametres financiers', icon: 'fa fa-line-chart' },
    { key: 'Parametres assurance', icon: 'fa fa-shield' },
    { key: 'Securite', icon: 'fa fa-lock' }
  ];

  readonly menus: SidebarMenu[] = [
    {
      title: 'Investissements',
      icon: 'fa fa-briefcase',
      groups: [],
      items: groupedEntityConfigs['Investissements'] ?? []
    },
    {
      title: 'Comptabilisation',
      icon: 'fa fa-exchange',
      groups: [],
      items: groupedEntityConfigs['Comptabilisation'] ?? []
    },
    {
      title: 'Reporting',
      icon: 'fa fa-bar-chart',
      groups: [],
      items: groupedEntityConfigs['Reporting'] ?? []
    },
    {
      title: 'Administration',
      icon: 'fa fa-cog',
      groups: this.administrationGroups.map((group) => ({
        key: group.key,
        icon: group.icon,
        value: groupedEntityConfigs[group.key] ?? []
      })),
      items: []
    }
  ];
}
