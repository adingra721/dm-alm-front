import { Component, Input } from '@angular/core';
import { KeyValuePipe, NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { groupedEntityConfigs } from '../core/entity-config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [KeyValuePipe, NgFor, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false;

  readonly groups = groupedEntityConfigs;
}
