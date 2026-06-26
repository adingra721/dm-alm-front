import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-projection-horizons',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './projection-horizons.component.html',
  styleUrl: './projection-horizons.component.css'
})
export class ProjectionHorizonsComponent {
  readonly entityKey = 'projectionHorizons';
}
