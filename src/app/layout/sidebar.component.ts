import { Component, Input } from '@angular/core';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EntityConfig, groupedEntityConfigs } from '../core/entity-config';

interface SidebarMenu {
  title: string;
  icon: string;
  groups: Array<{ key: string; value: EntityConfig[] }>;
  items: EntityConfig[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [KeyValuePipe, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false;

  private readonly administrationGroups = [
    'Organisation',
    'Referentiels ALM',
    'Parametres financiers',
    'Parametres assurance',
    'Securite'
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
      groups: this.administrationGroups.map((key) => ({ key, value: groupedEntityConfigs[key] ?? [] })),
      items: []
    }
  ];
}
