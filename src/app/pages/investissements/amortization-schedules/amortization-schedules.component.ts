import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-amortization-schedules',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './amortization-schedules.component.html',
  styleUrl: './amortization-schedules.component.css'
})
export class AmortizationSchedulesComponent {
  readonly entityKey = 'amortizationSchedules';
}
