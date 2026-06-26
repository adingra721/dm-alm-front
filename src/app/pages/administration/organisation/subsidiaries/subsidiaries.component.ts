import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-subsidiaries',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './subsidiaries.component.html',
  styleUrl: './subsidiaries.component.css'
})
export class SubsidiariesComponent {
  readonly entityKey = 'subsidiaries';
}
