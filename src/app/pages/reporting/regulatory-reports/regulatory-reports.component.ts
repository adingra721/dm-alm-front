import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-regulatory-reports',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './regulatory-reports.component.html',
  styleUrl: './regulatory-reports.component.css'
})
export class RegulatoryReportsComponent {
  readonly entityKey = 'regulatoryReports';
}
