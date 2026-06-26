import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-yield-curves',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './yield-curves.component.html',
  styleUrl: './yield-curves.component.css'
})
export class YieldCurvesComponent {
  readonly entityKey = 'yieldCurves';
}
